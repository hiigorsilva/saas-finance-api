import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const changeRoleMemberParamsSchema = z.object({
  workspaceId: z.string(),
  memberId: z.string(),
})

export const changeRoleMemberBodySchema = z.object({
  newRole: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

export const changeRoleMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Changes the role of a member.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: changeRoleMemberParamsSchema,
    body: changeRoleMemberBodySchema,
    response: {
      200: dataResponseSchema(z.string()),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
