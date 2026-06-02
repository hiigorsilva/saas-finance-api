import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const healthSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Health Check Route',
    consumes: ['application/json'],
    tags: ['Health'],
    response: {
      200: dataResponseSchema(z.object({ status: z.string() })),
      400: errorResponseSchema,
    },
  },
}
