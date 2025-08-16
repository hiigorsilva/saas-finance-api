import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

export const healthSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Health Check Route',
    consumes: ['application/json'],
    tags: ['Health'],
    response: {
      200: z.object({
        statusCode: z.number(),
        body: z.object({
          status: z.string(),
        }),
      }),
      400: z.object({
        statusCode: z.number(),
        error: z.string(),
      }),
    },
  },
}
