import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const getWorkspaceBySlugParamsSchema = z.object({
  slug: z.string(),
})

const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(['PRIVATE', 'SHARED']),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalMembers: z.number(),
  ownerName: z.string(),
  members: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      workspaceId: z.string(),
      role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
      joinedAt: z.date(),
      userName: z.string(),
      userEmail: z.string(),
    })
  ),
})

export const getWorkspaceBySlugSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get a workspace by slug',
    description:
      'Returns workspace details when the authenticated user belongs to the requested workspace.',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: getWorkspaceBySlugParamsSchema,
    response: {
      200: dataResponseSchema(workspaceSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
