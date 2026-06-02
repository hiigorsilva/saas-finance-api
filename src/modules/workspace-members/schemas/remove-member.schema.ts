import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const removeMemberParamsSchema = z.object({
  workspaceId: z.string(),
  memberId: z.string(),
})

export const removeMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Remove a member from a workspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: removeMemberParamsSchema,
    response: {
      200: dataResponseSchema(z.string()),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
