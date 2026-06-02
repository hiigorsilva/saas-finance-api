import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const signinBodySchema = z.object({
  email: z.string().trim(),
  password: z.string().min(8).trim(),
})

export const signinSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Sign in a user',
    consumes: ['application/json'],
    tags: ['Authentication'],
    body: signinBodySchema,
    response: {
      200: dataResponseSchema(z.object({ accessToken: z.string() })),
      400: errorResponseSchema,
      401: errorResponseSchema,
    },
  },
}
