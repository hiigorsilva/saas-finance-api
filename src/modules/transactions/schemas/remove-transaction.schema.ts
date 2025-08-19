import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const removeTransactionParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const removeTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Delete a transaction by id',
    tags: ['Transaction'],
    security: [{ bearerAuth: [] }],
    params: removeTransactionParamsSchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.string(),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
