# Next.js Version Selection and Upgrade

## Recommendation

For an existing application, the manifest, resolved lockfile, installed package, and installed docs
are the version authority. Inspect them before writing version-specific code:

```bash
# Read package.json and the active lockfile first, then use the project's package manager.
pnpm why next
node -p "require('next/package.json').version"

# Read the bundled docs that match that exact installed package.
find node_modules/next/dist/docs -maxdepth 2 -type f | sort
```

When an application declares or resolves `next: 16.3.x`, preserve that release line and do not
downgrade it. An ordinary feature, security fix, public-page change, or bug fix does not authorize a
framework upgrade or downgrade.

For a new application, use the official stable generator and commit its resolved lockfile. Do not
encode a dated minor ceiling in a reusable skill. A prerelease or canary is appropriate only when the
user explicitly accepts that release channel for a specific fix or experiment.

## New App Router application

Let the official generator choose a compatible Next.js, React, TypeScript, and ESLint set:

```bash
pnpm create next-app@latest
```

Select TypeScript, ESLint, the App Router, `src/`, and the `@/*` alias when they match the project
brief. After generation, keep the resolved stable version in the lockfile. Enable these options only
after understanding their scope:

- `typedRoutes: true` is the recommended type-safety default.
- `reactCompiler: true` is a stable opt-in that can increase compile time.
- `cacheComponents: true` is an architectural opt-in for Cache Components and Partial
  Prerendering; it changes rendering and caching behavior and is not required by Next.js itself.

## Upgrade paths

### Application already on Next.js 16.1 or newer

Use the built-in upgrade command, which targets stable releases by default:

```bash
pnpm next upgrade
```

Review dependency, config, codemod, and lockfile changes before accepting them.

### Next.js 15 or older

Use the official upgrade codemod, then review every transformation:

```bash
pnpm dlx @next/codemod@canary upgrade latest
```

The codemod package is published from the canary channel, but `upgrade latest` targets the stable
Next.js release. If dependencies still need a manual update:

```bash
pnpm add next@latest react@latest react-dom@latest
pnpm add -D @types/react@latest @types/react-dom@latest
```

In a workspace, run these commands in the actual application package and verify its package name
before applying a package-manager filter.

## Next.js 15 to 16 checklist

Audit every item that exists in the application:

| Surface | Next.js 16 requirement |
|---|---|
| Runtime | Node.js 20.9+; align local, CI, container, and production versions. |
| TypeScript and browsers | TypeScript 5.1+; supported browser floor is Chrome/Edge/Firefox 111+ and Safari 16.4+. |
| Async request APIs | Await `cookies()`, `headers()`, `draftMode()`, page/layout/route `params`, and page `searchParams`; synchronous compatibility is removed. |
| Generated route types | Run `next typegen`; use global `PageProps`, `LayoutProps`, and `RouteContext` without importing them. |
| Metadata routes | Await generated `id` values passed to sitemap and image functions; image function `params` are async. |
| Bundler | Turbopack is the default for `next dev` and `next build`; move `experimental.turbopack` to top-level `turbopack`, or use `--webpack` while migrating a real custom Webpack dependency. |
| Linting | Replace `next lint` and removed `next.config` `eslint` options with the ESLint CLI and native flat config. |
| Request interception | Rename `middleware.ts` / `middleware()` to `proxy.ts` / `proxy()` for the Node.js runtime. Keep deprecated middleware only when an Edge runtime is genuinely required; `proxy` cannot run on Edge. |
| Proxy flags | Rename options such as `skipMiddlewareUrlNormalize` to `skipProxyUrlNormalize`. Keep `export const config = { matcher: ... }` in `proxy.ts`. |
| Cache Components | Remove `experimental.dynamicIO` and `experimental_ppr`. Adopt `cacheComponents: true` only through an explicit Cache Components migration. |
| Cache invalidation | Pass a profile to `revalidateTag(tag, profile)`; use `updateTag()` only in Server Actions and `refresh()` only to refresh the client router from a Server Action. |
| Images | Review local image query strings (`images.localPatterns.search`), the 4-hour `minimumCacheTTL` default, changed `imageSizes` defaults, and stricter quality configuration. |
| Parallel routes | Add an explicit `default.tsx` to every parallel route slot; Next.js 16 fails builds when it is missing. |
| Runtime config | Replace removed `serverRuntimeConfig`, `publicRuntimeConfig`, and `next/config` usage with environment variables. Use `connection()` when a prerenderable route must read a server value at request time. |
| Removed features | Remove AMP APIs and obsolete `devIndicators` options. |

Do not enable Cache Components, React Compiler, View Transitions, or another opt-in merely because a
codemod exposes it. Each has a separate migration or build/runtime tradeoff.

## Installed Next.js 16.3 capabilities

Next.js 16.3 is a released line, not a prerelease. The official 16.3 material includes bundled
version-matched documentation for agents and Instant Navigations tooling. Use a 16.3 capability only
when the installed package's docs describe it and the task needs it:

- Prefer the installed docs under `node_modules/next/dist/docs/` over remembered behavior or a web
  article written for another patch.
- Treat Instant Navigations, partial prefetching, and related test helpers as opt-in architecture
  work. Do not retrofit them during unrelated changes.
- Check the installed API name and stability marker before using any feature described as
  experimental, canary-only, or newly stabilized.
- Keep deployment adapters and compiler/cache flags as explicit project decisions; a new minor does
  not authorize enabling them automatically.

## Verification

Run project scripts when they exist. Do not replace them with a generic command sequence. A typical
gate after an explicitly requested Next.js upgrade includes:

```bash
pnpm exec next typegen
pnpm exec eslint .
pnpm exec tsc --noEmit
pnpm test
pnpm exec next build
```

Also smoke-test proxy matchers, authentication, locale routing, Server Actions, cache invalidation,
image routes, metadata routes, and the real deployment adapter or self-hosting path when changed.
Verify both the manifest constraint and the resolved lockfile version.

## Never

- Never silently upgrade Next.js during unrelated work.
- Never downgrade a project from its declared and resolved 16.3.x line.
- Never recommend a canary because it has a larger version number than the stable release.
- Never claim compatibility from dependency installation alone; run type generation and a production
  build.
- Never copy Next.js 16-only APIs into a project that still resolves an older major.
- Never convert Edge middleware to Node.js proxy without checking runtime-dependent packages.
- Never enable Cache Components as a mechanical config rename; migrate and test its rendering model.

## Official sources

- [Next.js 16.3 release](https://nextjs.org/blog/next-16-3)
- [Next.js blog](https://nextjs.org/blog)
- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js upgrading guide](https://nextjs.org/docs/app/guides/upgrading)
- [Next.js releases](https://github.com/vercel/next.js/releases)
