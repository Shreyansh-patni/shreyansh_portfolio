# Authentication — Backend Session Contract

## Start with the repository contract

Do not choose an authentication architecture from framework preference. Read the backend contract,
cookie/domain configuration, existing session helper, authenticated layouts, and tests. Preserve the
project's model unless the user explicitly requests an auth migration.

Common valid authority shapes include a backend-owned cookie session, a Next.js-owned session
provider, a server-side token BFF, or a trusted external identity proxy. They are not
interchangeable. Trace login, cookie creation, current-user lookup, browser/server request paths,
CSRF, unauthenticated redirects, workspace selection, logout, password reset, and global session
invalidation before editing. Write down which system owns identity, session lifecycle, and final
authorization.

When the backend contract is Laravel Sanctum first-party cookie authentication, do **not** replace it
with encrypted access/refresh JWTs in a Next.js cookie and do not add bearer tokens to Laravel
requests. For another backend, preserve its verified session protocol rather than importing this
example blindly.

```text
Browser ── Sanctum/XSRF cookies ──▶ Laravel
   │
   └── Next.js RSC/Action/Route Handler
          └── forwards required Cookie + trusted Origin + locale ──▶ Laravel
```

The shared boundaries are:

- `src/lib/api/client.ts`: common browser/server transport, credentials, CSRF bootstrap, response
  parsing, and typed errors.
- `src/lib/auth/server-session.ts`: server-only Cookie/Origin request options and the React-cached
  `getServerSession()` call.
- `src/lib/api/*-server.ts`: RSC, layout, Server Action, and server Route Handler domain calls.
- plain `src/lib/api/<domain>.ts` modules: approved browser transport for interactive clients such as
  polling, Reverb-backed views, autosave, and load-more.

Both server and browser domain modules must use `src/lib/api/client.ts`; neither creates an ad hoc
backend fetch path.

If the established project instead uses a server-side token BFF, keep tokens server-only, serialize
refresh to prevent rotation races, expose only a minimal session DTO to Client Components, and test
invalidation across every privileged surface. Do not introduce that model into a backend-cookie
application merely because it is another valid shape.

## Sanctum browser requests

Every browser request to Laravel uses `credentials: 'include'`. Before a non-GET mutation, the shared
client initializes Sanctum with `GET /sanctum/csrf-cookie`, reads the URL-decoded `XSRF-TOKEN`
cookie, and sends it as `X-XSRF-TOKEN` on the mutation.

```typescript
async function prepareSanctumMutation(): Promise<string | undefined> {
  const response = await fetch(apiUrl('/sanctum/csrf-cookie'), {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new ApiError(response.status, 'Could not establish a secure session.');
  return readDecodedXsrfCookie();
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const method = options.method ?? 'GET';
  const token = method === 'GET' ? undefined : await prepareSanctumMutation();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (token !== undefined) headers.set('X-XSRF-TOKEN', token);

  const response = await fetch(apiUrl(path), {
    ...options,
    method,
    headers,
    credentials: 'include',
  });
  return parseApiResponse<T>(response);
}
```

Centralize this behavior. Domain clients must not each implement their own CSRF bootstrap or cookie
logic.

## Trusted server request context

Server requests forward only the context Laravel actually needs:

- the incoming session `Cookie` header;
- the configured canonical first-party `Origin`, validated as an absolute allowed origin at startup;
- the validated locale/`Accept-Language` value;
- `X-XSRF-TOKEN` when a server-side mutation requires the existing Sanctum token;
- explicit correlation or content headers owned by the shared transport.

Use one server request-options helper and force `cache: 'no-store'` for session and authenticated
requests. Never copy the complete inbound header set to Laravel.

```typescript
export async function getServerApiRequestOptions(
  options: ServerApiRequestOptions = {},
): Promise<ApiRequestOptions> {
  const requestCookies = await cookies();
  const headers = new Headers(options.headers);
  const cookie = serializeCookies(requestCookies);

  if (cookie !== '') headers.set('Cookie', cookie);
  headers.set('Origin', resolveCanonicalFirstPartyOrigin());
  headers.set('Accept-Language', await resolveValidatedLocale());

  const xsrf = requestCookies.get('XSRF-TOKEN')?.value;
  if (xsrf) headers.set('X-XSRF-TOKEN', decodeURIComponentSafely(xsrf));

  return { ...options, headers, cache: 'no-store' };
}
```

The canonical origin comes from validated configuration. Never construct Laravel's `Origin` from an
inbound `Origin`, `Referer`, `Host`, or `X-Forwarded-Host`. Forwarded-host headers remain untrusted
unless a known proxy boundary has already validated and normalized them; even then, public identity
and Laravel's first-party origin should come from configuration.

## Session resolution and redirects

`getServerSession()` calls Laravel's authenticated `/auth/me`-style endpoint through the server
request helper, validates the response shape, uses `cache()` from React to deduplicate within one
render/request, and remains `no-store` through its transport.

Authenticated layouts own login redirects and workspace selection. They resolve the verified
session before rendering the protected subtree; `proxy.ts` owns locale/rewrite/security concerns and
does not infer authentication from cookie presence.

```tsx
export default async function AuthenticatedLayout({ children }: LayoutProps<'/[locale]/(app)'>) {
  const session = await getServerSessionOrRedirect();
  return <AppShell session={session}>{children}</AppShell>;
}
```

Use the repository's existing 401 mapping and locale-aware login URL. Do not duplicate session calls
in every page when the owning layout already establishes the session, but every separately callable
mutation still performs server-side authentication and authorization.

## Authorization and workspace trust

Never authorize from inbound `x-workspace-id`, `x-workspace-role`, `x-user-role`, or similarly named
browser-controlled headers. Do not let a client header override session-derived identity even when a
route, component, or old test already sends one.

Treat aliases such as `x-user-id`, `x-is-admin`, tenant headers, and legacy spellings the same way.
Client-supplied IDs may select a resource, but only the verified session and backend policy can
authorize it.

Resolve the user, active workspace, membership, and role from the verified Sanctum session. Validate
route workspace identifiers against that session, then send the intended resource identifier to
Laravel. Laravel policies and scoped queries remain the final authorization authority; hiding a UI
control or checking a role in Next.js is only presentation/early rejection, never sufficient access
control.

Server Actions and browser-facing mutation Route Handlers are public entry points. Each must:

1. obtain the verified session;
2. validate untrusted input;
3. resolve workspace/resource context from that session;
4. call Laravel through the shared client;
5. rely on Laravel policy enforcement for the final decision.

## Required tests

- Prove login, logout, session expiry, and CSRF failure through the integrated Next.js + Laravel
  stack.
- When the product supports sign-out-everywhere or an auth epoch, prove invalidation across every
  privileged page, mutation, Route Handler, download, and realtime surface rather than only the UI.
- Spoof every supported and legacy role/workspace header (`x-workspace-id`, `x-workspace-role`,
  `x-user-role`, and aliases) with both higher and cross-tenant values. Access and effective role must
  not change.
- Prove a browser mutation first obtains the CSRF cookie, sends `X-XSRF-TOKEN`, and includes
  credentials.
- Prove server session reads are `no-store`, forward only the required cookies/context, and use the
  configured canonical Origin even when `Origin`, `Referer`, `Host`, and forwarded-host headers are
  forged.
- Treat unit tests as fast regression proof; the Sanctum/CSRF contract requires the canonical
  integrated Compose stack before release.

## Never

- No encrypted JWT access/refresh-token cookie when the project contract is a Sanctum session.
- No bearer-token storage or refresh-token rotation in the Next.js layer unless a different
  repository explicitly defines that architecture.
- No auth decision in `proxy.ts` based on cookie presence.
- No authorization from browser-supplied role, user, tenant, or workspace headers.
- No request-derived first-party Origin.
- No full inbound-header forwarding to Laravel.
- No cached authenticated/session response beyond React's per-render/request deduplication.
- No claim that a mocked Laravel response proves Sanctum, CSRF, or policy behavior.
