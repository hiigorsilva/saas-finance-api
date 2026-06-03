import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const healthSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Check API health',
    description:
      'Returns a lightweight status payload. Use this endpoint for uptime checks, load balancers, and quick local validation.',
    consumes: ['application/json'],
    tags: ['Health'],
    response: {
      200: dataResponseSchema(z.object({ status: z.string() })),
      400: errorResponseSchema,
    },
  },
}
