import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const changeRoleMemberParamsSchema = z.object({
  workspaceId: z.string(),
  memberId: z.string(),
})

export const changeRoleMemberBodySchema = z.object({
  newRole: z.enum(['ADMIN', 'MEMBER', 'VIEWER']),
})

export const changeRoleMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Changes the role of a member.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: changeRoleMemberParamsSchema,
    body: changeRoleMemberBodySchema,
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
