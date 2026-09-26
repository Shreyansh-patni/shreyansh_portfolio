# Design System

## Source of Truth

The Stitch references inside `design-reference/` are the visual source of truth.

Available references:

- Desktop Dark
- Desktop Light
- Tablet Dark
- Tablet Light
- Mobile Dark
- Mobile Light

When implementing UI, reproduce the Stitch visual result in clean Next.js/React code rather than copying Stitch's generated HTML directly.

If implementation conventions conflict with the visual reference, preserve the intended visual design while keeping the code maintainable.

---

## Product Visual Direction

The website is a personal digital profile and portfolio for Shreyansh Patni.

The visual direction is:

- Minimal
- Personal
- Editorial
- Developer-focused
- Clean typography
- Generous whitespace
- Small metadata labels
- Compact badges
- Subtle borders
- Restrained visual effects
- No unnecessary cards or decorative UI

The page should feel closer to a refined personal profile than a traditional corporate portfolio.

---

## Responsive Layout

### Mobile

Target reference width:

- approximately 420–430px maximum
- 16px horizontal page padding

Layout:

- Single column
- Timeline entries stack vertically
- Banner uses a short wide aspect ratio
- Avatar overlaps the banner
- Profile information follows the avatar
- Content remains comfortable to read on narrow screens

### Tablet

Target reference width:

- approximately 720–760px maximum
- centered layout
- responsive horizontal padding

Layout:

- Larger hero/banner
- Larger profile typography
- Timeline uses approximately 130px date column + remaining content
- Experience and education remain two-column timeline entries

### Desktop

Target reference width:

- approximately 620px maximum
- centered layout

Layout:

- Compact centered personal-profile presentation
- Timeline uses proportional date/content columns
- Larger horizontal whitespace around the profile

---

## Hero / Profile Header

Structure:

1. Banner
2. Overlapping circular avatar
3. Name
4. Verified indicator
5. Handle
6. Short profile bio
7. Location
8. Joined date

Banner:

- Rounded corners
- Overflow hidden
- Responsive dimensions
- Grayscale/cinematic imagery
- Subtle border/shadow where present in Stitch

Avatar:

- Circular
- Overlaps banner
- Responsive size
- Theme-aware border/ring

Do not introduce additional hero elements that are not present in the reference.

---

## Typography

### Primary Typeface

Use Inter as the primary production typeface where available.

A system sans fallback may be used.

Use Next.js font handling rather than loading fonts through a third-party CDN.

### Metadata Typeface

Use a monospace font for:

- Dates
- Section labels
- Timeline metadata

### Section Labels

Characteristics:

- Uppercase
- Small size
- Monospace
- Letter spacing
- Muted color

### Headings

Use strong but restrained hierarchy.

Avoid oversized marketing-style headings.

---

## Colors

### Light Theme

Base:

- Background: white
- Primary text: slate/gray-900
- Secondary text: gray/slate-500 to gray/slate-600
- Muted metadata: gray/slate-400
- Surface: gray-50 / slate-100
- Border: gray-200 / slate-200
- Accent: blue

### Dark Theme

Base:

- Background: near-black
- Primary text: near-white
- Secondary text: muted gray
- Metadata: muted gray
- Surface: dark neutral
- Border: subtle dark neutral
- Accent: blue

Exact values should be centralized as theme tokens rather than scattered throughout components.

---

## Theme Behavior

Dark and Light modes use the same component structure.

Only visual tokens should change between themes unless the Stitch reference clearly changes layout.

Do not create separate Dark and Light React components.

Use the project's theme system for:

- Backgrounds
- Text
- Borders
- Surfaces
- Badges
- Avatar rings
- Interactive states

---

## Radius

The Stitch design uses rounded elements.

Use radius values intentionally:

- Banner: rounded
- Avatar: circular
- Badges: pill-shaped
- Small controls: rounded where shown in Stitch

Do not introduce rounded cards or containers simply because a UI library defaults to them.

The Stitch reference determines whether an element should be rounded.

---

## Borders

Use subtle borders where visible in Stitch.

Avoid heavy borders.

Borders should support hierarchy without making the page look like a dashboard.

---

## Badges

Badges are compact pill-shaped elements.

Structure:

- Small indicator dot
- Label
- Small horizontal padding
- Subtle border
- Rounded-full shape

Light and Dark themes should use different surface/border tokens automatically.

Create one reusable Badge component.

---

## Timeline

Experience and Education share the same visual system.

### Mobile

Each entry:

1. Date
2. Title + badge
3. Description

### Tablet

Use:

- approximately 130px date column
- remaining width for content

### Desktop

Use a proportional date/content layout matching the Stitch reference.

Do not create separate timeline components for Experience and Education.

Use shared Timeline and TimelineEntry components.

---

## About Text

About content uses normal body text with selected important phrases highlighted using:

- Underline
- Slightly stronger text weight
- Theme-aware text color
- Small underline offset

Do not overuse highlighted phrases.

---

## Spacing

Whitespace is an important part of the design.

Prefer the spacing visible in Stitch rather than compressing sections.

Major sections should have clear vertical separation.

Timeline entries should have consistent vertical rhythm.

Do not add excessive padding simply because a component library provides it.

---

## Images

Production images should use Next.js image handling where appropriate.

Do not keep Stitch's temporary Google-hosted image URLs in the production implementation.

Move required assets into the project's `public/` structure or use an intentional external image source configured for Next.js.

---

## Components

Initial reusable UI components:

- ProfileHero
- ProfileIdentity
- AboutSection
- Timeline
- TimelineEntry
- Badge

Additional components should only be introduced when the UI actually requires them.

Avoid premature abstraction.

---

## Animation

Animation is intentionally restrained.

Do not add:

- Excessive page transitions
- Large scroll animations
- Parallax effects
- Decorative motion
- Unnecessary hover animations

Motion should only be introduced when it improves usability or clearly matches a reference.

---

## Accessibility

All interactive elements must:

- Have accessible names
- Be keyboard accessible
- Have visible focus states
- Maintain sufficient contrast
- Use semantic HTML

Images must have meaningful alt text when they convey information.

Decorative images should use appropriate empty alt text.

---

## Implementation Rules

1. Stitch is the visual source of truth.
2. Do not copy Stitch HTML directly into the application.
3. Rebuild the design using clean React/Next.js components.
4. Keep content separate from UI components.
5. Prefer Server Components.
6. Use Client Components only when interactivity requires them.
7. Use Tailwind for most styling.
8. Use shadcn/ui only when a component actually benefits from it.
9. Use Magic UI selectively and only when it matches the design.
10. Do not introduce unnecessary dependencies.
11. Do not fabricate profile information.
12. Validate desktop, tablet, mobile, light, and dark states before considering the UI complete.
