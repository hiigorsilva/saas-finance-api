import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

const healthSuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    status: z.string(),
  }),
})

const healthBadRequestResponseSchema = z.object({
  statusCode: z.literal(400),
  error: z.string(),
})

export const health: RouteShorthandOptions = {
  schema: {
    summary: 'Health Check Route',
    consumes: ['application/json'],
    tags: ['Health'],
    response: {
      200: healthSuccessResponseSchema,
      400: healthBadRequestResponseSchema,
    },
  },
}
