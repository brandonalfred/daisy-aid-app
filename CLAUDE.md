# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Start development server (localhost:3000)
bun run build        # Production build
bun run lint         # Lint and auto-fix with Biome
bun run lint:check   # Lint without fixing (CI)
bun run lint:prisma  # Lint Prisma schema
bun run type-check   # TypeScript type checking
```

## Tech Stack

- **Next.js 16** with App Router and React Server Components
- **React 19**
- **Bun** as package manager (use `bun install`, not npm/yarn)
- **Biome** for linting/formatting (not ESLint/Prettier)
- **Tailwind CSS v4** with new `@theme inline` syntax in globals.css
- **shadcn/ui** components (new-york style) - add via `bunx shadcn@latest add <component>`
- **Prisma 7** with PostgreSQL for database (config in `prisma.config.ts`)
- **NextAuth v5** (beta) for admin authentication with Google OAuth

## Code Style

Biome enforces: 2-space indentation, single quotes, ES5 trailing commas. Run `bun run lint` to auto-fix.

## Git Workflow

When creating new features or starting new work:
1. Start from a fresh `main` branch: `git checkout main && git pull origin main`
2. Create a new feature branch: `git checkout -b feature/<description>`
3. Use conventional commit prefixes: `feat:`, `fix:`, `docs:`, `refactor:`, etc.

## Architecture

- `src/app/` - Next.js App Router pages and layouts (RSC by default)
- `src/app/api/` - API routes (booking and auth endpoints)
- `src/app/admin/` - Admin portal with route groups for auth flow
- `src/components/` - Page-level components (hero, header, footer, etc.)
- `src/components/booking/` - Multi-step booking form components
- `src/components/admin/` - Admin-specific components (sidebar, booking management)
- `src/components/ui/` - shadcn/ui primitives (button, card, input, etc.)
- `src/lib/` - Utilities including Prisma client, Google Calendar integration, and cn() helper
- `src/lib/validations/` - Zod schemas for API request validation
- `auth.ts` - NextAuth v5 configuration (root directory)
- `prisma/schema.prisma` - Database schema

## Booking System

The app features a medical transportation booking system with Google Calendar integration.

**Key files:**
- `src/lib/google-calendar.ts` - Calendar API client, busy time queries, slot generation
- `src/lib/booking-config.ts` - Business hours, timezone (America/Chicago), slot duration
- `src/app/api/booking/route.ts` - POST to create bookings
- `src/app/api/booking/slots/route.ts` - GET available time slots for a date

**Flow:** Client requests slots for a date → API checks Google Calendar busy times + existing DB bookings → returns availability → client submits booking → API validates slot still available → creates Booking record.

## Admin System

Admin portal at `/admin` with Google SSO authentication. Only pre-registered admins (in the `Admin` table) can log in.

**Route structure:**
- `/admin` - Redirects to login or dashboard based on auth state
- `/admin/login` - Google OAuth sign-in page
- `/admin/(authenticated)/` - Protected route group requiring valid session
  - `dashboard/` - Admin dashboard
  - `bookings/` - Booking management list
  - `bookings/[id]/` - Individual booking detail/edit

**Auth flow:** Google OAuth → `signIn` callback checks if email exists in Admin table → session enriched with admin details via JWT callback.

**Key files:**
- `auth.ts` - NextAuth configuration with Google provider and admin validation
- `src/app/admin/(authenticated)/layout.tsx` - Server-side auth check, redirects unauthenticated users

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_SERVICE_ACCOUNT_KEY` - JSON service account credentials for Calendar API (newlines escaped as `\n`)
- `GOOGLE_CALENDAR_ID` - Calendar to check for conflicts
- `AUTH_SECRET` - NextAuth secret (generate with `openssl rand -base64 32`)
- `AUTH_GOOGLE_ID` - Google OAuth client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth client secret

## Path Aliases

Use `@/` for imports from `src/` (e.g., `@/components/ui/button`, `@/lib/utils`).

## Prisma 7

Configuration is in `prisma.config.ts` (root directory). Database URL is loaded from `DATABASE_URL` env var.

**Schema conventions:**
- Use camelCase for field names in code
- Add `@map("snake_case")` for database columns
- Add `@@map("table_name")` for table names
- Run `bun run lint:prisma` to verify naming conventions

**Commands:**
```bash
bunx prisma migrate dev --name <migration_name>  # Create and apply migration
bunx prisma db push                              # Sync schema without migration (dev only)
bunx prisma generate                             # Regenerate Prisma client
```

### Avoiding Migration Drift

**CRITICAL:** Always use `prisma migrate dev` instead of `prisma db push` for schema changes.

- `prisma migrate dev` → Creates migration files + applies to DB (use this!)
- `prisma db push` → Applies to DB only, NO migration files (causes drift!)

**What causes drift:** Using `db push` syncs your database but doesn't create migration files. This creates a mismatch between migration history and actual database state. Production deployments rely on migration files, so changes made with `db push` won't be applied in production.

**If you accidentally used `db push`:** Immediately run `prisma migrate dev` to capture the changes in a migration file.

### Migration Guidelines

**ALWAYS use Prisma commands for migrations.** Never manually write or edit migration SQL files. Let Prisma generate them from schema changes.

**Workflow for schema changes:**
1. Edit `prisma/schema.prisma` with your changes
2. Run `bunx prisma migrate dev --name <descriptive_name>`
3. Prisma will generate the migration SQL and apply it
4. Commit both the schema changes and the generated migration files

**If a migration fails:**
1. Read the error message carefully to understand the issue
2. **Do NOT manually edit the generated migration SQL**
3. Common fixes:
   - **Schema syntax error:** Fix the schema.prisma file and re-run the migrate command
   - **Conflicting migration:** Run `bunx prisma migrate reset` (dev only - this drops the database)
   - **Data constraint violation:** Add default values or make fields optional in schema, then migrate
   - **Migration drift:** Run `bunx prisma migrate dev` to reconcile
4. If the migration created files but failed to apply:
   - Delete the failed migration folder from `prisma/migrations/`
   - Fix the underlying issue in the schema
   - Run the migrate command again
5. After fixing, always verify with `bunx prisma generate` to ensure the client is in sync

**Never do these:**
- Manually write SQL migration files
- Edit generated migration SQL after creation
- Use `prisma db push` in production or for permanent changes
- Skip committing migration files to version control
- **NEVER run `bunx prisma migrate reset` or `bunx prisma migrate reset --force` against production** - this drops all data
