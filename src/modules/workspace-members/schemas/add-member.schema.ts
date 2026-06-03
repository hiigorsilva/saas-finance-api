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
  role: z.enum(['ADMIN', 'MEMBER', 'OWNER', 'VIEWER']),
})

const addedMemberSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  userId: z.string(),
  role: z.string(),
})

export const addMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Add a member to a workspace',
    description:
      'Adds an existing user to a SHARED workspace by email. PRIVATE workspaces do not accept members. Requires workspace invite permission.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: addMemberParamsSchema,
    body: addMemberBodySchema,
    response: {
      201: dataResponseSchema(addedMemberSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      409: errorResponseSchema,
    },
  },
}
