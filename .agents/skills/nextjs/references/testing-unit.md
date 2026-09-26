# Unit and Component Testing — Fast Regression Proof

## Scope

Unit/component tests prove pure contracts quickly: schemas, provider URL policies, API transport
logic, state merging, stale-response guards, Server Action mapping, hooks, and component behavior.
They do not prove production HTTP negotiation, raw server-rendered HTML, reverse-proxy redirects,
cookie interoperability, or backend authorization.

Use the repository's existing runner and setup. A Vitest project commonly uses jsdom for components
and a node environment for server-only modules. Keep path aliases aligned with `tsconfig.json`, load
`@testing-library/jest-dom/vitest`, and follow the repository's test-location convention.

## Shared API transport tests

For a first-party Sanctum transport, mock `fetch` only while testing `client.ts` itself and prove:

- GET uses `credentials: 'include'`;
- a mutation first calls `/sanctum/csrf-cookie`;
- the mutation sends the decoded `X-XSRF-TOKEN` and includes credentials;
- malformed/empty/error responses map to the common typed error;
- AbortSignal, query values, FormData, and request IDs propagate correctly;
- browser and server base URLs fail loud when absent or invalid.

```typescript
it('bootstraps Sanctum before a mutation', async () => {
  document.cookie = 'XSRF-TOKEN=csrf%20value; Path=/';
  const fetchMock = vi.fn<typeof fetch>()
    .mockResolvedValueOnce(new Response(null, { status: 204 }))
    .mockResolvedValueOnce(new Response('{"data":{"id":"1"}}', { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);

  await apiRequest('/api/v1/items', { method: 'POST', body: { name: 'One' } });

  expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/sanctum/csrf-cookie');
  const mutation = fetchMock.mock.calls[1]?.[1];
  expect(mutation?.credentials).toBe('include');
  expect(new Headers(mutation?.headers).get('X-XSRF-TOKEN')).toBe('csrf value');
});
```

Endpoint/domain-module tests mock `apiRequest` or `serverApiRequest`, not raw fetch. Assert paths,
encoding, schema parsing, request options, and failure mapping.

## Trusted request-context tests

Test the server options/session helper with forged inputs:

- `x-workspace-id`, `x-workspace-role`, `x-user-role`, and every supported legacy alias;
- `Origin`, `Referer`, `Host`, `X-Forwarded-Host`, and `Forwarded`;
- cross-tenant workspace IDs and elevated role strings.

The output must still use the configured canonical first-party Origin, include only required cookies
and allowlisted headers, resolve user/workspace/role from the mocked verified backend session, and
remain `cache: 'no-store'`. The helper must not forward the forged identity headers.

These tests guard local code paths; the integrated Compose suite must still prove Laravel policies
and Sanctum behavior.

## External navigation policy tests

Every API-provided URL used by `window.location`, router navigation, server redirect, or popup opening
has a provider-specific validator. Test each policy separately for its documented positive hosts and
paths.

Reject at least:

- `http:` and protocol-relative values in production;
- unrelated hosts and exact-host lookalikes (`trusted.example.evil.test`);
- suffix confusion (`eviltrusted.example`) and subdomains when only the exact host is allowed;
- user-info authorities (`trusted.example@evil.test` and `evil.test@trusted.example`);
- encoded, Unicode/punycode, mixed-case, trailing-dot, and whitespace host tricks;
- alternate ports;
- unexpected provider paths, fragments, or redirect parameters where the policy forbids them.

Maintain separate policies/tests for Stripe Checkout, Billing Portal, invoice recovery, Meta,
WhatsApp, Telegram, TikTok, YouTube, and every integration OAuth provider. A test that accepts every
value passing `z.string().url()` is a security regression.

## Async entity and merge tests

Read `client-async-state.md`. Use deferred promises to complete requests out of order and prove:

- entity A cannot overwrite entity B after a route/thread/workspace change;
- stale errors cannot replace the active entity's success state;
- poll, Reverb, and load-more results merge through functional state updates without lost rows or
  duplicates;
- filter/date-range changes invalidate old results and cursors;
- autosave cannot send or acknowledge another entity's snapshot;
- abort/unmount prevents obsolete updates;
- timeout becomes a visible retryable terminal state.

```typescript
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((done) => { resolve = done; });
  return { promise, resolve };
}
```

Resolve the newer request first and the old request last. In-order promises do not reproduce the
race.

## Server Action and component tests

For each mutation, test validation rejection, unauthenticated/unauthorized mapping, success,
backend-error mapping, and cache/router effects owned by the action. Mock the verified session and
domain client. Never infer authorization from a page/layout mock.

For components, use accessible queries (`getByRole`, `getByLabelText`) and test visible behavior,
loading, empty, error, retry, locale-specific copy, and keyboard interaction. Mock the translation
hook with an identity or controlled message function only when translation correctness is not the
subject.

## Machine-readable unit tests

- Parse JSON-LD and assert required Organization and SoftwareApplication fields and `@id` references.
- Require schema facts/prices to come from the same published visible data fixture.
- Parse `/llms.txt` output and require `## When to use ...`, `## How agents should use ...`,
  `## Do not use ...`, and `## Key resources` exactly once.
- Require canonical absolute HTTPS links and reject configured legacy/noncanonical domains.
- Test the Markdown 404 body and original-path validator, including forged internal headers.

These tests do not prove the HTTP status, content type, `Vary`, rewrite path, or production body.

## Test-level boundary

| Behavior | Minimum proof |
|---|---|
| Schema, URL policy, merge, response guard | Unit/component test |
| Status, headers, raw HTML, content negotiation, browser UI | Built production HTTP/browser test |
| Sanctum, CSRF, backend policies, billing, downloads, webhooks, queues | Integrated canonical Compose test |

Run repository scripts rather than substitute commands. Do not pre-generate every public page merely
to unit test it.

## Never

- No direct `notFound()` or mocked Route Handler test presented as deployed-response proof.
- No test that authorizes from browser-controlled role/workspace headers.
- No raw fetch mock for a domain module; mock the shared transport there.
- No only-happy-path schema or URL policy test.
- No async race test that resolves in request order.
- No snapshots as the sole behavior assertion.
- No order-dependent tests or leaked fake timers/mocks.
- No claim of "full stack" when the backend is mocked.
