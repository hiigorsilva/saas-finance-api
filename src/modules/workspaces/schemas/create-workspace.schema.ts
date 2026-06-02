import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const createWorkspaceBodySchema = z.object({
  name: z.string().min(2).trim(),
  description: z.string().trim().optional(),
  type: z.enum(['PRIVATE', 'SHARED']),
})

export const createWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Create a new wokspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace'],
    body: createWorkspaceBodySchema,
    response: {
      201: dataResponseSchema(z.object({ id: z.string() })),
      400: errorResponseSchema,
      401: errorResponseSchema,
      409: errorResponseSchema,
    },
  },
}
