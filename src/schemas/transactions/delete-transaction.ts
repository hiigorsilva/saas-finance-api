import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../middlewares/private-route'

export const deleteTransactionParamsResponseSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const deleteTransaction: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Delete a transaction by id',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: deleteTransactionParamsResponseSchema,
    response: {
      200: z.object({
        statusCode: z.literal(200),
        body: z.object({
          status: z.string(),
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
