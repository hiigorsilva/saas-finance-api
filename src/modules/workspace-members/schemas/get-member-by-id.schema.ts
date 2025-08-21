import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const getMemberByIdParamsSchema = z.object({
  workspaceId: z.string(),
  memberId: z.string(),
})

export const getMemberByIdSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List members of a workspace',
    description: '`/api/workspace/{workspaceId}/member/{memberId}`',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: getMemberByIdParamsSchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
            financialProfile: z.string().nullable(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
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
