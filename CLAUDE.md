# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun dev              # Start development server (localhost:3000)
bun run build        # Production build
bun run lint         # Lint and auto-fix with Biome
bun run lint:check   # Lint without fixing (CI)
bun run type-check   # TypeScript type checking
```

## Tech Stack

- **Next.js 16** with App Router and React Server Components
- **React 19**
- **Bun** as package manager (use `bun install`, not npm/yarn)
- **Biome** for linting/formatting (not ESLint/Prettier)
- **Tailwind CSS v4** with new `@theme inline` syntax in globals.css
- **shadcn/ui** components (new-york style) - add via `bunx shadcn@latest add <component>`
- **Prisma** with PostgreSQL for database

## Code Style

Biome enforces: 2-space indentation, single quotes, ES5 trailing commas. Run `bun run lint` to auto-fix.

## Architecture

- `src/app/` - Next.js App Router pages and layouts (RSC by default)
- `src/components/` - Page-level components (hero, header, footer, etc.)
- `src/components/ui/` - shadcn/ui primitives (button, card, input, etc.)
- `src/lib/` - Utilities including Prisma client and cn() helper
- `prisma/schema.prisma` - Database schema

## Path Aliases

Use `@/` for imports from `src/` (e.g., `@/components/ui/button`, `@/lib/utils`).
