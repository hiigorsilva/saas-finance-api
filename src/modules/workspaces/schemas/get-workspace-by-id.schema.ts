import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const getWorkspaceByIdParamsSchema = z.object({
  workspaceId: z.string(),
})

const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(['PRIVATE', 'SHARED']),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const getWorkspaceByIdSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Find a workspace by id',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: getWorkspaceByIdParamsSchema,
    response: {
      200: dataResponseSchema(workspaceSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
