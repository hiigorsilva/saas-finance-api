import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const addMemberParamsSchema = z.object({
  workspaceId: z.string(),
})

export const addMemberBodySchema = z.object({
  email: z.email(),
})

const invitedMemberSchema = z.object({
  id: z.string(),
})

export const addMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Invite a user to a workspace',
    description:
      'Creates a workspace invite for an existing user by email. The user becomes a MEMBER only after accepting the invite. PRIVATE workspaces do not accept invites.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: addMemberParamsSchema,
    body: addMemberBodySchema,
    response: {
      201: dataResponseSchema(invitedMemberSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      409: errorResponseSchema,
    },
  },
}
