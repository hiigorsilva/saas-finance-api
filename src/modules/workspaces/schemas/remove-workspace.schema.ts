import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const removeWorkspaceParamsSchema = z.object({
  workspaceId: z.string(),
})

export const removeWorkspaceSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Delete a workspace',
    description:
      'Soft-deletes a workspace by id and returns a confirmation message. Use with care because transactions remain scoped to this workspace.',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: removeWorkspaceParamsSchema,
    response: {
      200: dataResponseSchema(z.string()),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
