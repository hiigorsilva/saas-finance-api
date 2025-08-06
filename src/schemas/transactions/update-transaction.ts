import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const updateTransactionParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const updateTransactionBodySchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  category: z.string(),
  amount: z.string(),
  paymentDate: z.coerce.date(),
  isRecurring: z.boolean(),
  recurringInterval: z
    .enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'])
    .optional(),
  recurringEndDate: z.coerce.date().optional(),
  installmentTotal: z.number().optional(),
  currentInstallment: z.number().optional(),
})

export const updateTransaction: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Update a transaction data',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: updateTransactionParamsSchema,
    body: updateTransactionBodySchema,
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          transaction: z.object({
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
