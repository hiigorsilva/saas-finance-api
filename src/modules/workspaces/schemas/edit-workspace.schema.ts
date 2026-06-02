import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

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

const workspaceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const editWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Update a workspace',
    description:
      'Updates workspace name, description, and type. The workspace must exist and be accessible to the authenticated user.',
    consumes: ['application/json'],
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: editWorkspaceParamsSchema,
    body: editWorkspaceBodySchema,
    response: {
      200: dataResponseSchema(workspaceSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
