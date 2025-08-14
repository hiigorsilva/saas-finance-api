import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const findTransactionByIdParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const findTransactionByIdSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Find a transaction by id',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: findTransactionByIdParamsSchema,
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          data: z.object({
            id: z.string(),
            workspaceId: z.string(),
            createdByUserId: z.string(),
            name: z.string(),
            description: z.string(),
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
