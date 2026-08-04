import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const getTransactionByIdParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

const transactionSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  ownerId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  category: z.string(),
  amount: z.string(),
  paymentDate: z.date(),
  paymentMethod: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const getTransactionByIdSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Get a transaction by id',
    description:
      'Returns a single transaction from a workspace. The authenticated user must have transaction view permission.',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: getTransactionByIdParamsSchema,
    response: {
      200: dataResponseSchema(transactionSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
