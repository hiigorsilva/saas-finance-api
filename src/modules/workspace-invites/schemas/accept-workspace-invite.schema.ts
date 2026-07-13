import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const acceptWorkspaceInviteParamsSchema = z.object({
  inviteId: z.string(),
})

const acceptedWorkspaceInviteSchema = z.object({
  status: z.string(),
})

export const acceptWorkspaceInviteSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Accept workspace invite',
    description:
      'Accepts a received workspace invite, adds the user as MEMBER and removes the invite from the database.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Invites'],
    params: acceptWorkspaceInviteParamsSchema,
    response: {
      200: dataResponseSchema(acceptedWorkspaceInviteSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
      409: errorResponseSchema,
      410: errorResponseSchema,
    },
  },
}
