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

## Code Style

Biome enforces: 2-space indentation, single quotes, ES5 trailing commas. Run `bun run lint` to auto-fix.

## Architecture

- `src/app/` - Next.js App Router pages and layouts (RSC by default)
- `src/app/api/` - API routes (booking endpoints)
- `src/components/` - Page-level components (hero, header, footer, etc.)
- `src/components/booking/` - Multi-step booking form components
- `src/components/ui/` - shadcn/ui primitives (button, card, input, etc.)
- `src/lib/` - Utilities including Prisma client, Google Calendar integration, and cn() helper
- `src/lib/validations/` - Zod schemas for API request validation
- `prisma/schema.prisma` - Database schema

## Booking System

The app features a medical transportation booking system with Google Calendar integration.

**Key files:**
- `src/lib/google-calendar.ts` - Calendar API client, busy time queries, slot generation
- `src/lib/booking-config.ts` - Business hours, timezone (America/Chicago), slot duration
- `src/app/api/booking/route.ts` - POST to create bookings
- `src/app/api/booking/slots/route.ts` - GET available time slots for a date

**Flow:** Client requests slots for a date → API checks Google Calendar busy times + existing DB bookings → returns availability → client submits booking → API validates slot still available → creates Booking record.

**Environment variables:**
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_SERVICE_ACCOUNT_KEY` - JSON service account credentials (newlines escaped as `\n`)
- `GOOGLE_CALENDAR_ID` - Calendar to check for conflicts

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

Never manually write migration SQL files. Let Prisma generate them from schema changes.
