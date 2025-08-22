import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'

export const addMemberParamsSchema = z.object({
  workspaceId: z.string(),
})

export const addMemberBodySchema = z.object({
  email: z.email(),
  role: z.enum(['ADMIN', 'MEMBER', 'OWNER', 'VIEWER']),
})

export const addMemberSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Add a member to a workspace',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: addMemberParamsSchema,
    body: addMemberBodySchema,
    response: {
      201: z.object({
        statusCode: z.number().default(201),
        body: z.object({
          data: z.object({
            id: z.string(),
            workspaceId: z.string(),
            userId: z.string(),
            role: z.string(),
          }),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: z.string(),
        }),
      }),
      401: z.object({
        statusCode: z.number().default(401),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
