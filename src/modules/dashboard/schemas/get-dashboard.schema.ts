import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  categorySchema,
  paymentMethodSchema,
  typeSchema,
} from '../../../data/transactions'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'

export const getDashboardParamsSchema = z.object({
  workspaceId: z.string(),
})

export const getDashboardQuerySchema = z.object({
  month: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/, 'Month must be between 1 and 12'),
  year: z.string().regex(/^\d{4}$/, 'Year must have 4 digits'),
})

const dashboardTransactionSchema = z.object({
  id: z.string(),
  workspaceId: z.string(),
  createdByUserId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: typeSchema,
  category: categorySchema,
  amount: z.string(),
  paymentDate: z.date(),
  paymentMethod: paymentMethodSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

const badRequestErrorSchema = z.union([
  z.string(),
  z.array(
    z.object({
      code: z.string(),
      path: z.array(z.union([z.string(), z.number()])),
      message: z.string(),
    })
  ),
])

export const getDashboardSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Get dashboard data',
    consumes: ['application/json'],
    tags: ['Dashboard'],
    security: [{ bearerAuth: [] }],
    params: getDashboardParamsSchema,
    querystring: getDashboardQuerySchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.object({
            resume: z.object({
              totalIncome: z.number(),
              totalExpense: z.number(),
              totalBalance: z.number(),
              totalInvestment: z.number(),
            }),
            monthlyDistribution: z.object({
              income: z.number(),
              expense: z.number(),
              investment: z.number(),
            }),
            lastTransactions: z.array(dashboardTransactionSchema),
            expenseByCategory: z.array(
              z.object({
                name: categorySchema,
                expense: z.string(),
                totalExpense: z.string(),
                progress: z.number(),
              })
            ),
            weeklyPayment: z.array(dashboardTransactionSchema),
            latePayments: z.array(dashboardTransactionSchema),
          }),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: badRequestErrorSchema,
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
      500: z.object({
        statusCode: z.number().default(500),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
