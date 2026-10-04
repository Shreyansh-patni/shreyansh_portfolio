# Antigravity Implementation Prompt --- GitHub-Style Contribution Heatmap

## Objective

Implement a real, production-ready GitHub-style contribution heatmap on
the personal portfolio website **shreyansh.cc**.

The attached reference image shows the visual direction: a yearly
contribution calendar similar to GitHub's contribution graph, with month
labels, weekday labels, contribution squares, and a Less → More legend.

Do **not** create a static visual mockup. The heatmap must be
data-driven and use real GitHub contribution/activity data wherever
technically possible.

------------------------------------------------------------------------

# 1. First: Inspect the Existing Project

Before changing anything:

1.  Inspect the entire existing portfolio structure.
2.  Read and follow:
    -   `AGENTS.md`
    -   existing design-system documentation
    -   existing component conventions
    -   existing content/data files
    -   existing GitHub/social configuration
3.  Identify:
    -   framework and version
    -   styling system
    -   shadcn/ui setup
    -   typography
    -   theme implementation
    -   existing portfolio sections
    -   existing API/server architecture
    -   existing deployment configuration
4.  Do not replace or reinstall existing dependencies unnecessarily.
5.  Reuse existing components and utilities whenever appropriate.

The implementation must feel native to the existing portfolio rather
than looking like a separately purchased widget.

------------------------------------------------------------------------

# 2. Reference Image

Use the attached GitHub contribution graph screenshot as the visual
reference.

The goal is to reproduce the **concept and information architecture**,
not to clone GitHub's exact UI.

Reference characteristics:

-   contribution calendar
-   month labels across the top
-   weekday labels on the left
-   small square cells
-   intensity-based contribution levels
-   Less → More legend
-   yearly activity summary
-   bordered container
-   compact, technical/editorial presentation

Do not copy GitHub branding, logos, proprietary text, or exact styling.

------------------------------------------------------------------------

# 3. Section Purpose

Create a portfolio section that communicates:

> **GitHub Activity**

Possible supporting copy:

> A look at what I've been building, shipping, and contributing to.

Keep the final copy aligned with the existing portfolio voice. Do not
invent achievements or metrics.

If the portfolio already has an appropriate section heading system,
reuse it.

------------------------------------------------------------------------

# 4. Real Data Requirement

The contribution graph must represent real data.

Preferred architecture:

``` text
GitHub
   ↓
Server-side data fetch
   ↓
Normalized contribution data
   ↓
GitHubHeatmap component
   ↓
shreyansh.cc
```

Do not expose private GitHub credentials or tokens to the browser.

Use the project's existing server-side architecture if available.

If the project already has a GitHub integration, reuse it.

If no GitHub integration exists, choose the simplest reliable
architecture that can retrieve public contribution/activity data without
introducing unnecessary infrastructure.

Before adding a dependency, check whether the existing stack can
accomplish the task.

------------------------------------------------------------------------

# 5. GitHub Username

Inspect the existing portfolio configuration/content for the author's
GitHub username.

Do NOT guess the username.

If an existing social/profile data file contains the GitHub username,
use that as the source of truth.

If no GitHub username exists anywhere in the project, create a clearly
documented configuration value rather than hardcoding an unknown
username throughout the codebase.

Example conceptual configuration:

``` ts
export const githubConfig = {
  username: "...",
};
```

Use the project's existing content/configuration conventions if they
differ.

------------------------------------------------------------------------

# 6. Contribution Data Model

Normalize the data into a simple UI-friendly structure.

Conceptually:

``` ts
type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};
```

The UI should not depend directly on the raw GitHub response format.

The data layer should handle:

-   dates
-   contribution counts
-   intensity levels
-   missing days
-   year boundaries
-   timezone/date normalization
-   API failures

Keep data-fetching logic separate from presentation.

------------------------------------------------------------------------

# 7. Heatmap Layout

Create a reusable component such as:

``` text
components/
└── github/
    ├── GitHubHeatmap.tsx
    ├── ContributionGrid.tsx
    ├── ContributionCell.tsx
    └── ContributionTooltip.tsx
```

Use different names if the project's existing conventions suggest better
names.

The main component should be reusable:

``` tsx
<GitHubHeatmap />
```

Avoid putting the entire implementation into one oversized component.

------------------------------------------------------------------------

# 8. Desktop Layout

On desktop, target a layout visually similar to the supplied reference:

``` text
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│        Oct   Nov   Dec   Jan   Feb   Mar   Apr   ...         │
│                                                              │
│ Mon     □ □ □ □ □ □ □ □ □ □ □ □ □ □ □ □ □ □ □ □             │
│ Wed     □ □ ■ □ □ □ □ □ □ ■ □ □ □ □ □ □ □ □ □ □             │
│ Fri     □ □ □ □ ■ □ □ □ □ □ □ □ ■ □ □ □ □ □ □ □             │
│ Sun     □ □ □ □ □ □ □ ■ □ □ □ □ □ □ □ □ □ □ □             │
│                                                              │
│        Less ▫ ▪ ▪ ▪ ▪ More                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

Important:

-   Use a proper 7-row calendar.
-   Month labels should align approximately with the corresponding
    weeks.
-   Do not manually hardcode month positions.
-   Calculate the calendar from dates.
-   Preserve consistent cell dimensions.
-   Keep spacing tight but readable.
-   Avoid excessive visual decoration.

------------------------------------------------------------------------

# 9. Responsive Behavior

The heatmap contains a lot of horizontal information.

Do NOT aggressively shrink the cells until they become unusable.

Recommended behavior:

### Desktop

Display the complete yearly graph within the available content width.

### Tablet

Allow controlled horizontal scrolling if necessary.

### Mobile

Use a horizontally scrollable heatmap viewport.

The surrounding section should remain responsive.

Example conceptual structure:

``` text
Section
└── Heatmap container
    └── Horizontal scroll viewport
        └── Fixed-width contribution calendar
```

Requirements:

-   no page-level horizontal overflow
-   smooth horizontal scrolling
-   visible focus states
-   usable touch interaction
-   no broken month labels
-   no clipped tooltips
-   no layout shift

------------------------------------------------------------------------

# 10. Contribution Intensity

Use 5 contribution levels:

``` text
0 = no contributions
1 = low
2 = medium-low
3 = medium-high
4 = high
```

Do not use arbitrary fake colors.

Use CSS variables/tokens compatible with the existing portfolio theme.

The intensity palette must work in both Light and Dark mode.

Prefer semantic variables such as:

``` css
--github-level-0
--github-level-1
--github-level-2
--github-level-3
--github-level-4
```

If the existing design system has an appropriate semantic color system,
integrate with it instead of creating a disconnected palette.

------------------------------------------------------------------------

# 11. Light + Dark Theme

This portfolio supports system-detected Light/Dark mode.

There must be:

-   NO theme toggle
-   NO sun/moon button
-   NO theme dropdown
-   NO manual theme switch

The heatmap must automatically adapt using the existing system theme
implementation.

QA both:

``` text
Light mode
Dark mode
```

The contribution levels must remain distinguishable in both.

Do not rely only on color differences for accessibility.

------------------------------------------------------------------------

# 12. Contribution Cell

Each cell should:

-   represent one calendar day
-   have a stable square shape
-   use consistent dimensions
-   have a subtle border/radius consistent with the design system
-   support mouse hover
-   support keyboard focus
-   provide accessible information

Example tooltip:

``` text
September 28, 2026
7 contributions
```

For zero:

``` text
September 28, 2026
No contributions
```

Use the actual date and actual contribution count.

Do not display fabricated values.

------------------------------------------------------------------------

# 13. Accessibility

Target WCAG AA.

Requirements:

-   semantic structure
-   keyboard-accessible cells
-   visible focus state
-   meaningful accessible labels
-   screen-reader-friendly contribution information
-   sufficient contrast
-   do not rely solely on color
-   respect `prefers-reduced-motion`
-   tooltips must not be the only way to understand the information

Do not add animation merely for visual novelty.

------------------------------------------------------------------------

# 14. Legend

Add a compact legend:

``` text
Less  □  ■  ■  ■  ■  More
```

Use the same five intensity levels.

Ensure the legend is understandable in both themes.

If appropriate, add accessible labels for the levels.

------------------------------------------------------------------------

# 15. Contribution Summary

Display a real contribution summary.

Example structure:

``` text
270 contributions in the last year
```

But:

**Never hardcode `270`.**

Calculate it from the actual data.

If data cannot be loaded, do not fabricate a number.

Use an honest fallback such as:

``` text
GitHub activity
```

or an appropriate loading/error state.

------------------------------------------------------------------------

# 16. Loading State

Implement a clean loading state.

Do not cause a large layout shift.

Possible approach:

-   preserve the heatmap container dimensions
-   use a restrained skeleton
-   avoid excessive shimmer animation
-   respect reduced motion

Use existing shadcn/ui primitives if appropriate.

------------------------------------------------------------------------

# 17. Error / API Failure State

The portfolio must not break if GitHub data cannot be retrieved.

Provide a graceful fallback.

For example:

``` text
GitHub activity is temporarily unavailable.
View my GitHub →
```

Use the existing GitHub profile URL from the portfolio configuration.

Do not display fake contribution data as a fallback.

------------------------------------------------------------------------

# 18. Caching / Performance

This is a portfolio website, so do not make GitHub requests on every
browser render.

Prefer:

``` text
Server-side fetch
+
reasonable caching/revalidation
+
static/server-rendered UI where possible
```

Follow the project's existing Next.js architecture.

Avoid unnecessary client-side JavaScript.

The heatmap should preferably render server-side.

Only use a client component where interactivity actually requires it,
such as tooltip/focus behavior.

------------------------------------------------------------------------

# 19. Dependency Rules

Do not install a large contribution-calendar library unless there is a
strong reason.

First determine whether the heatmap can be implemented cleanly with:

-   React
-   Tailwind
-   existing shadcn/ui
-   existing utilities
-   CSS

If a library is genuinely useful, inspect the existing dependency tree
first.

Do not introduce redundant packages.

------------------------------------------------------------------------

# 20. Existing UI Library Rules

Use the project's existing UI system.

Primary foundation:

**shadcn/ui**

Other available UI libraries may be used only if genuinely necessary:

1.  shadcn/ui
2.  Watermelon UI
3.  Aceternity UI
4.  Magic UI
5.  Motion Primitives
6.  HeroUI

Do NOT combine components from all six libraries.

For this heatmap, prefer the existing design system and shadcn/ui rather
than adding another library.

------------------------------------------------------------------------

# 21. Visual Design Direction

The portfolio should maintain its existing visual identity.

Priorities:

1.  Existing portfolio brand
2.  Existing design system
3.  Typography
4.  Spacing
5.  Accessibility
6.  GitHub-style information architecture

Do NOT make the section look like an embedded GitHub iframe.

Avoid:

-   gradients
-   glowing effects
-   excessive shadows
-   glassmorphism
-   unnecessary animation
-   giant rounded cards
-   excessive borders
-   decorative noise
-   fake GitHub branding

The heatmap should feel like a polished part of the portfolio.

------------------------------------------------------------------------

# 22. Suggested Section Structure

Conceptually:

``` tsx
<section>
  <header>
    <eyebrow>GITHUB ACTIVITY</eyebrow>
    <h2>Building in public.</h2>
    <p>...</p>
  </header>

  <div>
    <GitHubHeatmap />
  </div>
</section>
```

However, inspect the existing portfolio first and adapt this to its
established section architecture.

Do not blindly use this exact structure if the existing design system
has another pattern.

------------------------------------------------------------------------

# 23. Placement

Inspect the existing portfolio and choose the most appropriate position.

Potential placement:

``` text
Hero
↓
About
↓
Experience
↓
Projects
↓
GitHub Activity
↓
Hackathons / Gallery / Social
```

Do not disrupt the existing information hierarchy.

Use the current portfolio structure as the source of truth.

------------------------------------------------------------------------

# 24. Mobile QA

Test at minimum:

``` text
320px
375px
390px
430px
768px
1024px
1280px
1440px
1920px
```

Verify:

-   no page-level horizontal overflow
-   heatmap remains usable
-   month labels align
-   cells remain square
-   tooltip remains usable
-   section spacing is correct
-   text doesn't overflow
-   keyboard focus remains visible

------------------------------------------------------------------------

# 25. Theme QA

Explicitly inspect:

### Light

-   section
-   container
-   cells
-   intensity levels
-   text
-   borders
-   tooltip
-   legend
-   focus states

### Dark

Repeat the exact same checklist.

Do not assume that CSS variables automatically guarantee visual quality.

------------------------------------------------------------------------

# 26. Browser QA

Verify:

-   Chromium
-   Firefox
-   Safari if available

Pay special attention to:

-   CSS grid sizing
-   horizontal scrolling
-   tooltip positioning
-   date labels
-   focus behavior

------------------------------------------------------------------------

# 27. SEO

The contribution heatmap should not create unnecessary SEO noise.

Use semantic HTML.

Do not create hundreds of indexable pages or links for individual
contribution cells.

------------------------------------------------------------------------

# 28. Security

If GitHub API access requires credentials:

-   keep credentials server-side
-   never expose tokens in client JavaScript
-   never commit tokens
-   never place secrets in `NEXT_PUBLIC_*` variables
-   use existing environment-variable conventions
-   update `.env.example` with variable names only

Never put a GitHub token into:

``` text
NEXT_PUBLIC_GITHUB_TOKEN
```

------------------------------------------------------------------------

# 29. Failure Handling

If GitHub data cannot be retrieved because of:

-   rate limits
-   API changes
-   network failure
-   invalid configuration
-   unavailable credentials

the rest of the portfolio must continue working normally.

The heatmap should degrade gracefully.

------------------------------------------------------------------------

# 30. Code Quality

Follow the existing project conventions.

Requirements:

-   TypeScript
-   typed data structures
-   no `any` unless absolutely unavoidable
-   reusable components
-   clear naming
-   no dead code
-   no duplicate utilities
-   no unnecessary abstractions
-   no console noise in production
-   comments only where useful

------------------------------------------------------------------------

# 31. Validation

After implementation run:

``` bash
npm run lint
```

Then:

``` bash
npx tsc --noEmit
```

Then:

``` bash
npm run build
```

If tests exist, run the relevant tests.

Fix all errors.

Do not report success while validation is failing.

------------------------------------------------------------------------

# 32. Visual QA Checklist

Before declaring completion, verify:

### Content

-   [ ] Real GitHub data
-   [ ] Real contribution count
-   [ ] Real dates
-   [ ] No fake metrics
-   [ ] No fake achievements

### UI

-   [ ] GitHub-style calendar
-   [ ] Month labels
-   [ ] Weekday labels
-   [ ] Five contribution levels
-   [ ] Less → More legend
-   [ ] Accessible tooltips
-   [ ] Keyboard focus

### Responsive

-   [ ] 320px
-   [ ] 375px
-   [ ] 390px
-   [ ] 430px
-   [ ] 768px
-   [ ] 1024px
-   [ ] 1280px
-   [ ] 1440px
-   [ ] 1920px

### Themes

-   [ ] Light
-   [ ] Dark
-   [ ] System detection
-   [ ] No theme toggle

### Technical

-   [ ] Server-side data fetching where appropriate
-   [ ] No exposed secrets
-   [ ] Caching/revalidation
-   [ ] Graceful API failure
-   [ ] No unnecessary dependencies
-   [ ] No page-level horizontal overflow

### Validation

-   [ ] ESLint passes
-   [ ] TypeScript passes
-   [ ] Production build passes

------------------------------------------------------------------------

# 33. Final Implementation Report

When finished, provide a concise report containing:

``` text
## GitHub Heatmap — Complete

### Created
- ...

### Modified
- ...

### Data Source
- ...

### GitHub Account
- ...

### Responsive QA
- ...

### Theme QA
- Light: PASS
- Dark: PASS

### Accessibility
- ...

### Validation
- Lint: PASS
- TypeScript: PASS
- Build: PASS

### Notes
- ...
```

Do not claim real GitHub data is working if the integration could not be
verified.

Do not claim production deployment verification unless it was actually
performed.

------------------------------------------------------------------------

# Final Rule

**Inspect first. Implement second.**

Do not redesign unrelated parts of the portfolio.

Do not change existing sections unless required for integration.

Do not install unnecessary packages.

Do not fabricate GitHub activity.

Do not stop at a visual mockup.

Build the contribution heatmap as a **real, reusable, production-ready
portfolio component** that feels native to **shreyansh.cc**.
