# Daisy Aid Transport

Non-Emergency Medical Transportation (NEMT) booking application for the 55+ community. Features online appointment scheduling with Google Calendar integration and an admin dashboard for managing bookings.

## Tech Stack

- **Next.js 16** with App Router and React Server Components
- **React 19**
- **Bun** as package manager
- **Biome** for linting/formatting
- **Tailwind CSS v4**
- **shadcn/ui** components
- **Prisma 7** with PostgreSQL
- **NextAuth.js** for admin authentication (Google OAuth)
- **Google Calendar API** for availability checking

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- PostgreSQL database
- Google Cloud project with Calendar API enabled
- Google OAuth credentials (for admin auth)

### Installation

```bash
bun install
```

### Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL="postgresql://..."
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
GOOGLE_CALENDAR_ID="calendar-id@group.calendar.google.com"
AUTH_SECRET="your-auth-secret"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### Database Setup

```bash
bunx prisma migrate dev
```

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Commands

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Production build |
| `bun run lint` | Lint and auto-fix with Biome |
| `bun run lint:check` | Lint without fixing (CI) |
| `bun run type-check` | TypeScript type checking |

## Project Structure

```
src/
  app/
    page.tsx              # Landing page
    booking/              # Booking flow
    admin/                # Admin dashboard (protected)
    api/booking/          # Booking API endpoints
  components/
    booking/              # Multi-step booking form
    ui/                   # shadcn/ui primitives
  lib/
    google-calendar.ts    # Calendar integration
    booking-config.ts     # Business hours, timezone config
    prisma.ts             # Database client
prisma/
  schema.prisma           # Database schema
```

## Features

- **Online Booking**: Multi-step form for scheduling transportation
- **Availability Checking**: Real-time slot availability via Google Calendar
- **Admin Dashboard**: Manage bookings with Google SSO authentication
- **Responsive Design**: Mobile-friendly interface
