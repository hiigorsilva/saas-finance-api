import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'

export const listTransactionParamsSchema = z.object({
  workspaceId: z.string(),
})

export const listTransactionQuerySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
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
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.array(
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
          totalCount: z.number(),
          totalPages: z.number(),
          currentPage: z.number(),
          limit: z.number(),
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
