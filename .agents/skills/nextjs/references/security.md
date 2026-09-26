# Security — CSP, Headers, Tainting, CSRF & XSS

## What

Security hardening for an API-backed Next.js frontend. It covers trusted request context, Sanctum
CSRF, Content Security Policy, response headers, data tainting, XSS, external navigation, server-only
boundaries, and authenticated mutations. Apply minor-version APIs only after reading the installed
Next.js docs. The proxy examples require Node.js; retain Edge middleware only for a verified
integration requirement.

### Ownership boundaries

| Topic | Owner | Cross-reference |
|-------|-------|-----------------|
| Sanctum session and server forwarding | auth.md | security.md documents the trust boundary |
| Server Action authorization flow | auth.md | security.md adds IDOR prevention, rate limiting |
| `server-only` import pattern | security.md | auth.md references it as a dependency |
| CSRF via Server Actions | security.md | -- |
| Browser/server API transport | api-client-pattern.md | security.md covers header and URL trust |
| Environment variable mechanics | stack.md | security.md covers security rules and footguns |
| Rate limit logging | logging.md | security.md covers rate limit implementation |
| Webhook signature verification | security.md | api-client-pattern.md covers webhook route handlers |

## How

### 1. Content Security Policy -- nonce-based in proxy.ts

Next.js injects inline scripts for hydration. A strict CSP that blocks inline scripts breaks the app. Solution: generate a nonce per request in `proxy.ts`, pass it via header, use it in the CSP directive.

```typescript
// proxy.ts — CSP nonce generation + all secure response headers
import { type NextRequest, NextResponse } from 'next/server';

export function proxy(request: NextRequest): NextResponse {
  const nonce = crypto.randomUUID();
  const isDev = process.env.NODE_ENV === 'development';

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}'${isDev ? ` 'unsafe-eval'` : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' data: https:`,
    `font-src 'self'`,
    `connect-src 'self' ${process.env.API_BASE_URL ?? ''}`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  return response;
}
```

**Dev vs prod:** Development adds `'unsafe-eval'` to `script-src` for Turbopack HMR. Production is strict nonce-only.

Next.js extracts the nonce from the CSP request header and applies it to framework scripts during
dynamic rendering. Read `(await headers()).get('x-nonce')` only when a custom script needs the
explicit nonce.

**Rendering tradeoff:** a fresh per-request nonce requires dynamic rendering. It disables static
optimization and ISR for affected pages, and nonce-based pages cannot use Partial Prerendering.
Review that interaction when `cacheComponents` is enabled. Decide between nonce-based CSP and static
caching deliberately; do not copy this pattern into every application as a cost-free header change.

**CSP violation reporting:** Add `report-uri /api/csp-report` to the CSP string. Route handler at `app/api/csp-report/route.ts` logs violations via pino at `warn` level. See `references/logging.md`.

### 2. Secure response headers

All headers set in `proxy.ts` (code above), not in `next.config.ts` `headers()`. proxy.ts gives per-request control and nonce access.

| Header | Value | Why |
|--------|-------|-----|
| `X-Frame-Options` | `DENY` | Prevents clickjacking. Defense-in-depth alongside CSP `frame-ancestors 'none'` |
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forces HTTPS for 2 years, HSTS preload eligible |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Origin on cross-origin, full URL on same-origin |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), payment=()` | Disables sensitive browser APIs unless explicitly needed |
| `X-DNS-Prefetch-Control` | `on` | Allows DNS prefetching for performance |

### 3. Data tainting API

Prevents sensitive data from leaking to Client Components at build/render time.

```typescript
// next.config.ts — required
const nextConfig: NextConfig = { experimental: { taint: true } };
```

**`taintObjectReference(message, object)`** -- prevents an entire object from being passed to Client Components. Use for user records, session objects, any object with mixed public/private fields.

**`taintUniqueValue(message, owner, value)`** -- prevents a specific value from being passed to Client Components. Use for API keys, tokens, secrets.

```typescript
// A server-only domain module may taint a raw backend record, then return a safe DTO.
import 'server-only';
import { experimental_taintObjectReference as taintObjectReference } from 'react';

const raw = await serverApiRequest<RawAccount>('/api/v1/account');
taintObjectReference('Do not pass the raw account record to a Client Component.', raw);
return { id: raw.id, name: raw.name };
```

Tainting is defense in depth, not authorization. Check that the API exists in the installed React and
Next.js versions before enabling the experimental config. A Sanctum-session project has no
Next.js-held access or refresh token to taint.

### 4. CSRF protection

When backend mutations use Laravel Sanctum, the browser transport first requests
`/sanctum/csrf-cookie` with `credentials: 'include'`, then sends the decoded `XSRF-TOKEN` cookie in
`X-XSRF-TOKEN` on the mutation, again with credentials included. See `auth.md` and
`api-client-pattern.md`.

Next.js Server Action Origin checks are useful defense in depth but do not replace Sanctum or Laravel
policy checks. Browser-facing mutation Route Handlers must compare the request Origin with the
configured canonical first-party origin and reject missing/mismatched cross-site requests according
to the repository's explicit policy.

**`allowedOrigins`** for a known reverse proxy / CDN setup must be an explicit configured list, not a
value copied from request Host or forwarded-host headers:

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  serverActions: { allowedOrigins: ['www.example.com'] },
};
```

Webhook Route Handlers do not use browser CSRF. Verify the provider signature over the raw body and
apply replay/idempotency rules instead:

```typescript
// src/app/api/webhooks/stripe/route.ts
export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 401 });
  try {
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    log.info({ type: event.type }, 'webhook_received');
    // Process event...
    return new Response(null, { status: 200 });
  } catch {
    return new Response('Invalid signature', { status: 401 });
  }
}
```

### 5. XSS prevention

**React auto-escaping** is the primary defense. JSX interpolation (`{userInput}`) is escaped automatically.

**`dangerouslySetInnerHTML`** -- required for CMS HTML, rich text, markdown-to-HTML. Always sanitize:

```typescript
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlContent) }} />
```

**Navigation URLs** -- React does not make an API-provided URL trustworthy. Validate it before using
it in `href`, `window.location`, router navigation, a server redirect, or a popup:

```typescript
function isAllowedProviderUrl(value: string, allowedHosts: ReadonlySet<string>): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'https:'
      && allowedHosts.has(url.hostname)
      && url.username === ''
      && url.password === ''
      && url.port === '';
  } catch {
    return false;
  }
}
```

Use a separate exact-host/path policy for Stripe Checkout, Billing Portal, invoice recovery, Meta,
WhatsApp, Telegram, TikTok, YouTube, and every integration OAuth provider. `z.string().url()`, a
non-empty string, broad suffix matching, or substring checks are insufficient. See
`api-client-pattern.md` for the complete policy and adversarial cases.

**Zod `.transform()`** for defense-in-depth -- strip HTML tags at validation time:

```typescript
// src/lib/validations/comments.ts
export const commentSchema = z.object({
  body: z.string().min(1).max(2000).transform((s) => s.replace(/<[^>]*>/g, '')),
  authorName: z.string().min(1).max(100).transform((s) => s.replace(/<[^>]*>/g, '')),
});
```

### 6. Server-only modules

`import 'server-only'` at the top of any file that must never run on the client. Build error on violation: `"This module is intended for server use only."`

**Files that MUST include it in this architecture:** `src/lib/auth/server-session.ts`, every
`src/lib/api/*-server.ts`, server-only logging/config modules, and any file that reads server secrets.
Do not add it to `src/lib/api/client.ts`; that shared transport intentionally supports approved
browser domain clients as well as server callers.

**Counterpart:** `import 'client-only'` prevents import in Server Components. Use for files that depend on `window`, `document`, `localStorage`.

### 7. Environment variable security

- Server secrets: `process.env.SECRET_KEY` -- accessible only in Server Components, Server Actions, route handlers, proxy.ts
- Client-safe values: `process.env.NEXT_PUBLIC_API_URL` -- bundled into client JS, visible to everyone
- Never prefix a secret with `NEXT_PUBLIC_`

**Silent failure footgun:** `process.env.SECRET_KEY` in a Client Component returns `undefined` -- no error, no warning. `import 'server-only'` turns this into a build error.

**Runtime env reads:** only `NEXT_PUBLIC_` values are inlined into browser bundles. Server values
remain server-only, but a prerendered route can capture one during the build. Call `connection()`
when that route must read a deployment-specific server value per request. See `references/stack.md`.

**`.env` file rules:** never commit secret-bearing `.env*` files. Keep local and production secrets
in the deployment secret store, ignore local env files, and check in `.env.example` with variable
names and safe placeholders. Preserve a stricter existing repository policy.

### 8. Trusted request context and canonical origin

Treat every inbound header as browser-controlled unless a documented proxy boundary validates it.
Never authorize from `x-workspace-id`, `x-workspace-role`, `x-user-role`, tenant aliases, or similar
headers. Resolve user, workspace membership, and role from the verified backend session, then let the
backend's policies and scoped queries make the final authorization decision.

Server-to-backend requests forward an explicit allowlist only: required session cookies, the
configured first-party Origin, validated locale, XSRF when required, content headers, and correlation
ID. Never clone the complete inbound headers.

The first-party Origin and public canonical origin come from configuration validated at startup as
absolute allowed HTTPS origins. Do not construct either from inbound `Origin`, `Referer`, `Host`, or
`X-Forwarded-Host`. Forwarded-host headers remain untrusted unless a known proxy has already
validated them, and they still do not become a public-identity source.

Tests must forge all of these identity and host headers and prove the effective user, workspace,
role, backend Origin, and public URLs do not change.

### 9. Server Action security

Server Actions are public HTTP endpoints -- anyone can POST directly. Always validate + authorize inside every action.

**IDOR prevention:**

```typescript
const session = await getServerSession();
const parsed = z.string().uuid().safeParse(formData.get('postId'));
if (!parsed.success) return { success: false, error: 'validation_failed' };
const workspace = findSessionWorkspace(session, workspaceSlug);
if (!workspace) return { success: false, error: 'forbidden' };
await deletePostThroughBackendPolicy(workspace.id, parsed.data);
```

**Closure encryption:** Server Actions defined inside components have closed-over variables encrypted per build. Transport security only -- not secret-keeping. Self-hosted: set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` (base64, 32 bytes) for multi-instance consistency.

**Rate limiting** -- check before any work in expensive actions:

```typescript
// src/lib/rate-limit.ts
import 'server-only';
const store = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) { store.set(key, { count: 1, resetAt: now + windowMs }); return true; }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Usage: if (!checkRateLimit(`send-email:${session.user.id}`, 5, 60_000)) return { success: false, error: 'rate_limit_exceeded' };
```

In-memory store for single instance, Redis for distributed. See `references/logging.md` for logging rate limit hits at `warn` level.

### 10. Session-cookie ownership

The backend session framework owns its cookie format, rotation, expiry, and domain configuration.
Next.js forwards the cookie; it does not mint a parallel session. Verify production settings against
the backend contract:

| Setting | Value | Security purpose |
|---------|-------|-----------------|
| `httpOnly` | `true` | Prevents XSS from reading cookies via `document.cookie` |
| `secure` | `true` | Prevents cookie theft over unencrypted connections |
| `sameSite` | `'lax'` | Baseline CSRF -- cookies not sent on cross-site subrequests |
| `path` | `'/'` | Scopes cookie to entire app |
| `maxAge` | Session duration | Limits exposure window if cookie is stolen |

Do not change `SameSite`, domain, or lifetime generically. Cross-origin development, first-party
subdomains, OAuth returns, and Sanctum stateful domains must be tested as an integrated deployment.

## When

| Situation | Apply |
|-----------|-------|
| Custom `<Script>` or inline script with nonce CSP | Read nonce from headers, pass `nonce` attribute |
| CMS/rich text HTML rendering | `DOMPurify.sanitize()` before `dangerouslySetInnerHTML` |
| API-provided navigation URL | Apply the provider-specific HTTPS host/path policy |
| Text inputs from forms | Zod `.transform()` to strip HTML tags |
| New server-only file created | Add `import 'server-only'` as first import |
| New Server Action created | Verified backend session + input validation + backend policy check |
| Expensive Server Action (email, payment) | Rate limit before any work |
| Webhook route handler | Verify signature before processing payload |
| Reverse proxy / CDN setup | Add `allowedOrigins` in next.config.ts |
| Returning raw DB/API records from DAL | `taintObjectReference` the raw record, return a DTO |

## Never

- **No CSP in `next.config.ts` `headers()`** -- proxy.ts is the only place. `headers()` has no access to per-request nonces.
- **No nonce CSP without accepting dynamic rendering** -- per-request nonces disable static
  optimization and ISR for affected pages and cannot be used with PPR on those pages.
- **No `unsafe-inline` or `unsafe-eval` in production script/style CSP** -- `unsafe-eval` is
  dev-only for Turbopack HMR. If an installed dependency cannot run under a nonce policy, document
  and narrowly scope the exception instead of weakening every directive.
- **No unsanitized `dangerouslySetInnerHTML`** -- always DOMPurify. No exceptions.
- **No `NEXT_PUBLIC_` prefix on server secrets** -- the value is bundled into client JS, visible to everyone.
- **No relying on a layout to protect Server Actions** -- actions are separate POST endpoints. Resolve
  the verified session and rely on the backend policy inside each action.
- **No authorization from inbound role/workspace/user headers** -- they are browser-controlled.
- **No backend Origin or public canonical URL derived from request host headers** -- use validated
  configuration.
- **No navigation to an API-provided URL without an exact provider allowlist** -- syntax validation
  alone does not establish trust.
- **No trusting client-provided resource IDs without authorization** -- treat the ID as input and
  require the verified backend session plus the backend's resource policy/scoped query to authorize
  every mutation (IDOR).
- **No relying on closure encryption to keep data secret** -- transport security, not a secret-keeping mechanism.
- **No skipping rate limiting on expensive operations** -- email sending, payment processing, account creation must be rate-limited.
- **No `sameSite: 'none'` without a compelling reason** -- opens the door to cross-site request attacks.
