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

export const createTransactionParamsSchema = z.object({
  workspaceId: z.string(),
})

export const createTransactionBodySchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().optional(),
  type: typeSchema,
  category: categorySchema,
  amount: z.coerce.number(),
  status: transactionStatusSchema.default('PAID'),
  paymentDate: z.coerce.date(),
  paymentMethod: paymentMethodSchema,
})

export const createTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Create a new transaction',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Transaction'],
    params: createTransactionParamsSchema,
    body: createTransactionBodySchema,
    response: {
      201: dataResponseSchema(z.object({ id: z.string() })),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
