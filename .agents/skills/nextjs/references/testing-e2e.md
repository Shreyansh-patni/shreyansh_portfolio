# Production HTTP, Browser and Integrated Testing

## Three explicit levels

1. **Unit/component tests** prove schemas, URL policies, state merging, and response guards. They are
   fast regression proof and cannot establish production HTTP behavior.
2. **Production HTTP/browser tests** run the built Next.js server and assert response status,
   headers, raw body, rendered UI, redirects, and content negotiation. They are required for public
   404s, Markdown, canonicals, sitemap, robots, `/llms.txt`, and raw-HTML visibility.
3. **Integrated Compose tests** run Next.js, the real backend, database, cache/queue services, and any
   required realtime worker through the repository's one canonical test stack. They are required for
   backend cookie sessions, CSRF, billing state, downloads, webhooks, queues, and authenticated
   workflows. Tear the stack down afterward.

A frontend browser run with the backend mocked is not full stack. Directly invoking a Route Handler
or `notFound()` is not deployed-response proof.

## Run repository scripts

Read `package.json`, root scripts, CI, and Compose docs. Use their build/start/test/teardown commands;
do not replace them with generic commands that omit setup, fixtures, or services. Do not require
manually pre-generating all public pages merely to test them: SSR and dynamic rendering are valid.

For the production HTTP level, build first and start the production server, not the dev server. A
Playwright configuration can point at that already-built server:

```typescript
export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  use: {
    baseURL: process.env.TEST_BASE_URL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: process.env.TEST_BASE_URL
    ? undefined
    : { command: 'npm run start', url: 'http://127.0.0.1:3000', reuseExistingServer: false },
});
```

The repository may wrap this in a script or container. Follow that wrapper.

## Raw server-rendered HTML

For each public page, inspect the original response body before JavaScript executes:

```typescript
test('public page exposes meaningful raw HTML', async ({ request }) => {
  const response = await request.get(`/${DEFAULT_LOCALE}/pricing`, {
    headers: { Accept: 'text/html' },
  });
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toMatch(/^text\/html\b/i);

  const html = await response.text();
  const document = parseHtml(html);
  expect(document.querySelectorAll('h1')).toHaveLength(1);
  expect(document.querySelector('h1')?.textContent?.trim()).not.toBe('');
  expect(meaningfulText(document).length).toBeGreaterThanOrEqual(500);
  expect(headingLevels(document)).toSatisfy(doesNotSkipLevels);
});
```

`meaningfulText` excludes scripts, styles, JSON-LD, navigation/footer boilerplate, and whitespace.
Assert the actual localized value proposition, pricing explanation, contact identity, or trust copy
appropriate to the page. A hydrated browser body length is insufficient because client-only content
can hide an empty original document.

Run this gate for the localized homepage, pricing/product pages, About, Contact, and Privacy. Each
trust page needs at least 500 meaningful raw-HTML characters, one H1, ordered H2/H3 headings,
metadata, canonical/Open Graph, suitable JSON-LD, Markdown mirror, sitemap/`llms.txt` entry, and
footer link.

## Complete HTML and Markdown 404 contract

Use a collision-resistant unknown path and test all three requests against the built server:

```typescript
const missing = `/${DEFAULT_LOCALE}/path-that-does-not-exist-${Date.now()}`;

test('unknown route has HTML and Markdown recovery responses', async ({ request }) => {
  const html = await request.get(missing, { headers: { Accept: 'text/html' } });
  expect(html.status()).toBe(404);
  expect(html.headers()['content-type']).toMatch(/^text\/html\b/i);
  const htmlBody = await html.text();
  const htmlDocument = parseHtml(htmlBody);
  expect(htmlDocument.querySelectorAll('h1')).toHaveLength(1);
  const recoveryUrls = [...htmlDocument.querySelectorAll('a[href]')].map((link) =>
    new URL(link.getAttribute('href') ?? '', CANONICAL_ORIGIN).href,
  );
  expect(recoveryUrls).toEqual(expect.arrayContaining([
    `${CANONICAL_ORIGIN}/${DEFAULT_LOCALE}`,
    `${CANONICAL_ORIGIN}/sitemap.xml`,
    `${CANONICAL_ORIGIN}/llms.txt`,
    CANONICAL_DOCS_OR_PRODUCT_INDEX,
  ]));

  for (const target of [missing, `${missing}.md`]) {
    const markdown = await request.get(target, {
      headers: target.endsWith('.md') ? {} : { Accept: 'text/markdown' },
    });
    expect(markdown.status(), target).toBe(404);
    expect(markdown.headers()['content-type'], target).toBe('text/markdown; charset=utf-8');
    expect(markdown.headers()['vary'], target).toContain('Accept');
    const body = await markdown.text();
    expect(body).toContain('# Page not found');
    expect(body).toContain(target);
    expect(body).toContain(`${CANONICAL_ORIGIN}/${DEFAULT_LOCALE}`);
    expect(body).toContain(`${CANONICAL_ORIGIN}/sitemap.xml`);
    expect(body).toContain(`${CANONICAL_ORIGIN}/llms.txt`);
    expect(body).toContain(CANONICAL_DOCS_OR_PRODUCT_INDEX);
  }
});
```

Also execute the release smoke with curl (substitute the configured canonical origin and locale):

```bash
curl -i "$PUBLIC_ORIGIN/$DEFAULT_LOCALE/path-that-does-not-exist"
curl -i -H 'Accept: text/markdown' \
  "$PUBLIC_ORIGIN/$DEFAULT_LOCALE/path-that-does-not-exist"
curl -i "$PUBLIC_ORIGIN/$DEFAULT_LOCALE/path-that-does-not-exist.md"
```

Visible text alone is not enough. Status, content type, `Vary`, non-empty body, original path, and all
recovery links are release gates.

## Canonical, schema and machine-readable HTTP tests

Against the built server, fetch and parse:

- localized canonical and Open Graph URLs;
- Organization and SoftwareApplication JSON-LD, including stable `@id` linkage and verified
  identity fields;
- sitemap and robots;
- a successful Markdown mirror through both access forms;
- `/llms.txt` and `/llms-full.txt`.

Require all public URLs to use the configured canonical HTTPS origin. Reject known legacy domains,
staging origins, and accidental apex URLs from emitted bodies. Parse `/llms.txt` and require the four
instruction sections described in `machine-readable.md`, plus absolute Homepage, Pricing,
Documentation, Privacy, Contact, Sitemap, and full-content links.

Test the owned noncanonical host at the deployed reverse proxy/CDN: it must redirect straight to the
canonical host in one hop while preserving path and query. A Next.js unit test cannot prove this.

## Internationalization

For every supported locale, verify:

- the route renders localized visible content and metadata rather than default-locale fallback;
- `<html lang>` and direction are correct;
- canonical and hreflang URLs are locale-aware;
- the Markdown mirror uses the same locale;
- 404 recovery copy and links are localized;
- logical CSS and keyboard/focus behavior work in RTL where applicable.

Use accessible locators (`getByRole`, `getByLabel`) for browser interactions. Prefer `<Link>` and
semantic navigation assertions over CSS selectors.

## Browser-flow discipline

Cover the critical journeys affected by the change: navigation/forms, authentication and logout,
loading/empty/error/retry states, locale switching, keyboard interaction, and responsive behavior.
Use the repository's existing fixtures and seed lifecycle so every test starts from isolated,
deterministic data.

- Prefer `getByRole` and `getByLabel`; use a stable test ID only when no semantic locator exists.
- Wait on an observable condition (`expect`, URL, response, or element state), never a fixed timeout.
- Keep release-gate retries at zero. Traces and screenshots are failure diagnostics, not a way to
  convert a flaky first attempt into green.
- Run the browsers/devices required by the repository. Include an RTL locale in visual or layout
  coverage when RTL is supported.
- Use visual snapshots selectively for complex layouts, responsive breakpoints, or RTL—not for every
  page and never as the only behavioral assertion.
- Keep credentials and fixture secrets out of source control.

## Integrated Compose contract

Use the repository's canonical integration script/Compose project. It must include the real Next.js
app, backend, database, Redis/cache/queues, and any service required by the workflow. Seed isolated
test identities and clean them up through the repository fixture lifecycle.

Integrated scenarios include:

- login/logout/session expiry and authenticated-layout redirects;
- CSRF bootstrap, success, missing token, and forged Origin;
- spoofed workspace/role/user headers that do not alter backend policy decisions;
- billing checkout/portal/recovery state and provider-host URL validation;
- secure downloads and safe header/status forwarding;
- webhook signature/idempotency and queue side effects;
- realtime/polling behavior where the product depends on it.

Always run the documented teardown, including after failure. Preserve artifacts/logs needed for
diagnosis before teardown.

## Retries and flakiness

Retries may collect traces or compare diagnostics, but a flaky first failure remains a failed release
gate. Do not configure CI so a later retry converts that run into green. Reproduce and fix the race,
or quarantine/delete the invalid test through the repository's explicit policy.

## Never

- No dev-server-only proof for production response contracts.
- No direct handler invocation presented as HTTP negotiation proof.
- No "full stack" label when the backend is mocked.
- No hydrated browser DOM as the only raw-content check.
- No visual-only 404 assertion.
- No generic commands substituted for repository scripts.
- No fixed `waitForTimeout()` in place of an observable condition.
- No CSS/XPath selector when an accessible locator expresses the behavior.
- No shared test state that depends on another test running first.
- No retry-masked release gate.
- No integrated stack left running after the suite.
- No claim that source changes alone prove external indexing or brand ranking.
