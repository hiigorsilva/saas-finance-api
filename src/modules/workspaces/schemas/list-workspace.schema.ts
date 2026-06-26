import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  errorResponseSchema,
  paginatedResponseSchema,
} from '../../../shared/schemas/response.schema'

export const listWorkspaceQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})

const workspaceListItemSchema = z.object({
  id: z.string(),
  ownerId: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const listWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all workspaces',
    description:
      'Lists workspaces available to the authenticated user. Results are paginated and ordered by creation date.',
    consumes: ['application/json'],
    querystring: listWorkspaceQuerySchema,
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    response: {
      200: paginatedResponseSchema(workspaceListItemSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
    },
  },
}
