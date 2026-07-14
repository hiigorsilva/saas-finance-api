import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

const workspaceInviteSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  workspaceName: z.string(),
  inviterId: z.string(),
  inviterName: z.string(),
  inviteeId: z.string(),
  status: z.enum(['PENDING', 'ACCEPTED', 'DECLINED']),
  expiresAt: z.date().nullable(),
})

export const listWorkspaceInviteSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List received workspace invites',
    description:
      'Lists pending, non-expired workspace invites received by the authenticated user.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Invites'],
    response: {
      200: dataResponseSchema(z.array(workspaceInviteSchema)),
      401: errorResponseSchema,
    },
  },
}
