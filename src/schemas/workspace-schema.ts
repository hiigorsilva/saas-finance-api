import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../middlewares/private-route'

export const createWorkspaceBodySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  type: z.enum(['PRIVATE', 'SHARED']),
})
export type CreateWorkspaceBodyType = z.infer<typeof createWorkspaceBodySchema>

const createWorkspaceSuccessResponseSchema = z.object({
  statusCode: z.literal(201),
  body: z.object({
    workspace: z.object({
      id: z.string(),
    }),
  }),
})

const createWorkspaceBadRequestResponseSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const workspace: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Create a new wokspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace'],
    body: createWorkspaceBodySchema,
    response: {
      201: createWorkspaceSuccessResponseSchema,
      400: createWorkspaceBadRequestResponseSchema,
    },
  },
}
