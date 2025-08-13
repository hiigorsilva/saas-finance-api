import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const listAllUsersSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all users',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Users'],
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          users: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              email: z.email(),
              financialProfile: z.string().nullable(),
              createdAt: z.date(),
              updatedAt: z.date(),
            })
          ),
        }),
      }),
    },
  },
}
