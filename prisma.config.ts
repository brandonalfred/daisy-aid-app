import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Fallback for prisma generate when DATABASE_URL isn't set (e.g., CI)
    url: process.env.DATABASE_URL ?? 'postgresql://localhost:5432/placeholder',
  },
});
