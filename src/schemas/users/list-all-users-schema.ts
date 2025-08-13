import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const listAllUsersQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})

export const listAllUsersSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all users',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    querystring: listAllUsersQuerySchema,
    tags: ['User'],
    response: {
      200: z.object({
        statusCode: z.literal(200),
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
