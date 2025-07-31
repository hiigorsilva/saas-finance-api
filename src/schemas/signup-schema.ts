import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

export const signupBodySchema = z.object({
  name: z.string().trim(),
  email: z.email().trim(),
  password: z.string().min(8).trim(),
})
export type SignUpBodyType = z.infer<typeof signupBodySchema>

export const signupSuccessResponseSchema = z.object({
  statusCode: z.literal(201),
  body: z.object({
    accessToken: z.string(),
  }),
})

export const signupBadRequestResponseSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const signup: RouteShorthandOptions = {
  schema: {
    summary: 'Create a new user',
    consumes: ['application/json'],
    tags: ['Auth'],
    body: signupBodySchema,
    response: {
      201: signupSuccessResponseSchema,
      400: signupBadRequestResponseSchema,
    },
  },
}
