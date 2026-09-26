# Database — Shreyansh Patni Portfolio

## 1. Database Philosophy

The initial version of the portfolio does not require a database.

The website should start as a lightweight, mostly static/data-driven Next.js application.

Do not introduce a database simply because the project may need one in the future.

A database should only be introduced when a real feature requires persistent or dynamic data.

---

# 2. V1 Database Status

Current status:

```text
No database required.
````

V1 should use:

* TypeScript data files
* Static content
* Local assets
* Server-rendered content where appropriate

Example:

```text
content/
├── profile.ts
├── businesses.ts
├── skills.ts
├── education.ts
├── experience.ts
├── projects.ts
└── hackathons.ts
```

---

# 3. Why V1 Does Not Need a Database

The initial portfolio primarily contains content controlled by the site owner.

Examples:

* Profile information
* Businesses
* Projects
* Education
* Experience
* Skills
* Hackathons
* Social links
* Gallery items

These do not require database storage.

Using local structured content keeps the initial system:

* Simple
* Fast
* Cheap
* Easy to maintain
* Easy to deploy
* Easy to version with Git

---

# 4. When a Database Becomes Necessary

Consider introducing a database when the website needs persistent dynamic data such as:

* Contact submissions
* Leads
* CRM records
* Newsletter subscribers
* User accounts
* Admin-managed content
* Dynamic blog management
* User-generated content
* Analytics data
* Saved preferences
* Application data

Do not introduce a database for purely static content.

---

# 5. Potential Future Database

If a database becomes necessary, a likely option is:

```text
PostgreSQL
```

Potential managed providers:

```text
Supabase
```

or another appropriate PostgreSQL provider.

The final provider should be chosen based on the actual requirements at that time.

Do not install database dependencies before the database is required.

---

# 6. Future Database Architecture

Potential future architecture:

```text
Next.js
    ↓
Server-side data layer
    ↓
Database
    ↓
Normalized application data
    ↓
UI
```

Avoid direct database access from Client Components.

---

# 7. Server-Side Database Access

Database credentials must remain server-side.

Preferred:

```text
Server Component
      ↓
Server-side data function
      ↓
Database
```

or:

```text
Server Action / Route Handler
      ↓
Database
```

Never expose database credentials to the browser.

---

# 8. Environment Variables

Future database configuration should use environment variables.

Example:

```text
DATABASE_URL
```

The actual variable names should follow the selected database provider's recommended configuration.

Never hardcode database credentials.

Never commit `.env.local`.

---

# 9. Potential Tables

If a database is introduced, possible tables may include:

```text
leads
contact_submissions
blog_posts
newsletter_subscribers
analytics_events
```

These are only examples.

Do not create these tables until their corresponding features actually exist.

---

# 10. Leads

If the website eventually becomes a lead-generation funnel, a possible lead record could contain:

```text
id
name
email
company
message
source
status
created_at
updated_at
```

Possible statuses:

```text
new
contacted
qualified
meeting
won
lost
```

The final schema should be based on the actual business workflow.

Do not collect unnecessary personal information.

---

# 11. Contact Submissions

A future contact form may store:

```text
id
name
email
message
created_at
```

Potential optional fields:

```text
company
website
budget
project_type
```

Only collect fields that provide actual value.

---

# 12. Blog Posts

If the blog remains file-based/MDX:

```text
No database required.
```

If an admin-managed CMS is eventually needed, a database-backed CMS may become appropriate.

Do not build a database-based blog before there is a need for content management.

---

# 13. Gallery

The gallery should initially use static image assets.

Example:

```text
public/gallery/
```

Do not store image binaries directly in a relational database.

If dynamic gallery management becomes necessary later, use appropriate object storage and store metadata in the database.

---

# 14. GitHub Data

GitHub contribution/activity data does not need to be permanently stored in the database for V1.

Prefer:

```text
GitHub API
    ↓
Server-side integration
    ↓
UI
```

Caching may be introduced later if API limits or performance require it.

---

# 15. Spotify Data

Spotify currently-playing information is inherently dynamic.

Do not permanently store every track played.

Prefer:

```text
Spotify API
    ↓
Server-side integration
    ↓
Current track
    ↓
UI
```

Only persist Spotify information if a future feature genuinely requires historical data.

---

# 16. X Data

Recent X posts should initially be retrieved through the appropriate API/integration.

Do not create a database simply to mirror an external feed.

A cache may be introduced later if:

* API limits require it
* Performance requires it
* Historical content becomes a feature

---

# 17. Database Security

If a database is introduced:

* Use least-privilege access.
* Keep credentials server-side.
* Validate all input.
* Use secure queries/official SDKs.
* Restrict access to necessary records.
* Separate public and private data.
* Protect administrative operations.

Follow:

```text
docs/SECURITY.md
```

---

# 18. Row-Level Security

If using Supabase/PostgreSQL with client-accessible data:

Consider Row Level Security where appropriate.

Do not assume that hiding a UI element protects data.

Authorization must be enforced at the appropriate server/database boundary.

---

# 19. Migrations

Database schema changes should be tracked through migrations when a database is eventually introduced.

Do not manually modify production schemas without a reproducible migration strategy.

---

# 20. Seed Data

Development seed data may be used for testing.

Seed data must clearly be fake/test data.

Do not accidentally commit real:

* Leads
* Contact submissions
* Private user information
* Production credentials

into development fixtures.

---

# 21. Backups

If the website eventually stores important business/lead data:

A backup/recovery strategy should be considered.

Do not assume the database provider alone satisfies every backup requirement.

---

# 22. Data Retention

Only store data that has a legitimate purpose.

When a future feature stores user-submitted information:

Define:

* Why it is stored
* How long it is stored
* Who can access it
* How it can be deleted

Avoid collecting data simply because the database can store it.

---

# 23. Personal Data

The website should minimize unnecessary collection of personal information.

Do not store sensitive personal information unless there is a clear legitimate requirement and appropriate protection.

---

# 24. Database Performance

When a database is eventually introduced:

* Query only required fields.
* Avoid unnecessary queries.
* Add indexes based on actual query patterns.
* Avoid N+1 query patterns.
* Cache data when appropriate.
* Paginate large datasets.

Do not prematurely optimize a small portfolio database.

---

# 25. Database vs API

Use an external API when the data belongs to an external service.

Use a database when the application needs to own/persist the data.

Examples:

```text
GitHub activity → GitHub API
Spotify current track → Spotify API
X posts → X API
Contact submissions → Database
Leads → Database
Personal profile → Static content initially
```

---

# 26. Database Introduction Checklist

Before adding a database, answer:

1. What feature requires persistence?
2. Why can't static content solve it?
3. What data needs to be stored?
4. Who can access it?
5. How long should it be stored?
6. What security controls are required?
7. What provider should be used?
8. What schema is actually required?
9. How will migrations work?
10. How will backups/recovery work?

Do not add a database until these questions have reasonable answers.

---

# 27. V1 Rule

For the current portfolio implementation:

```text
NO DATABASE.
```

Do not install:

* Prisma
* Drizzle
* Supabase SDK
* Database drivers
* ORM packages

unless a feature specifically requires them.

---

# 28. Future Migration Principle

Moving from local content to a database later should not require rewriting the UI.

The intended architecture is:

```text
Current:

content/
    ↓
UI


Future:

Database / CMS
    ↓
Data access layer
    ↓
UI
```

The UI should consume application-level data rather than depending directly on the storage mechanism.

---

# 29. Final Principle

Keep the portfolio simple until complexity is justified.

A database is a tool for solving a real data problem.

It is not a requirement for a professional portfolio.
