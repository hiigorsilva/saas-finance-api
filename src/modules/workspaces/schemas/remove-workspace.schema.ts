import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const removeWorkspaceParamsSchema = z.object({
  workspaceId: z.string(),
})

export const removeWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Delete a workspace',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: removeWorkspaceParamsSchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.string(),
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
