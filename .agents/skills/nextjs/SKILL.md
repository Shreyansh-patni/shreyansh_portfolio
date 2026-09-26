---
name: nextjs
description: |
  Build or review a Next.js App Router surface against the project's installed framework version
  and established architecture. Covers pages, layouts, async request APIs, server and browser API
  clients, authentication, client concurrency, Route Handlers, metadata, i18n, accessibility,
  machine-readable content, and layered testing. Use when a task touches Next.js and must preserve
  project-specific decisions such as the resolved framework version, backend session protocol,
  canonical domain, and locked visual theme.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
  - Grep
metadata:
  version: "3.0.0"
  argument-hint: "[Next.js page, component, route, or caching task]"
---

<EXTREMELY-IMPORTANT>
This skill is a routing shell over the Next.js reference set, not the full framework manual.

Non-negotiable rules:
1. Read `references/stack.md` first.
2. Read the repository's `AGENTS.md`, `CLAUDE.md`, and closest module map when present. They define
   the real route families, localization, design/theme, auth, transport, and test contracts.
3. Read the application `package.json`, resolved lockfile, and the installed version-matched Next.js
   docs under that package's `node_modules/next/dist/docs/` before applying version-specific guidance.
4. Follow the installed version unless the user explicitly requests an upgrade. Never upgrade,
   downgrade, or switch release channels during unrelated work.
5. Then load only the references needed for the actual task.
6. Keep user-visible text translated and all backend traffic in the project's shared API transport.
7. Keep the heavy Next.js guidance in `references/`, not inline here.
</EXTREMELY-IMPORTANT>

# nextjs

## Inputs

- `$request`: The Next.js page, component, routing, caching, or testing task

## Goal

Route Next.js work through the project's App Router conventions so implementation follows the established patterns for data access, metadata, localization, and rendering boundaries.

## Step 0: Read the stack contract

Always start with:

- `references/stack.md`

That establishes the locked decisions for runtime, config, and project-wide Next.js patterns.

For a new application, version recommendation, or framework upgrade, also read:

- `references/upgrading.md`

**Success criteria**: The project’s Next.js architecture assumptions are explicit before editing.

## Step 1: Load only the relevant references

Use the routing table to pick reference files that match the task. Do not bulk-load the full reference tree.

| Task | Read |
|------|------|
| New application, version choice, Next.js 15 to 16 upgrade | `references/upgrading.md` |
| Folder layout, file conventions, project structure | `references/folder-structure.md` |
| Route groups, dynamic routes, parallel/intercepting routes | `references/routing.md` |
| Creating or editing a page or layout | `references/page-checklist.md` |
| Component structure, client/server boundaries | `references/component-anatomy.md` |
| Data fetching, API client, fetch wrappers | `references/api-client-pattern.md` |
| Polling, pagination, autosave, stale async responses | `references/client-async-state.md` |
| Server actions, mutations, revalidation | `references/server-actions.md` |
| Caching, ISR, on-demand revalidation | `references/caching-strategy.md` |
| Translations, locale routing, message files | `references/i18n-conventions.md` |
| Error boundaries, error.tsx, not-found.tsx | `references/error-handling.md` |
| Structured logging, log levels | `references/logging.md` |
| Analytics, event tracking, consent | `references/tracking.md` |
| Authentication, middleware, session | `references/auth.md` |
| Security headers, CSP, CSRF, rate limiting | `references/security.md` |
| SEO, metadata, Open Graph, sitemap | `references/seo.md` |
| Agent-ready public pages, trust anchors, 404s, llms.txt | `references/agent-readiness.md` |
| Accessibility, ARIA, keyboard navigation | `references/accessibility.md` |
| Unit tests, component tests | `references/testing-unit.md` |
| E2E tests, Playwright | `references/testing-e2e.md` |
| Machine-readable output, JSON-LD, structured data | `references/machine-readable.md` |

Multiple tasks? Read multiple files. The references are self-contained.

**Success criteria**: The active context only contains the task-relevant Next.js conventions.

## Step 2: Implement with the core Next.js guardrails

Keep these rules active:

- async request-bound APIs are awaited
- data access uses the project API client, not ad hoc backend fetches or ORM calls
- RSC/server calls use the project's server domain modules; approved interactive clients use its
  browser domain modules; both converge on the shared transport
- visible strings go through the localization layer
- pages and layouts stay server-first unless a leaf component truly needs client mode
- metadata and SEO requirements stay attached to page work
- authentication and authorization come from the verified backend session, never browser-controlled
  role or workspace headers

**Success criteria**: The change fits the project’s App Router architecture instead of generic framework defaults.

## Step 3: Verify the affected surface

Run the repository's own scripts at the level that can prove the behavior:

- lint, `next typegen`, typecheck, and focused unit/component tests
- a built production Next.js server for HTTP status, headers, raw HTML, negotiation, redirects, and
  browser behavior
- the canonical integrated Compose stack when Laravel session, CSRF, queues, billing, downloads,
  webhooks, or another backend boundary is involved

Direct handler invocation cannot prove production HTTP behavior. A frontend run with Laravel mocked
is not a full-stack test.

**Success criteria**: The changed Next.js surface still behaves correctly.

## Guardrails

- Do not inline the whole Next.js handbook in `SKILL.md`.
- Do not skip `references/stack.md`.
- Do not hardcode user-facing strings when i18n is required.
- Do not bypass the project’s API-client and caching conventions.
- Do not replace or relocate the project's authentication/session authority during unrelated work.
- Do not add or remove theme support contrary to the project's locked design contract.
- Do not apply Next.js 16-only APIs to an older project unless the task includes the upgrade.
- Do not downgrade a project that already declares or resolves Next.js 16.3.x.
- Do not recommend `next@canary` or another prerelease unless the user explicitly opts into that
  release channel.
- Do not add `disable-model-invocation`; this is a normal domain skill.

For a public-page task, also load `agent-readiness.md`, `page-checklist.md`, `seo.md`,
`machine-readable.md`, and `testing-e2e.md`. Do not call it complete until the applicable raw-HTML, canonical identity,
structured-data, trust-page, HTML/Markdown 404, and live HTTP checks pass. Report external search
engine and brand-discoverability work separately from code completion.

## When To Load References

- `references/stack.md`
  Always.

- `references/upgrading.md`
  New applications, version choices, and framework upgrades.

- then only the task-relevant files under `references/`

## Output Contract

Report:

1. the declared and resolved Next.js version and which installed documentation was consulted
2. which Next.js references were loaded
3. the repository architecture or project profile followed
4. the change made
5. the verification run at each applicable test level
6. remaining deployment, live-endpoint, integration, or external-discoverability work
