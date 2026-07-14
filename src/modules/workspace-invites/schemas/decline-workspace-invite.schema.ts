import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const declineWorkspaceInviteParamsSchema = z.object({
  inviteId: z.string(),
})

const declinedWorkspaceInviteSchema = z.object({
  status: z.string(),
})

export const declineWorkspaceInviteSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Decline workspace invite',
    description:
      'Declines a received workspace invite and removes the invite from the database.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Invites'],
    params: declineWorkspaceInviteParamsSchema,
    response: {
      200: dataResponseSchema(declinedWorkspaceInviteSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
      410: errorResponseSchema,
    },
  },
}
