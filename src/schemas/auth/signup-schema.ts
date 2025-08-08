import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

export const signupBodySchema = z.object({
  name: z.string().trim(),
  email: z.email().trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long.')
    .trim(),
})

const signupSuccessResponseSchema = z.object({
  statusCode: z.literal(201),
  body: z.object({
    accessToken: z.string(),
  }),
})

const signupBadRequestResponseSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const signupSchema: RouteShorthandOptions = {
  schema: {
    summary: 'Create a new user',
    consumes: ['application/json'],
    tags: ['Authentication'],
    body: signupBodySchema,
    response: {
      201: signupSuccessResponseSchema,
      400: signupBadRequestResponseSchema,
    },
  },
}
