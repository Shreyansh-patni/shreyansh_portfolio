# API Client Pattern — Shared Transport, Server and Browser Domains

## Contract

All traffic to the application's backend goes through the typed shared transport in
`src/lib/api/client.ts`. Domain modules own paths, request/response types, envelope validation, and
URL policies. Do not create a second transport with inline `fetch`, Axios, or a catch-all Next.js API
proxy. If the repository is API-backed, do not bypass that boundary with a frontend ORM connection.

Projects with both server-rendered and highly interactive surfaces may intentionally have two
domain-client lanes:

```text
RSC / layout / Server Action / Route Handler
  └── src/lib/api/<domain>-server.ts
        └── serverApiRequest() / getServerApiRequestOptions()
              └── src/lib/api/client.ts

Interactive Client Component / hook
  └── src/lib/api/<domain>.ts
        └── apiRequest()
              └── src/lib/api/client.ts
```

Use `*-server.ts` for server-only wrappers that need incoming session context, trusted Origin,
locale, and `cache: 'no-store'`. In a Laravel Sanctum project that context is the incoming Sanctum
cookie plus the configured first-party Origin. Use plain domain modules for legitimate browser
polling, real-time subscriptions, load-more, interactive mutations, and autosave. A Client Component
may fetch when the interaction requires it; it still uses the approved domain module and the
concurrency rules in `client-async-state.md`.

## Shared transport responsibilities

`client.ts` is usable from both environments and owns:

- validated API base URL selection (`API_BASE_URL` on the server,
  `NEXT_PUBLIC_API_BASE_URL` in the browser);
- `credentials: 'include'`;
- the repository's browser CSRF initialization before mutations (including Sanctum when used);
- `X-XSRF-TOKEN` when required, content negotiation, and request correlation;
- abort signals, search parameters, cache options, and JSON/FormData bodies;
- safe response parsing and the common typed `ApiError` shape.

When the backend uses a first-party cookie session, the transport does not store or refresh JWTs and
does not inject bearer authorization. The illustrative implementation below assumes Sanctum; adapt
the CSRF helper to the verified backend contract rather than imposing Sanctum on another project.

```typescript
export interface ApiRequestOptions {
  readonly method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  readonly body?: unknown;
  readonly signal?: AbortSignal;
  readonly headers?: HeadersInit;
  readonly cache?: RequestCache;
  readonly searchParams?: Readonly<Record<string, string | number | boolean | undefined>>;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const method = options.method ?? 'GET';
  const xsrf = method === 'GET' ? undefined : await prepareSanctumMutation();
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (xsrf !== undefined) headers.set('X-XSRF-TOKEN', xsrf);

  const response = await fetch(buildApiUrl(path, options.searchParams), {
    method,
    credentials: 'include',
    headers,
    signal: options.signal,
    cache: options.cache,
    body: serializeBody(options.body, headers),
  });
  return parseApiResponse<T>(response);
}
```

Only `client.ts` calls the backend's raw `fetch`. Framework-owned fetches for assets or unrelated
third parties are separate concerns and still need their own explicit trust policy.

## Server domain modules

Server modules import `server-only`, use the shared request-options/session helper, and expose a
domain API suited to RSC and server mutations:

```typescript
// src/lib/api/contacts-server.ts
import 'server-only';

import { serverApiRequest } from '@/lib/auth/server-session';

export async function getContacts(workspaceId: string): Promise<ReadonlyArray<Contact>> {
  return serverApiRequest(`/api/v1/workspaces/${encodeURIComponent(workspaceId)}/contacts`);
}
```

The server helper forwards only the required `Cookie`, configured first-party `Origin`, validated
locale, optional XSRF header for mutations, and explicit transport headers. Never pass the full
incoming header map. Never derive Origin from inbound `Origin`, `Referer`, `Host`, or
`X-Forwarded-Host`. Strip hop-by-hop and proxy-only headers.

Authenticated/session requests are `no-store`. React `cache()` may deduplicate `getServerSession()`
within one render/request; it is not persistent auth caching.

## Browser domain modules

Plain domain modules may run in interactive clients. They use `apiRequest`, accept an `AbortSignal`
where requests can become obsolete, and validate unknown response envelopes before returning data:

```typescript
export async function listInboxMessages(
  workspaceId: string,
  threadId: string,
  signal?: AbortSignal,
): Promise<ReadonlyArray<InboxMessage>> {
  const payload = await apiRequest<unknown>(
    `/api/v1/workspaces/${encodeURIComponent(workspaceId)}/inbox/${encodeURIComponent(threadId)}`,
    { signal },
  );
  return parseInboxMessages(payload);
}
```

Capture entity IDs when starting a request and guard the response before merging it. Polling,
pagination, and autosave must follow `client-async-state.md`.

## Route Handler uses

Route Handlers are appropriate when they implement a real HTTP/protocol boundary:

- machine-readable public endpoints and Markdown content negotiation;
- webhooks and signature verification;
- on-demand revalidation;
- CSP or telemetry reporting;
- secure same-origin file streaming;
- browser-facing mutation bridges that require same-origin CSRF enforcement;
- protocol endpoints such as one-click unsubscribe.

They are not a default CRUD layer or a generic proxy around Laravel. Every BFF Route Handler must:

1. use a fixed upstream or a small explicit allowlist;
2. call the shared transport/server request-options helper;
3. forward only required headers and never forward the browser `Host`;
4. validate the configured/canonical Origin for browser mutations;
5. validate method, path parameters, body, size, and content type;
6. preserve the upstream status and only safe, explicitly selected response headers;
7. stream without buffering when the use case is file download;
8. reject arbitrary upstream URLs, redirect destinations, and open-proxy behavior.

For negotiated 404 or Markdown output, return an explicit `Response` with the body, status, content
type, and `Vary: Accept`; do not depend on a `notFound()` exception from a catch-all Route Handler.

## External navigation URL policies

Treat every API-provided navigation target as untrusted before `window.location.assign`, assigning
`window.location.href`, router navigation, server `redirect`, or popup opening. A generic
`z.string().url()` proves syntax only and is insufficient.

```typescript
interface ExternalUrlPolicy {
  readonly productionHosts: ReadonlySet<string>;
  readonly allowedPaths?: ReadonlyArray<RegExp>;
}

export function requireAllowedExternalUrl(value: string, policy: ExternalUrlPolicy): URL {
  const url = new URL(value);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('HTTPS required');
  if (!policy.productionHosts.has(url.hostname)) throw new Error('Untrusted host');
  if (url.username !== '' || url.password !== '' || url.port !== '') throw new Error('Ambiguous authority');
  if (policy.allowedPaths && !policy.allowedPaths.some((pattern) => pattern.test(url.pathname))) {
    throw new Error('Untrusted provider path');
  }
  return url;
}
```

Maintain separate documented policies for Stripe Checkout, Stripe Billing Portal, Stripe invoice
recovery, Meta/Instagram/Facebook, WhatsApp, Telegram, TikTok, YouTube/Google, and each integration
OAuth provider. Exact official hosts and path constraints belong beside the domain response schema;
do not collapse them into one broad suffix or "any HTTPS URL" rule.

Tests must cover malicious origins, user-info URLs, lookalike subdomains, suffix confusion, encoded
or Unicode host tricks, trailing dots, alternate ports, protocol-relative values, and HTTP downgrade.
Only provider-documented positive examples pass.

## Errors, retries and idempotency

Parse the backend's structured error contract once in the shared transport. Preserve safe status,
correlation, retry, and recoverable-URL fields that callers legitimately need; do not expose raw
internal messages or turn an unknown/malformed response into false success.

Retry a GET only when the operation semantics and repository policy permit it. Retry a mutation only
when the request carries an end-to-end idempotency key and the upstream contract enforces that key.
Browser retries, Route Handler retries, queues, and backend retries must not independently duplicate
the same side effect.

Tests cover upstream non-2xx preservation, malformed bodies, duplicate mutation attempts with and
without idempotency, download streaming/headers, and arbitrary upstream URL attempts.

## Trusted identity tests

- Spoof `x-workspace-id`, `x-workspace-role`, `x-user-role`, and legacy aliases. Domain calls must
  still resolve identity from the verified backend session.
- Forge `Origin`, `Referer`, `Host`, and forwarded-host headers. Server calls must still use the
  configured canonical first-party Origin.
- Assert the server request helper never forwards the complete inbound header set.
- When the project uses Sanctum, use integrated Compose tests for CSRF and policy behavior; mocked
  unit tests cannot prove the backend trust boundary.

## Never

- No inline backend fetch outside the shared transport.
- No encrypted JWT/bearer refresh architecture when the repository uses a first-party cookie session.
- No blanket ban on browser data access; use approved browser domain modules for interactive work.
- No server module imported into a Client Component.
- No auth or tenancy from browser-controlled headers.
- No public/canonical or backend first-party Origin derived from request host headers.
- No arbitrary upstream or redirect URL in a Route Handler.
- No navigation to an API-provided URL before its provider-specific policy succeeds.
- No mutation retry without server-enforced end-to-end idempotency.
- No malformed or unknown backend response converted into success.
- No claim that direct handler invocation proves production content negotiation or headers.
