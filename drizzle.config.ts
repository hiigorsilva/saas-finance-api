import { defineConfig } from 'drizzle-kit'
import { env } from './src/shared/utils/env'

export default defineConfig({
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  schema: './src/db/schemas/index.ts',
  out: './src/db/migrations',
})
