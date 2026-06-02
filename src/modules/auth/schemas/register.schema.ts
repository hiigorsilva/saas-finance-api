import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const registerBodySchema = z.object({
  name: z.string().trim(),
  email: z.email().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .trim(),
})

export const registerSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Create a new user',
    consumes: ['application/json'],
    tags: ['Authentication'],
    body: registerBodySchema,
    response: {
      201: dataResponseSchema(z.object({ accessToken: z.string() })),
      400: errorResponseSchema,
      401: errorResponseSchema,
      409: errorResponseSchema,
    },
  },
}
