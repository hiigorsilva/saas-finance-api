import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const getWorkspaceByIdParamsSchema = z.object({
  workspaceId: z.string(),
})

export const getWorkspaceByIdSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Find a workspace by id',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: getWorkspaceByIdParamsSchema,
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          data: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            type: z.enum(['PRIVATE', 'SHARED']),
            ownerId: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
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
