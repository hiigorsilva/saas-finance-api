import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'

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
      201: z.object({
        statusCode: z.number().default(201),
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
