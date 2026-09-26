# API-GUIDE.md — API Architecture Specification

## 1. Core Philosophy
The Shreyansh Patni Portfolio enforces a **Zero-Unnecessary-API** policy. 
APIs are a liability. They introduce latency, failure points, and security risks. 
Do not build an API unless external data access or client-server mutation is strictly required.

**V1 Status**: ALL API integrations are deferred. The current phase (V1) relies exclusively on static content imports (e.g., `content/projects.ts` -> Server Component). No endpoints shall be created in V1.

## 2. Source of Truth Hierarchy Compliance
All API design MUST comply with the project's source of truth:
1. `SECURITY.md` for zero-trust credentials and secrets management.
2. `ARCHITECTURE.md` for Next.js App Router constraints (RSC-first).
3. `DATABASE.md` for data persistence rules.

## 3. Integration Architecture
When APIs are introduced (V2+), they MUST follow the **Server-Side Integration Pattern**.

### 3.1 The Flow
```text
Provider API -> lib/<provider>.ts -> Normalized Typed Data -> Server Component
```

### 3.2 Constraints
- **UI Agnosticism**: UI components MUST NOT know about external provider structures. 
- **Server Execution**: All external API calls MUST occur on the server.
- **Normalization**: External responses MUST be parsed and validated into local application types before reaching the UI.
- **Type Safety**: Raw `any` or unchecked `unknown` responses are forbidden. Define strict Zod schemas or TypeScript interfaces for all provider responses.

## 4. Endpoints (Next.js Route Handlers)
If a client-facing endpoint is required, use Next.js Route Handlers (`app/api/<route>/route.ts`).

### 4.1 Implementation Rules
- **Method Restriction**: Implement ONLY the HTTP methods actively used by the client.
- **Input Validation**: All incoming requests (body, search params) MUST be strictly validated.
- **Error Obfuscation**: NEVER leak internal stack traces, raw provider errors, or sensitive failure details to the client. Return generic application-safe errors.

## 5. Resilience & Error Handling
External systems fail. The portfolio MUST NOT fail with them.

- **Graceful Degradation**: If an external API (e.g., Spotify, GitHub) fails, timeouts, or rate-limits, the corresponding UI section MUST render a safe fallback or disappear entirely. The rest of the site MUST remain 100% operational.
- **Timeouts**: No external request may hang indefinitely. Enforce strict AbortController timeouts.
- **Rate Limiting**: Honor provider rate limits. Do not poll aggressively. Use Next.js caching (`revalidate`) to minimize external calls.

## 6. Secrets Management
- All API keys, tokens, and secrets MUST be stored in `.env.local` and accessed ONLY on the server.
- NEVER expose secrets to the browser using `NEXT_PUBLIC_` unless explicitly intended for client-side consumption (which is rarely true for API integrations).

## 7. Specific Integrations (Future V2/V3)

### 7.1 GitHub (lib/github.ts)
- Fetch repository and contribution data without requesting excessive permissions.
- Normalize data into simple structures (e.g., `Repository` type with only name, url, description, stars).

### 7.2 Spotify (lib/spotify.ts)
- Fetch "Currently Playing" state.
- Normalize track info. Handle the "nothing playing" state gracefully.
- Handle token refreshes entirely server-side.

### 7.3 X/Twitter (lib/x.ts)
- Fetch recent posts.
- Ensure the site functions perfectly if X API is down or rate-limited.

### 7.4 Contact / Lead Generation
- Validate all form submissions server-side.
- Implement spam protection (rate limiting, honeypots) before exposing to the public.
