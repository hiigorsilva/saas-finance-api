import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  errorResponseSchema,
  paginatedResponseSchema,
} from '../../../shared/schemas/response.schema'

export const listInactiveUserParamsSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  financialProfile: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const listInactiveUserSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all inactive users',
    description:
      'Returns soft-deleted users in a paginated response. Pagination metadata is returned in props.',
    querystring: listInactiveUserParamsSchema,
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    response: {
      200: paginatedResponseSchema(userSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
