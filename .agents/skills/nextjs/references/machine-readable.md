# Machine-Readable Content — Markdown, llms.txt and Negotiation

## Public contract

For products that intentionally support agent-readable discovery, public HTML pages have Markdown
mirrors, `/llms.txt` explains when and how to use the product, and `/llms-full.txt` provides the
approved expanded corpus. All output uses the same validated canonical HTTPS origin as metadata,
JSON-LD, sitemap, and robots.

Machine-readable public endpoints are a valid Route Handler use. They return explicit responses and
do not act as generic backend proxies.

## Markdown mirrors and page registry

Keep one public-page registry that supplies sitemap, Markdown mirrors, and agent indexes. Each entry
records its locale-aware path, title/description source, Markdown generator, indexability, and any
structured-data/trust-page classification. Adding a public page updates this registry in the same
change.

```typescript
interface MarkdownPageContext {
  readonly locale: string;
  readonly pathname: string;
  readonly params: Readonly<Record<string, string>>;
}

interface PublicPageEntry {
  readonly pattern: string;
  readonly titleKey: string;
  readonly descriptionKey: string;
  readonly match: (pathname: string) => MarkdownPageContext | null;
  readonly loadMarkdown: (context: MarkdownPageContext) => Promise<string>;
}
```

The HTML page and Markdown generator use the same locale, message catalogs, domain data, and verified
identity source. Do not maintain a second copy of translations, prices, capabilities, corporate
details, or product claims. A localized Markdown URL must render that locale rather than silently
falling back to the default language.

Co-locate the Markdown builder with the page or its domain module, but keep matching/indexing in the
shared registry. Dynamic entries receive their validated path params explicitly; a generator must
not reach for an undefined route variable or infer params from a rewritten internal URL. The
negotiated Route Handler resolves a registry match, calls `loadMarkdown(context)`, and returns an
explicit response. Cache successful mirrors only through the repository's documented cache model;
do not let a cached success or fallback obscure a real unknown-route 404.

Support both:

1. `GET /<locale>/<path>.md`;
2. `GET /<locale>/<path>` with `Accept: text/markdown`.

Both successful forms return `Content-Type: text/markdown; charset=utf-8` and `Vary: Accept`. Cache
only according to the project's rendering contract. Use `'use cache'`, `cacheLife`, or `cacheTag`
only when Cache Components is enabled and the installed Next.js docs support the exact API.

## Unknown-route negotiation

The proxy distinguishes known mirrors from unknown Markdown requests. Before rewriting an unknown
request to an internal 404 handler, it captures the original pathname and overwrites a project-owned
internal header (or validates a private query value). Never preserve a client-supplied internal-path
header.

The negotiated Route Handler returns an explicit response rather than calling `notFound()`:

```typescript
return new Response(markdown404(originalPath), {
  status: 404,
  headers: {
    'Content-Type': 'text/markdown; charset=utf-8',
    Vary: 'Accept',
  },
});
```

The body is non-empty and contains:

- `# Page not found`;
- the original requested pathname;
- an absolute canonical localized-homepage link;
- an absolute sitemap link;
- an absolute `/llms.txt` link;
- an absolute documentation or product-index link.

The same unknown `.md` path behaves identically. The HTML representation returns a real localized
`text/html` 404 with recovery links. See `error-handling.md` and `testing-e2e.md`.

## llms.txt is an instruction document

`/llms.txt` is not merely a link index. Its body must have these parseable H2 sections:

```markdown
# Product name
> One truthful sentence describing the product.

## When to use Product name

Specific best-fit jobs, supported channels, and use-case boundaries.

## How agents should use Product name

Explain when to read documentation, direct a user into the application, or use a documented API.
State the authentication/operator requirements for actions.

## Do not use Product name when

List unsupported channels, unofficial scraping, credential harvesting, prohibited outreach, and
unsupported autonomous actions.

## Key resources

- [Homepage](https://www.example.com/en)
- [Pricing](https://www.example.com/en/pricing)
- [Documentation](https://www.example.com/en/docs)
- [Privacy](https://www.example.com/en/legal/privacy)
- [Contact](https://www.example.com/en/contact)
- [Sitemap](https://www.example.com/sitemap.xml)
- [Full agent-readable content](https://www.example.com/llms-full.txt)
```

Use the real product name and canonical origin from configuration. Every link is absolute HTTPS. Do
not emit an old TLD, old brand, apex/noncanonical host, staging host, request Host, or forwarded host
unless that host is deliberately documented only as a redirect source.

`/llms-full.txt` includes only approved public content, identifies the canonical source URL for each
section, and never leaks authenticated routes, internal API paths, translation keys, draft copy,
secrets, or private data.

## Trust-anchor pages

Every public commercial product includes these locale-aware pages in the registry and agent indexes:

- `/<locale>/about`;
- `/<locale>/contact`;
- `/<locale>/legal/privacy`.

Each has a Markdown mirror, sitemap entry, `llms.txt` resource entry, footer link, canonical metadata,
and suitable JSON-LD. The corporate identity must come from verified operator input and remain
consistent across all three pages. Do not invent a legal name, email, phone number, address, social
profile, or jurisdiction.

## Canonical-domain checks

Maintain a repository check that parses or scans public output/configuration for forbidden legacy
domains and accidental apex canonicals. Keep a narrow allowlist for the intentional redirect-source
configuration and its tests; do not permit old domains in emitted metadata or documents.

The check covers at least canonical/alternate metadata, Open Graph URLs, JSON-LD IDs and URLs,
sitemap, robots, Markdown mirrors, `/llms.txt`, and `/llms-full.txt`.

## Required tests

Unit tests:

- parse `/llms.txt` and require each H2 section above exactly once;
- require all key-resource links to use the configured canonical HTTPS origin;
- require about, contact, and privacy entries in the page registry;
- reject legacy/noncanonical domains and internal routes from generated bodies;
- test explicit 404 response body generation and original-path validation.

Production HTTP tests against the built server:

- fetch `/llms.txt` and `/llms-full.txt`; require status 200, expected content type, and a non-empty
  body;
- fetch a real page as HTML, with `Accept: text/markdown`, and via `.md`;
- fetch an unknown HTML path, the same path with `Accept: text/markdown`, and the unknown `.md` path;
  assert status, content type, `Vary`, original path, and recovery links;
- inspect sitemap and robots from HTTP, not only generated functions.

Direct Route Handler invocation is useful unit coverage but cannot prove proxy negotiation,
production rendering, CDN variation, or the actual HTTP status/body.

## Never

- No `llms.txt` that is only a summary plus unstructured link list.
- No relative or noncanonical links in agent instructions.
- No Markdown content maintained independently from the visible page's facts.
- No dynamic Markdown generator that receives only a locale while implicitly depending on route
  params; pass validated params in its context.
- No `notFound()` exception as the negotiated catch-all Route Handler response.
- No trusted client-supplied original-path header.
- No missing `Vary: Accept` on negotiated representations.
- No machine-readable page omitted from the canonical page registry.
- No claim of live correctness without HTTP checks for `/llms.txt` and `/llms-full.txt`.
