import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

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
      201: z.object({
        statusCode: z.number().default(201),
        body: z.object({
          data: z.object({
            id: z.string(),
          }),
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
