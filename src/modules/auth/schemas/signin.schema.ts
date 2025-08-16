import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

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
      200: z.object({
        statusCode: z.number(),
        body: z.object({
          accessToken: z.string(),
        }),
      }),
      401: z.object({
        statusCode: z.number(),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
