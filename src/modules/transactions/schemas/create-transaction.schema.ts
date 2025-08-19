import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  categorySchema,
  recurringIntervalSchema,
  typeSchema,
} from '../../../data/transactions'
import { privateRoute } from '../../../middlewares/private-route'

export const createTransactionParamsSchema = z.object({
  workspaceId: z.string(),
})

export const createTransactionBodySchema = z.object({
  name: z.string().trim(),
  description: z.string().trim().optional(),
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
          data: z.object({
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
