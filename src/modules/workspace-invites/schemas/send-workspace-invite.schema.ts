import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const sendWorkspaceInviteParamsSchema = z.object({
  workspaceId: z.string(),
})

export const sendWorkspaceInviteBodySchema = z.object({
  email: z.email(),
})

const sentWorkspaceInviteSchema = z.object({
  id: z.string(),
})

export const sendWorkspaceInviteSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Send workspace invite',
    description:
      'Sends a workspace invite to an existing user by email. Only the workspace owner can invite users to shared workspaces.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Invites'],
    params: sendWorkspaceInviteParamsSchema,
    body: sendWorkspaceInviteBodySchema,
    response: {
      201: dataResponseSchema(sentWorkspaceInviteSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      409: errorResponseSchema,
      410: errorResponseSchema,
    },
  },
}
