import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const removeMemberParamsSchema = z.object({
  workspaceId: z.string(),
  memberId: z.string(),
})

export const removeMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Remove a member from a workspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: removeMemberParamsSchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.string(),
        }),
      }),
    },
  },
}
