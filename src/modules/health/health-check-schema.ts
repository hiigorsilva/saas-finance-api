import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

export const health: RouteShorthandOptions = {
  schema: {
    summary: 'Health Check Route',
    tags: ['Health'],
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        data: z.string(),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        message: z.string(),
      }),
    },
  },
}
