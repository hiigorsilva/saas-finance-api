import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const listTransactionParamsSchema = z.object({
  workspaceId: z.string(),
})

export const listTransactionSuccessResponseSchema = z.object({
  statusCode: z.literal(200),
  body: z.object({
    transactions: z.array(
      z.object({
        id: z.string(),
        workspaceId: z.string(),
        createdByUserId: z.string(),
        name: z.string(),
        description: z.string().nullable(),
        type: z.string(),
        category: z.string(),
        amount: z.string(),
        paymentDate: z.date(),
        isRecurring: z.boolean(),
        recurringInterval: z.string().nullable(),
        recurringEndDate: z.date().nullable(),
        installmentTotal: z.number().nullable(),
        currentInstallment: z.number().nullable(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    ),
  }),
})

export const listTransactionBadRequestResponeSchema = z.object({
  statusCode: z.literal(400),
  body: z.object({
    error: z.string(),
  }),
})

export const listTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'List all transactinos',
    consumes: ['application/json'],
    tags: ['Transaction'],
    params: listTransactionParamsSchema,
    security: [{ bearerAuth: [] }],
    response: {
      200: listTransactionSuccessResponseSchema,
      400: listTransactionBadRequestResponeSchema,
    },
  },
}
