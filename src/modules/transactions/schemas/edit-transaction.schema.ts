import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  categorySchema,
  recurringIntervalSchema,
  typeSchema,
} from '../../../data/transactions'
import { privateRoute } from '../../../middlewares/private-route'

export const editTransactionParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const editTransactionBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: typeSchema,
  category: categorySchema,
  amount: z.string(),
  paymentDate: z.coerce.date(),
  isRecurring: z.boolean(),
  recurringInterval: recurringIntervalSchema.optional(),
  recurringEndDate: z.coerce.date().optional(),
  installmentTotal: z.number().optional(),
  currentInstallment: z.number().optional(),
})

export const editTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Update a transaction data',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: editTransactionParamsSchema,
    body: editTransactionBodySchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.object({
            id: z.string(),
            name: z.string(),
            amount: z.string(),
            paymentDate: z.date(),
          }),
        }),
      }),
    },
  },
}
