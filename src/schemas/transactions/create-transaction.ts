import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const createTransactionParamsSchema = z.object({
  workspaceId: z.string(),
})
export type CreateTransactionParamsType = z.infer<
  typeof createTransactionParamsSchema
>

export const createTransactionBodySchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().optional(),
  type: z.enum(['INCOME', 'EXPENSE', 'INVESTMENT']),
  category: z.string().trim(),
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

export const createTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Create a new transaction',
    consumes: ['application/json'],
    security: [{ bearerAuth: [] }],
    tags: ['Transaction'],
    params: createTransactionParamsSchema,
    body: createTransactionBodySchema,
    response: {
      201: z.object({
        statusCode: z.literal(201),
        body: z.object({
          transaction: z.object({
            id: z.string(),
          }),
        }),
      }),
      400: z.object({
        statusCode: z.literal(400),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
