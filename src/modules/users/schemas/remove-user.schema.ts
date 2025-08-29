import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const removeUserParamsSchema = z.object({
  userId: z.string(),
})

export const removeUserSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Remove user',
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    params: removeUserParamsSchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.string(),
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
      403: z.object({
        statusCode: z.number().default(403),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
