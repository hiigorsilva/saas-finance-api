import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const getMemberByIdParamsSchema = z.object({
  workspaceId: z.string(),
  memberId: z.string(),
})

const memberSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
  financialProfile: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const getMemberByIdSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get a workspace member by id',
    description:
      'Returns a single workspace member with role and profile data. Use memberId as the user id inside the workspace.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: getMemberByIdParamsSchema,
    response: {
      200: dataResponseSchema(memberSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
