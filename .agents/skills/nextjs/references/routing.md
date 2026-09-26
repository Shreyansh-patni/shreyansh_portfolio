# Routing — Navigation, Dynamic Routes & proxy.ts

## What

The installed Next.js App Router uses filesystem-based routing. Directories under `src/app/` become
URL segments. Navigation uses `<Link>` (server and client) or `useRouter` (client only). Server-side
redirects use `redirect()` / `permanentRedirect()`. When a project uses backend-verified cookie
sessions, `proxy.ts` should own locale and machine-readable rewrites while authenticated layouts
resolve the verified session. Keep
deprecated `middleware.ts` only when an installed integration has a proven Edge-runtime requirement.

### Route segment conventions

| Pattern | Example URL | Params |
|---|---|---|
| `[slug]` | `/products/widget` | `{ slug: 'widget' }` |
| `[...slug]` | `/docs/a/b/c` | `{ slug: ['a','b','c'] }` — 404 on `/docs` |
| `[[...slug]]` | `/docs` or `/docs/a/b` | `{ slug: undefined }` or `{ slug: ['a','b'] }` |
| `(group)` | no URL segment | Layout sharing without affecting the URL |
| `@slot` | no URL segment | Parallel route — rendered alongside siblings |
| `(.)segment` | intercepts same-level | Intercepting route for modals |

### Key APIs

- **`<Link>`** — extends `<a>` with prefetching and client-side navigation. Prefetches when link enters viewport.
- **`useRouter()`** — client-only. `push()`, `replace()`, `refresh()`, `back()`, `forward()`, `prefetch()`.
- **`redirect(url)`** — server-side, throws internally (307 temporary). Use in Server Components, actions, route handlers.
- **`permanentRedirect(url)`** — 308 permanent. Use when a URL has moved forever.
- **`generateStaticParams()`** — pre-render specific dynamic route paths at build time.
- **Version-specific navigation features** — use only when the installed package documentation
  supports them. Do not copy a View/Instant Transition API from another Next.js minor.

## How

### Link component

```tsx
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export function Navigation() {
  const t = useTranslations('common');
  return (
    <nav>
      <Link href="/products">{t('nav.products')}</Link>
      <Link href="/legal/terms" prefetch={false}>{t('nav.terms')}</Link>
      <Link href="/dashboard" replace>{t('nav.dashboard')}</Link>
      <Link href="/products?page=2" scroll={false}>{t('nav.nextPage')}</Link>
    </nav>
  );
}
```

**Prefetching:** default prefetches static routes fully, dynamic routes up to nearest `loading.tsx`. `prefetch={true}` forces full. `prefetch={false}` disables for low-traffic links. **Scroll:** default scrolls to top. `scroll={false}` preserves position (pagination, tabs, filters).

### useRouter — client-side navigation

```tsx
'use client';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';

export function SearchForm() {
  const router = useRouter();
  const t = useTranslations('search');

  function handleSearch(query: string) {
    router.push(`/products?q=${encodeURIComponent(query)}`);
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSearch(new FormData(e.currentTarget).get('q') as string); }}>
      <input name="q" placeholder={t('placeholder')} />
      <button type="submit">{t('submit')}</button>
      <button type="button" onClick={() => router.replace('/products')}>{t('reset')}</button>
    </form>
  );
}
```

Prefer `<Link>` for all click-based navigation. Use `useRouter` only for programmatic triggers (form submit, keyboard shortcut, post-mutation redirect).

### View Transitions (React 19.2)

```tsx
// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: { viewTransition: true },
};
```

```tsx
import { ViewTransition } from 'react';
import { Link } from '@/i18n/navigation';

export function ProductLink({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <Link href={`/products/${id}`} transitionTypes={['product-detail']}>
      <ViewTransition name={`product-${id}`}>{children}</ViewTransition>
    </Link>
  );
}
```

Programmatic navigation uses the locale-aware router, for example
`router.push('/products/widget', { transitionTypes: ['product-detail'] })`. Do not enable this
experimental integration during an unrelated routing change.

CSS (`globals.css`) — always respect reduced motion:

```css
::view-transition-old(root) { animation: fade-out 150ms ease-out; }
::view-transition-new(root) { animation: fade-in 150ms ease-in; }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root), ::view-transition-new(root) { animation: none; }
}
```

### Dynamic routes and generateStaticParams

```tsx
// src/app/[locale]/products/[slug]/page.tsx
import { getProduct } from '@/lib/api/products-server';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    ['widget-pro', 'widget-lite'].map((slug) => ({ locale, slug })),
  );
}

export default async function ProductPage({ params }: PageProps<'/[locale]/products/[slug]'>) {
  const { locale, slug } = await params;  // ALWAYS await — sync removed in v16
  const t = await getTranslations({ locale, namespace: 'products' });
  const product = await getProduct(slug, locale);
  return (
    <main>
      <h1>{product.name}</h1>
      <p>{t('detail.description')}</p>
    </main>
  );
}
```

### Parallel routes

Render multiple pages simultaneously in one layout via `@slot` directories. Every slot **must** have a `default.tsx` — without it, soft navigation fails and the build breaks.

```
dashboard/
├── layout.tsx           # Receives { children, analytics, activity }
├── page.tsx             # Main content → {children}
├── @analytics/
│   ├── default.tsx      # REQUIRED — return null
│   └── page.tsx
└── @activity/
    ├── default.tsx      # REQUIRED — return null
    └── page.tsx
```

The layout receives each `@slot` as a named prop alongside `children`.

### Intercepting routes

Show a route in a different context (modal) on soft nav, preserving the full page on hard nav. Conventions: `(.)` same level, `(..)` one up, `(...)` app root, `(..)(..)` two up. Product modal pattern (see `folder-structure.md`):

```
src/app/[locale]/
├── @modal/
│   ├── default.tsx                 # return null
│   └── (.)products/[slug]/page.tsx # Modal on soft nav
└── (app)/products/[slug]/page.tsx  # Full page on hard nav
```

### Route groups

Directory name in `()` shares a layout without adding a URL segment. Use for layout boundaries: `(marketing)/` with nav+footer, `(app)/` with sidebar, `(auth)/` with centered card. Each group can have its own `layout.tsx`, `loading.tsx`, `error.tsx`.

### proxy.ts — locale, Markdown and original-path preservation

```typescript
// src/proxy.ts — schematic; use the repository's routing helpers
import { type NextRequest, NextResponse } from 'next/server';

const ORIGINAL_PATH_HEADER = 'x-internal-original-path';

export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const accept = request.headers.get('Accept') ?? '';

  const knownMarkdownTarget = maybeRewriteKnownMarkdownPage(pathname, accept);
  if (knownMarkdownTarget !== null) {
    const url = request.nextUrl.clone();
    url.pathname = knownMarkdownTarget;
    return NextResponse.rewrite(url);
  }

  if (wantsMarkdownResponse(pathname, accept)) {
    const url = request.nextUrl.clone();
    url.pathname = '/internal/agent-not-found';
    const forwarded = new Headers(request.headers);
    // set() overwrites a forged client value; never append or preserve it.
    forwarded.set(ORIGINAL_PATH_HEADER, validateOriginalPath(pathname));
    return NextResponse.rewrite(url, { request: { headers: forwarded } });
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)',],
};
```

The proxy must preserve the original pathname when an internal rewrite would otherwise hide it. The
internal header name is project-owned, excluded from backend forwarding, and overwritten for every
rewrite. Validate it as a bounded path beginning with `/`; do not trust a client-supplied value or
derive it from `Referer`/`Host`.

Known Markdown mirrors and unknown Markdown 404s are separate branches. The unknown handler returns
an explicit non-empty `Response` with status 404, `Content-Type: text/markdown; charset=utf-8`, and
`Vary: Accept`. Do not call `notFound()` from that catch-all Route Handler: production can otherwise
produce an empty 404 body. See `machine-readable.md` and `error-handling.md`.

Authentication is absent from this proxy. Authenticated locale layouts call the React-cached
`getServerSession()` and perform locale-aware redirects when the verified backend session is absent.
The backend's policies remain the final authorization boundary. See `auth.md`.

`proxy.ts` cannot declare or run on the Edge runtime. If an installed dependency genuinely requires
Edge middleware, retain `middleware.ts` and document the exception instead of performing a blind
rename. The matcher export remains `export const config`, not `proxyConfig`.

### Canonical-domain redirects

Choose one configured canonical HTTPS origin and one localized homepage. Apex and other owned
noncanonical hosts redirect directly to that origin in one hop while preserving the exact path and
query string. Prefer the deployed reverse proxy/CDN as the domain-normalization boundary and verify
it there; a Next.js unit test alone cannot prove the external redirect chain.

Never build canonicals, Open Graph URLs, JSON-LD IDs, sitemap entries, Markdown links, or `llms.txt`
links from the incoming Host or forwarded headers. Those use the validated site configuration.

## When

| Scenario | Use |
|---|---|
| Clickable navigation (nav, cards, breadcrumbs) | `<Link>` |
| Programmatic navigation (form submit, post-mutation) | `useRouter().push()` |
| Server-side redirect (auth, moved content) | `redirect()` |
| Permanent URL change (slug renamed, old route gone) | `permanentRedirect()` |
| Re-fetch server data without navigation | `useRouter().refresh()` |
| Single URL param | `[slug]` |
| Variable-depth, at least one segment required | `[...slug]` |
| Variable-depth, root also valid | `[[...slug]]` |
| Independent sections that load/error independently | Parallel routes (`@slot`) |
| Shared chrome around child pages | Nested `layout.tsx` |
| Modal overlay preserving background | Parallel route + intercepting route |
| Different layouts without URL segments | Route groups: `(marketing)/`, `(app)/`, `(auth)/` |
| Pre-render known slugs at build time | `generateStaticParams()` |
| Protect an authenticated route tree | Verified session in its layout, then backend policy checks |
| Normalize apex/noncanonical host | One-hop deployed reverse-proxy redirect preserving path/query |

## Never

- **No new `middleware.ts` for Node.js interception** — use `proxy.ts`. Preserve middleware only for
  a verified Edge-runtime requirement because proxy cannot run on Edge.
- **No sync params** — `params` and `searchParams` are async in v16. Always `await params`. Sync access is removed.
- **No `useRouter` from `next/router`** — use `next/navigation` or the project's locale-aware
  navigation wrapper. The Pages Router import does not exist in App Router.
- **No `useRouter` in Server Components** — client-only hook. Use `redirect()` for server-side navigation.
- **No `@slot/` without `default.tsx`** — build breaks. Return `null` or call `notFound()`.
- **No `router.push()` for simple links** — `<Link>` prefetches, is accessible, works without JS.
- **No `getStaticPaths`** — removed. Use `generateStaticParams`.
- **No auth-by-cookie-presence in `proxy.ts`** — authenticated layouts resolve the verified session.
- **No trust in an inbound internal-path header** — overwrite it during the rewrite and validate the
  preserved path.
- **No public URLs derived from Host/forwarded headers** — use canonical configuration.
- **No generic Route Handler proxy** — use Route Handlers only for the bounded cases in
  `api-client-pattern.md`.
- **No `next.config.ts` rewrites for request interception** — all goes through `proxy.ts`. See `machine-readable.md`.
- **No hardcoded strings in navigation** — every visible string uses `t()`.
