import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const listMembersParamsSchema = z.object({
  workspaceId: z.string(),
})

export const listMembersQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})

export const listMembersSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List members of a workspace',
    description: '`/api/workspace/{workspaceId}/member`',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: listMembersParamsSchema,
    querystring: listMembersQuerySchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.array(
            z.object({
              id: z.string(),
              workspaceId: z.string(),
              userId: z.string(),
              role: z.string(),
              joinedAt: z.date(),
            })
          ),
          totalCount: z.number(),
          totalPages: z.number(),
          currentPage: z.number(),
          limit: z.number(),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
