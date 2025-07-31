import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

export const signinBodySchema = z.object({
  email: z.string().trim(),
  password: z.string().min(8).trim(),
})
export type SignInBodyType = z.infer<typeof signinBodySchema>

const signinSuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    accessToken: z.string(),
  }),
})

export const signupUnauthorizedResponseSchema = z.object({
  statusCode: z.literal(401),
  body: z.object({
    error: z.string(),
  }),
})

export const signin: RouteShorthandOptions = {
  schema: {
    summary: 'Sign in a user',
    consumes: ['application/json'],
    tags: ['Auth'],
    body: signinBodySchema,
    response: {
      200: signinSuccessResponseSchema,
      401: signupUnauthorizedResponseSchema,
    },
  },
}
