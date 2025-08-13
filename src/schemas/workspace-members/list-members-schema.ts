import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const listMembersParamsSchema = z.object({
  workspaceId: z.string(),
})

export const listMembersSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List members of a workspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: listMembersParamsSchema,
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          members: z.array(
            z.object({
              id: z.string(),
              workspaceId: z.string(),
              userId: z.string(),
              role: z.string(),
              joinedAt: z.date(),
            })
          ),
        }),
      }),
      400: z.object({
        statusCode: z.literal(400),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
