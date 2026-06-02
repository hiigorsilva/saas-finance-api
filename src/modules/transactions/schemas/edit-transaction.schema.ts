import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  categorySchema,
  paymentMethodSchema,
  transactionStatusSchema,
  typeSchema,
} from '../../../data/transactions'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const editTransactionParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const editTransactionBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: typeSchema,
  category: categorySchema,
  amount: z.coerce.number(),
  paymentDate: z.coerce.date(),
  paymentMethod: paymentMethodSchema,
})

const editedTransactionSchema = z.object({
  id: z.string(),
  name: z.string(),
  amount: z.number(),
  status: transactionStatusSchema,
  paymentDate: z.date(),
  paymentMethod: z.string(),
})

export const editTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Update a transaction data',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: editTransactionParamsSchema,
    body: editTransactionBodySchema,
    response: {
      200: dataResponseSchema(editedTransactionSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
