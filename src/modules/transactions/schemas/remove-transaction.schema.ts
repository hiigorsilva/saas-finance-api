import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'

export const removeTransactionParamsSchema = z.object({
  workspaceId: z.string(),
  transactionId: z.string(),
})

export const removeTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
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
      403: z.object({
        statusCode: z.number().default(403),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
