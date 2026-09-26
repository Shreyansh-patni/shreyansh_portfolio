# Stack — Installed Next.js Contract & Build Toolchain

Every other reference assumes App Router semantics. The installed package and discovered project
contract outrank version-sensitive or architectural examples in this skill.

## Version policy

- Read the application's `package.json` and resolved lockfile before making framework assumptions.
  Use the repository's package manager (`npm ls next`, `pnpm why next`, or equivalent) when the
  resolved version is unclear.
- Read the installed, version-matched documentation under the application package's
  `node_modules/next/dist/docs/` before using a minor-version-specific API.
- Follow the installed version unless the user explicitly requests an upgrade. Never change the
  Next.js, React, or related framework versions during unrelated feature, bug-fix, SEO, or security
  work.
- When a project declares or resolves `next: 16.3.x`, preserve that line and never downgrade it to
  an older release. Use a 16.3 behavior only when the installed package and its bundled docs support
  it.
- For a new application, resolve the current stable release through the official generator and
  commit the lockfile. Do not freeze a dated minor recommendation in this skill. Prerelease or
  canary channels require an explicit user request.

## What

| Dependency | Version | Notes |
|---|---|---|
| Node.js | Installed Next.js requirement | Verify `engines`, CI, container, and installed support docs. |
| TypeScript | Installed compatible line | Preserve strict project settings. |
| React | Installed compatible line | Match the resolved Next.js peer requirements. |
| Next.js | Project-declared and lockfile-resolved | App Router only. Preserve an installed 16.3.x line. |
| Bundler | Turbopack (default) | Opt out with `next dev --webpack` / `next build --webpack` |
| React Compiler | Stable opt-in | `reactCompiler: true`; not enabled by Next.js by default |
| Linter | ESLint flat config | `next lint` removed in v16 — run `eslint .` directly |
| i18n | Project's established localization layer | Preserve it; this reference uses next-intl examples. |

## Project contract and canonical identity

Before applying any template, discover and preserve:

- whether Next.js owns identity or integrates with a separate backend authority;
- whether browser and server transports differ and which shared client owns them;
- whether authenticated redirects live in layouts, proxy, or another verified boundary;
- the locale routing, translation, and RTL contract;
- whether the design is light-only, dark-only, or theme-switchable;
- whether standalone/container output needs runtime-loaded files copied explicitly;
- the configured public canonical origin and trusted proxy boundary;
- the repository's build, production-server, and integrated-environment scripts.

Never introduce a parallel auth system, API transport, localization layer, theme mechanism, or
canonical source during unrelated work.

Public commercial products need one validated identity source with these verified inputs:

| Identity field | Requirement |
|---|---|
| Canonical public origin | Absolute HTTPS origin from validated configuration |
| Localized homepage | Canonical origin plus the verified default locale |
| Legal organization | Verified legal name, not the product or an invented entity |
| Contact email and telephone | Real monitored contact values supplied by the operator |
| Postal address | Complete verified address supplied by the operator |

Keep these values in one validated site/identity configuration module. Canonicals, Open Graph URLs,
JSON-LD, sitemap, robots, Markdown mirrors, `llms.txt`, and public links must consume that same
source. Never derive public identity from request `Host`, `Origin`, `Referer`, or forwarded-host
headers. Treat identity data as verified input: do not invent missing corporate details for another
project.

## How

### next.config.ts — illustrative options

```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Preserve existing settings. Add an option only when the installed docs and task require it.
  typedRoutes: true,            // Recommended when the project adopts generated route types.
  // reactCompiler: true,       // Stable opt-in; measure its build-time cost.
  // cacheComponents: true,     // Architectural opt-in for 'use cache' and PPR.

  // --- Turbopack (default in v16, no config needed) ---
  // Opt out: next dev --webpack, next build --webpack
  // Read installed docs before adding any Turbopack option; names/stability can change by minor.

  // --- Images ---
  images: {
    remotePatterns: [
      // Add allowed remote image domains here
      // { protocol: 'https', hostname: 'cdn.example.com' },
    ],
  },

  // --- Security ---
  // serverActions: {
  //   allowedOrigins: ['my-app.com'],  // Only if behind a reverse proxy / CDN
  // },
  // experimental: {
  //   taint: true,  // Enable taintObjectReference / taintUniqueValue
  // },
};

export default nextConfig;
```

`cacheComponents: true` is a project architecture decision, not a universal Next.js requirement. It
is required before using `'use cache'`, `cacheLife`, or `cacheTag`, and it opts the application into
the Cache Components rendering model. Do not add it to an existing project as an unrelated config
cleanup; follow `caching-strategy.md` and the migration checks in `upgrading.md`.

`typedRoutes: true` type-checks `<Link>` and router destinations. Run `next typegen` after route
changes so the global `PageProps`, `LayoutProps`, and `RouteContext` helpers stay current.

### TypeScript — tsconfig.json strict settings

```jsonc
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,   // arr[0] is T | undefined, not T
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "moduleResolution": "bundler",
    "module": "esnext",
    "target": "es2017",
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

`noUncheckedIndexedAccess` is non-negotiable. Without it, `params.slug` and `searchParams.page`
appear as `string` instead of `string | undefined`, hiding real bugs.

### ESLint — flat config (eslint.config.mjs)

```javascript
// eslint.config.mjs
import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'import/no-duplicates': 'error',
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
```

`next lint` is removed in v16. Run ESLint directly:

```bash
npx eslint .
```

### Environment variables

| Prefix | Visibility | Example |
|---|---|---|
| `NEXT_PUBLIC_` | Bundled into client JS — visible to everyone | `NEXT_PUBLIC_API_URL` |
| _(none)_ | Server-only — Server Components, Server Actions, route handlers, proxy.ts | `API_SECRET_KEY` |

`NEXT_PUBLIC_` variables are inlined into browser bundles at build time. Unprefixed variables stay
server-only. A prerendered route can still capture a server value during the build; when that route
must read a deployment-specific value on each request, opt it into request-time rendering first:

```typescript
import { connection } from 'next/server';

async function getConfig() {
  await connection();  // Opts into dynamic rendering, reads env at runtime
  return process.env.API_URL;  // Now read at request time, not build time
}
```

**Rules:**
- Never prefix a secret with `NEXT_PUBLIC_` — it will be in the client bundle.
- Use `connection()` in a prerenderable route when a server value must be read at request time.
- Keep secret-bearing `.env*` files out of version control. Check in `.env.example` with names and
  safe placeholders; follow an existing repository policy only when a particular env file is
  explicitly guaranteed to contain non-secret configuration.

### Validation pipeline

Run the repository's checked-in scripts, not generic substitutes. When the package exposes these
script names, the normal frontend sequence is:

```bash
# 1. Static and unit gates
npm run lint
npm run typegen
npm run typecheck
npm run test

# 2. Production artifact
npm run build
npm run start
```

The running production server is required for status, headers, raw HTML, content negotiation,
canonical redirects, sitemap, robots, Markdown, and `llms.txt` proof. When a change crosses into
the backend, run the repository's single canonical integration environment and tear it down. For a
Laravel/Sanctum repository, that commonly means Next.js, Laravel, Postgres, Redis, and required
workers. Do not describe a mocked backend run as full stack.

Repeat canonical-host endpoint checks after deployment when the acceptance criterion concerns live
behavior. Do not manually pre-generate every dynamic page merely to test it; request the real
production rendering mode.

**Concurrent dev/build:** Dev and production use separate output directories (`.next/dev` for
dev) so `next dev` and `next build` can run in parallel without cache conflicts.

## When

### Turbopack vs Webpack

| Situation | Use |
|---|---|
| Default development and builds | Turbopack (no flag needed) |
| A dependency fails with Turbopack | `next dev --webpack` as a temporary workaround, file a bug |
| Custom webpack config (module federation, WASM loaders) | `--webpack` flag |
| CI builds | Turbopack (default) — faster builds |

### React Compiler — what it replaces

The React Compiler auto-memoizes components and hooks. With `reactCompiler: true`:
- New manual `useMemo`, `useCallback`, and `React.memo` are rarely needed for rendering performance.
- Do not mechanically remove existing memoization. Keep it when it carries observable semantics
  (for example, stable identity consumed by an external library) or profiling proves it is needed.

### When to use `connection()`

| Scenario | Use `connection()`? |
|---|---|
| `NEXT_PUBLIC_` variable | No — inlined at build, available everywhere |
| Server value in an already dynamic Server Component or Route Handler | No — it is read at request time |
| Server value in a prerenderable route that differs without rebuild | Yes |
| Reading cookies/headers (already dynamic) | No — already opted into dynamic rendering |

## Never

- **No new `middleware.ts` for Node.js work** — use `proxy.ts`. Keep deprecated middleware only
  when the application genuinely requires the Edge runtime, which `proxy.ts` does not support.
- **No bypass of an API-backed architecture** — when the repository owns data through a backend API,
  all frontend data access goes through its shared transport rather than a new ORM connection.
- **No unstable or experimental API by default** — use one only when the task explicitly accepts
  its stability risk and the installed Next.js version is checked.
- **No `next lint` in Next.js 16+** — it is removed there. For an older installed project, follow
  that version's scripts until an explicit upgrade removes it.
- **No speculative manual memoization** — let the React Compiler handle ordinary rendering
  optimization, but preserve memoization that has semantic or measured value.
- **No Cache Components APIs without the opt-in** — `'use cache'`, `cacheLife`, and `cacheTag`
  require `cacheComponents: true` and an intentional migration.
- **No runtime below the installed Next.js requirement** — Next.js 16 requires Node.js 20.9 or
  newer; verify the installed support matrix before changing CI or container pins.
- **No `pages/` directory** — App Router only. No Pages Router, no `getServerSideProps`, no `getStaticProps`.
- **No inline fetch** — all data fetching goes through `src/lib/api/client.ts`. See `api-client-pattern.md`.
- **No hardcoded strings in JSX** — every user-visible string uses `t()`. See `i18n-conventions.md`.
- **No physical Tailwind properties** — use logical: `ps-`/`pe-` not `pl-`/`pr-`, `ms-`/`me-` not `ml-`/`mr-`, `text-start`/`text-end` not `text-left`/`text-right`.
- **No framework version edits during unrelated work** — preserve the manifest and lockfile,
  especially an installed 16.3.x line.
- **No public URL construction from request headers** — use the validated canonical identity source.
