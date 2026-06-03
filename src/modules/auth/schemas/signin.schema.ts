import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const signinBodySchema = z.object({
  email: z.string().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .trim(),
})

export const signinSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Sign in a user',
    description:
      'Authenticates a user with email and password and returns a Bearer token for protected routes.',
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
