# Agent-Ready Public Surfaces

## Purpose

Use this reference for public-page, AEO/GEO, machine-readable discovery, trust, indexability, or
unknown-route work. It is the release checklist that connects `page-checklist.md`, `seo.md`,
`machine-readable.md`, `error-handling.md`, and `testing-e2e.md`.

Public pages may be static, SSR, or dynamically server-rendered. The invariant is observable output:
an HTTP client receives truthful status, localized useful content, canonical identity, and recovery
paths without executing JavaScript.

## Contract discovery

Before editing, identify and preserve:

- the configured canonical HTTPS origin and localized homepage;
- supported locales, default locale, translation source, and RTL rules;
- the public-page registry and Markdown-generation boundary;
- the verified organization/product identity input;
- the deployed apex/noncanonical redirect owner;
- the repository's production-server and integrated test scripts;
- the locked design/theme contract.

Never fill missing identity or product facts with invented values. Ask for verified input when a
required fact cannot be discovered.

## Public response contract

For each applicable localized public page:

- HTML returns the intended status and an HTML content type;
- the original response body contains the real localized H1 and at least 500 meaningful characters;
- headings follow H1 to H2 to H3 without skipped levels;
- critical value proposition, pricing explanation, contact identity, and trust content are
  server-rendered rather than client-only;
- metadata, canonical, Open Graph, JSON-LD, sitemap, robots, Markdown, and agent indexes use the same
  canonical origin and locale;
- the Markdown mirror is available through both the `.md` form and `Accept: text/markdown` and uses
  the same facts/translations as HTML.

Static generation is not required. A hydrated browser DOM is not raw-HTML proof.

## Exact unknown-route contract

An unknown localized HTML request returns exactly `404`, an HTML content type, a localized visual
not-found page, and recovery links. The same public path requested with `Accept: text/markdown`, and
the same unknown `.md` path, each return:

- exactly `404`;
- `Content-Type: text/markdown; charset=utf-8`;
- `Vary: Accept`;
- a non-empty body containing `# Page not found`, the original requested path, and absolute links to
  the localized homepage, sitemap, `/llms.txt`, and documentation or a public product index.

If proxy negotiation rewrites the request, it overwrites a project-owned internal original-path
header or validates a private query value. The handler validates that bounded path again. Never
trust a client-supplied internal path, infer it from the rewritten URL, or build recovery links from
request Host/forwarded headers.

A negotiated catch-all Route Handler returns an explicit `Response`; it does not call `notFound()`
and risk a production 404 with an empty body.

## Agent instructions and trust anchors

`/llms.txt` is an instruction document, not only a summary/index. It contains one parseable section
for each of:

- `## When to use <Product>`;
- `## How agents should use <Product>`;
- `## Do not use <Product> when`;
- `## Key resources`.

The guidance states best-fit jobs and channel boundaries, whether an agent should read docs, direct a
user into the application, or call a documented API, and which unsupported/sensitive/autonomous
uses are forbidden. Key resources use absolute canonical HTTPS links for Homepage, Pricing,
Documentation or product index, Privacy, Contact, Sitemap, and `/llms-full.txt`.

Every public commercial product also exposes localized About, Contact, and Privacy pages. Each has
substantive raw HTML, one H1 and ordered headings, metadata/Open Graph/canonical, suitable JSON-LD, a
Markdown mirror, sitemap and `llms.txt` entries, and a public-footer link. Legal name, email,
telephone, address, and verified profiles come from one operator-verified identity source.

Organization and SoftwareApplication schema follow the complete field contract in `seo.md`, link
through a stable Organization `@id`, match visible content, and expose only currently published
prices.

## Verification and result categories

Run the repository's own scripts at the layer that owns the claim:

1. unit/component tests for schemas, identity builders, page registry, URL policies, and response
   body helpers;
2. a built production Next.js server for real status, headers, raw body, negotiation, redirects,
   rendered UI, sitemap, robots, and agent files;
3. the canonical integrated environment when cookies, CSRF, backend policies, database, queues,
   downloads, billing, webhooks, or authenticated workflows cross the backend boundary;
4. live canonical-host checks after deployment when the requirement concerns deployed behavior.

At minimum, issue all three unknown-route requests documented in `testing-e2e.md` plus live requests
for `/llms.txt` and `/llms-full.txt`. Verify apex/noncanonical redirects at the deployed reverse
proxy, not only in a Next.js unit test.

Report code-controlled completion separately from operator/external discoverability. Code can prove
canonical consistency, crawlability, metadata, schema, sitemap, robots, links, content, and redirect
chains. Search Console/Bing ownership, submissions, indexing requests, listings, profile ownership,
backlinks, recrawl time, and clean brand-search results remain external validation.

## Definition of done

- Installed Next.js version preserved and installed docs consulted.
- Repository architecture, localization, and theme contracts preserved.
- Repository lint, typegen, typecheck, and unit scripts pass when applicable.
- Built production server or canonical container starts.
- Raw localized HTML contains useful content and correct headings.
- Unknown routes satisfy the exact non-empty HTML/Markdown 404 contract.
- Canonical, Open Graph, schema, sitemap, robots, Markdown, and agent files share one origin.
- JSON-LD parses and contains verified required identity fields.
- Localized About, Contact, and Privacy pages are reachable and machine-readable.
- Spoofed identity headers do not change access when auth is in scope.
- API-provided navigation URLs pass provider-specific policies when used.
- Stale async responses cannot update a different active entity when interactive state is in scope.
- Integrated tests run when the change crosses the backend boundary.
- External discoverability is reported separately rather than marked fixed from source alone.

## Never

- No `200` for a nonexistent public route.
- No visual-only or zero-byte machine-readable 404.
- No client-only H1 or core public content.
- No request-derived canonical identity or recovery links.
- No `llms.txt` that lacks actionable use and non-use guidance.
- No fabricated corporate facts, profiles, product capabilities, or prices.
- No production-HTTP claim from direct handler invocation.
- No ranking/discoverability guarantee from metadata changes.
