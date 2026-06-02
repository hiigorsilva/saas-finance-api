import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  errorResponseSchema,
  paginatedResponseSchema,
} from '../../../shared/schemas/response.schema'

export const listMembersParamsSchema = z.object({
  workspaceId: z.string(),
})

export const listMembersQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
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

export const listMembersSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List members of a workspace',
    description:
      'Lists members of a workspace with their roles and financial profile. The authenticated user must belong to the workspace.',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Workspace Members'],
    params: listMembersParamsSchema,
    querystring: listMembersQuerySchema,
    response: {
      200: paginatedResponseSchema(memberSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
    },
  },
}
