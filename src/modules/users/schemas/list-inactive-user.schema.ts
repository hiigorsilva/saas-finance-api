import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const listInactiveUserParamsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})

export const listInactiveUserSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all inactive users',
    querystring: listInactiveUserParamsSchema,
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.email(),
              financialProfile: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
            })
          ),
          totalCount: z.number(),
          totalPages: z.number(),
          currentPage: z.number(),
          limit: z.number(),
        }),
      }),
    },
  },
}
