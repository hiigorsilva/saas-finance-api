import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { transactionStatusSchema } from '../../../data/transactions'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  errorResponseSchema,
  paginatedResponseSchema,
} from '../../../shared/schemas/response.schema'

export const listTransactionParamsSchema = z.object({
  workspaceId: z.string(),
})

export const listTransactionQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
})

const transactionSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  createdByUserId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.string(),
  category: z.string(),
  amount: z.number(),
  status: transactionStatusSchema,
  paymentDate: z.date(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const listTransactionSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'List all transactinos',
    consumes: ['application/json'],
    tags: ['Transaction'],
    querystring: listTransactionQuerySchema,
    params: listTransactionParamsSchema,
    security: [{ bearerAuth: [] }],
    response: {
      200: paginatedResponseSchema(transactionSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
