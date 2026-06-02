import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const removeTransactionParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const removeTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Delete a transaction by id',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: removeTransactionParamsSchema,
    response: {
      200: dataResponseSchema(z.string()),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
