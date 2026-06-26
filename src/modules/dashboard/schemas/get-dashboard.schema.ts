import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import {
  categorySchema,
  paymentMethodSchema,
  typeSchema,
} from '../../../data/transactions'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

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
  amount: z.number(),
  paymentDate: z.date(),
  paymentMethod: paymentMethodSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
})

const dashboardSchema = z.object({
  resume: z.object({
    totalIncome: z.number(),
    totalIncomePercent: z.number(),
    totalExpense: z.number(),
    totalExpensePercent: z.number(),
    totalBalance: z.number(),
    totalBalancePercent: z.number(),
    totalInvestment: z.number(),
    totalInvestmentPercent: z.number(),
  }),
  metrics: z.object({
    savingsRate: z.number(),
    burnRate: z.number(),
    projectedBalance: z.number(),
    expenseRatio: z.number(),
    expenseChange: z.number(),
    incomeChange: z.number(),
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
      expense: z.number(),
      totalExpense: z.number(),
      progress: z.number(),
    })
  ),
})

export const getDashboardSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Get dashboard data',
    description:
      'Returns monthly financial aggregates for a workspace, including income, expenses, investments, savings metrics, category distribution, and latest transactions. Month accepts 1-12 and year must have 4 digits.',
    consumes: ['application/json'],
    tags: ['Dashboard'],
    security: [{ bearerAuth: [] }],
    params: getDashboardParamsSchema,
    querystring: getDashboardQuerySchema,
    response: {
      200: dataResponseSchema(dashboardSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      500: errorResponseSchema,
    },
  },
}
