# Folder Structure

## What

Next.js App Router uses filesystem-based routing under `src/app/`. Directories become URL segments. Special files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `default.tsx`) define route behavior. Directories prefixed with `_` are private — ignored by the router. Directories wrapped in `()` are route groups — organize without adding URL segments. User-facing HTML and Markdown pages live under `[locale]/` for multilingual support via next-intl; root protocol endpoints such as sitemap, robots, and `llms.txt` remain unlocalized where their specifications require it.

## How

### Illustrative `src/` tree

Preserve the repository's established names and route groups. This tree demonstrates boundaries; it
is not a migration mandate.

```
src/
├── app/
│   ├── [locale]/                          # All routes under locale — next-intl
│   │   ├── layout.tsx                     # Root locale layout — NextIntlClientProvider, theme contract, fonts
│   │   ├── page.tsx                       # Homepage — /[locale]
│   │   ├── not-found.tsx                  # Locale-aware 404 page
│   │   ├── loading.tsx                    # Root loading skeleton
│   │   ├── error.tsx                      # Root error boundary ('use client')
│   │   │
│   │   ├── (marketing)/                   # Route group — shared marketing layout, no URL segment
│   │   │   ├── layout.tsx                 # Marketing-specific layout (nav + footer)
│   │   │   ├── about/
│   │   │   │   └── page.tsx               # /[locale]/about; registry also supplies .md mirror
│   │   │   ├── contact/
│   │   │   │   └── page.tsx               # /[locale]/contact; registry also supplies .md mirror
│   │   │   ├── legal/privacy/
│   │   │   │   └── page.tsx               # /[locale]/legal/privacy; registry also supplies .md mirror
│   │   │   └── pricing/
│   │   │       ├── page.tsx               # /[locale]/pricing
│   │   │       └── _components/           # Route-private components for pricing
│   │   │           └── pricing-table.tsx
│   │   │
│   │   ├── (app)/                         # Route group — authenticated app layout
│   │   │   ├── layout.tsx                 # App layout (sidebar + header)
│   │   │   ├── dashboard/
│   │   │   │   ├── page.tsx               # /[locale]/dashboard
│   │   │   │   ├── loading.tsx            # Dashboard skeleton
│   │   │   │   └── _components/           # Route-private — dashboard widgets
│   │   │   │       ├── stats-card.tsx
│   │   │   │       └── recent-activity.tsx
│   │   │   └── products/
│   │   │       ├── page.tsx               # /[locale]/products (list)
│   │   │       ├── [slug]/
│   │   │       │   ├── page.tsx           # /[locale]/products/[slug] (detail)
│   │   │       │   └── _components/
│   │   │       │       └── product-gallery.tsx
│   │   │       └── _components/
│   │   │           └── product-list-item.tsx
│   │   │
│   │   ├── (auth)/                        # Route group — login/register, minimal layout
│   │   │   ├── layout.tsx                 # Auth layout (centered card, no nav)
│   │   │   ├── login/
│   │   │   │   └── page.tsx               # /[locale]/login
│   │   │   └── register/
│   │   │       └── page.tsx               # /[locale]/register
│   │   │
│   │   └── @modal/                        # Parallel route slot for modals
│   │       ├── default.tsx                # REQUIRED — return null when no modal active
│   │       └── (.)products/[slug]/
│   │           └── page.tsx               # Intercepted product modal
│   │
│   ├── internal/markdown/[...slug]/
│   │   └── route.ts                       # Explicit Response target for negotiated/.md rewrites
│   ├── sitemap.ts                         # Dynamic sitemap generation
│   ├── robots.ts                          # Robots.txt generation
│   ├── llms.txt/
│   │   └── route.ts                       # llms.txt route handler
│   ├── llms-full.txt/
│   │   └── route.ts                       # llms-full.txt route handler
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── stripe/
│   │   │       └── route.ts               # Webhook handler
│   │   └── csp-report/
│   │       └── route.ts                   # CSP violation reporting endpoint
│   ├── api/secure-download/[id]/route.ts  # Fixed/allowlisted same-origin stream
│   ├── api/mutation-bridge/route.ts       # Narrow CSRF-validated browser mutation bridge
│   ├── unsubscribe/route.ts               # Protocol endpoint (for example one-click unsubscribe)
│   └── global-error.tsx                   # Catches errors in root layout
│
├── components/
│   ├── ui/                                # Tier 1 — primitives (Button, Input, Card, Badge)
│   │   ├── button.tsx                     # No business logic, no data fetching, no translations
│   │   ├── input.tsx                      # Props-only, purely presentational
│   │   └── card.tsx
│   └── features/                          # Tier 2 — feature components (ProductCard, UserAvatar)
│       ├── product-card.tsx               # Can use translations, can compose ui/ primitives
│       └── user-avatar.tsx                # No data fetching, no server actions
│
├── actions/                               # Server Actions where the repository uses them
│   ├── products.ts                        # 'use server' at top, Zod-validated mutations
│   └── auth.ts                            # Login/logout only when owned by this layer
│
├── lib/
│   ├── api/
│   │   ├── client.ts                      # Shared browser/server transport
│   │   ├── products.ts                    # Approved browser domain client
│   │   ├── products-server.ts             # RSC/server domain client, import 'server-only'
│   │   ├── users.ts                       # Approved browser domain client when needed
│   │   └── users-server.ts                # RSC/server domain client
│   ├── auth/
│   │   └── server-session.ts              # Verified backend session + server request options
│   ├── validations/                       # Zod schemas — one file per domain
│   │   ├── products.ts                    # createProductSchema, updateProductSchema
│   │   └── auth.ts                        # loginSchema, registerSchema
│   ├── tracking/
│   │   ├── types.ts                       # Provider-agnostic event interface
│   │   ├── tracker.ts                     # Main tracking dispatch
│   │   └── providers/                     # Provider mappers (GA, PostHog)
│   │       └── ga.ts
│   ├── seo/
│   │   ├── site-config.ts                 # Validated canonical origin
│   │   ├── identity.ts                    # Verified legal/contact identity
│   │   └── page-registry.ts              # Page entries for llms.txt, sitemap, Markdown
│   └── logger.ts                          # Pino setup, import 'server-only'
│
├── hooks/                                 # Shared client hooks — only 'use client' utilities
│   ├── use-debounce.ts
│   └── use-entity-request.ts              # Abort/generation guard for interactive requests
│
├── types/                                 # Shared TypeScript types/interfaces
│   ├── api.ts                             # ApiError, PaginatedResponse<T>, ActionResult<T>
│   └── product.ts                         # Product, ProductListItem, etc.
│
├── i18n/
│   ├── routing.ts                         # next-intl routing config (locales, defaultLocale)
│   └── request.ts                         # next-intl request config (locale detection, message loading)
│
├── proxy.ts                               # Node.js interception — locale, rewrites, CSP; not session auth
│
└── messages/                              # i18n message files
    ├── en/
    │   ├── common.json                    # Shared UI strings (buttons, labels, nav)
    │   ├── products.json                  # Product-related strings
    │   └── auth.json                      # Auth-related strings
    ├── ar/
    │   ├── common.json
    │   ├── products.json
    │   └── auth.json
    └── de/
        ├── common.json
        ├── products.json
        └── auth.json
```

### Public trust-anchor routes

A public commercial product includes `/<locale>/about`, `/<locale>/contact`, and
`/<locale>/legal/privacy` plus their Markdown mirrors. Register all three in the shared page registry,
sitemap, `/llms.txt`, and public footer. Their visible content and structured data consume the same
verified legal/contact identity module; never duplicate or invent corporate facts in page files.
Every locale renders translated visible copy, metadata, recovery links, and Markdown headings from
the same message catalogs. Do not use the default locale's copy as a silent fallback in another
locale.

### Component tiers

| Tier | Location | Can do | Cannot do |
|------|----------|--------|-----------|
| 1 -- primitives | `src/components/ui/` | Props-only, purely presentational | Business logic, data fetching, translations, server actions |
| 2 -- features | `src/components/features/` | Translations, primitives, approved browser domain clients when interactive | Ad hoc fetches, server-only imports |
| 3 -- route-specific | `src/app/*/_components/` | Server or client behavior appropriate to the route | Reuse outside its route |

Underscore prefix (`_components/`) makes the directory private to the router -- not a route segment.

### Promotion rules

| Trigger | Direction | Action |
|---------|-----------|--------|
| `_components/` component used in 2+ routes | `_components/` --> `features/` | Move file, update imports, verify it has no route-specific data fetching |
| `features/` component stripped of all business logic and translations | `features/` --> `ui/` | Remove translations, make props-only, update imports |
| `ui/` component gains translations or business logic | **Stop** -- it does not belong in `ui/` | Keep it in `features/` instead |

### Parallel route slots and `default.tsx`

Every `@slotname/` directory must contain a `default.tsx`. Next.js 16 fails the build when it is
missing.

```tsx
// src/app/[locale]/@modal/default.tsx — return null when no modal active
export default function ModalDefault() { return null; }

// Alternative: notFound() for hard-navigation 404 behavior
// export default function SlotDefault() { notFound(); }
```

### i18n message files

Pattern: `messages/{locale}/{namespace}.json`. One namespace per feature domain (`common`, `products`, `auth`, `dashboard`). Keys are flat within namespace using `section.element` convention. Create a new namespace when a page or feature exceeds 10 unique keys. Every key must exist in all locale files.

## When

**Where does this file go?**

```
Is it a Server Action (mutation)?
  └─ Yes → src/actions/{domain}.ts

Is it a Zod validation schema?
  └─ Yes → src/lib/validations/{domain}.ts

Is it an API domain wrapper?
  ├─ RSC/server-only context → src/lib/api/{domain}-server.ts
  └─ Approved interactive browser context → src/lib/api/{domain}.ts

Is it a shared TypeScript type?
  └─ Yes → src/types/{domain}.ts

Is it a Route Handler?
  └─ Does it own a real HTTP/protocol boundary: machine-readable output, webhook,
     revalidation, secure file stream, same-origin CSRF mutation bridge, CSP report,
     or one-click unsubscribe?
       ├─ Yes → src/app/**/route.ts with a fixed/allowlisted upstream and shared transport
       └─ No  → Use the existing server/browser domain client or Server Action pattern.

Is it a component?
  └─ Is it presentational with zero business logic?
       └─ Yes → src/components/ui/{name}.tsx
  └─ Does it use translations or compose primitives with feature logic?
       └─ Yes → src/components/features/{name}.tsx
  └─ Is it specific to one route?
       └─ Yes → src/app/[locale]/.../_components/{name}.tsx
```

**When to create a route group:** two or more sibling routes share a layout (e.g., `(marketing)/` with nav+footer, `(app)/` with sidebar), or auth pages need a distinct layout. Route groups add no URL segment.

## Never

- **Never co-locate Server Actions with pages.** Actions live in `src/actions/`, not next to `page.tsx`.
- **Never use barrel exports** (`index.ts` re-exports). They defeat tree-shaking and create circular dependencies.
- **Never put Zod schemas in action files.** Schemas go in `src/lib/validations/` so both actions and forms can import them without pulling in `'use server'` modules.
- **Never create a generic CRUD or arbitrary-upstream Route Handler.** Use only the bounded cases in
  `api-client-pattern.md`; fixed targets, minimal headers, Origin validation, and safe response
  forwarding are required for BFF handlers.
- **Never use relative imports beyond one level.** Always `@/` alias: `'@/components/ui/button'`, never `'../../../components/ui/button'`.
- **Never omit `default.tsx` from parallel route slots.** Build fails without it.
- **Never rename Edge middleware blindly.** `proxy.ts` always runs on Node.js; retain deprecated
  `middleware.ts` only when an installed integration has a verified Edge-runtime requirement.
- **Never put `_components/` outside `src/app/`.** Shared components go in `src/components/`.
- **Never use PascalCase file names.** Files: `kebab-case.tsx`. Exports: `PascalCase`.
- **Never place a component in `ui/` if it uses `t()` or business logic.** It belongs in `features/`.
