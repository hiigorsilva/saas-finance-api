import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const removeUserParamsSchema = z.object({
  userId: z.string(),
})

export const removeUserSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Remove user',
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    params: removeUserParamsSchema,
    response: {
      200: dataResponseSchema(z.string()),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
