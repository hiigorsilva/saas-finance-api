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

export const editTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
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
            amount: z.number(),
            status: transactionStatusSchema,
            paymentDate: z.date(),
            paymentMethod: z.string(),
          }),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: z.string(),
        }),
      }),
      401: z.object({
        statusCode: z.number().default(401),
        body: z.object({
          error: z.string(),
        }),
      }),
      403: z.object({
        statusCode: z.number().default(403),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
