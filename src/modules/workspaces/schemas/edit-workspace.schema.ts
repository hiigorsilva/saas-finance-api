import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const editWorkspaceParamsSchema = z.object({
  workspaceId: z.string(),
})

export const editWorkspaceBodySchema = z.object({
  name: z
    .string()
    .min(2, { error: 'Name must have at least 2 characters' })
    .trim(),
  description: z.string().trim().optional(),
  type: z.enum(['PRIVATE', 'SHARED']),
})

export const editWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Edit a workspace by id',
    consumes: ['application/json'],
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: editWorkspaceParamsSchema,
    body: editWorkspaceBodySchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().nullable(),
            type: z.string(),
            ownerId: z.string(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          status: z.string(),
        }),
      }),
      401: z.object({
        statusCode: z.number().default(401),
        body: z.object({
          status: z.string(),
        }),
      }),
    },
  },
}
