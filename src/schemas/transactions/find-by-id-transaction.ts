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
  },
}
