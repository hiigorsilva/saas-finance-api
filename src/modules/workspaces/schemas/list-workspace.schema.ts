import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const listWorkspaceParamsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().default(10),
})

export const listWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all workspaces',
    consumes: ['application/json'],
    params: listWorkspaceParamsSchema,
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.array(
            z.object({
              id: z.string(),
              name: z.string(),
              description: z.string().nullable(),
              type: z.string(),
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
