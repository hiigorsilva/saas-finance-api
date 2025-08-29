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
        statusCode: z.number().default(200),
        body: z.object({
          accessToken: z.string(),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: z.string(),
        }),
      }),
      401: z.object({
        statusCode: z.number().default(401),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
