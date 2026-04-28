import { and, desc, eq, gte, isNull, lt, sql } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { transactionsTable } from '../../../db/schemas/transactions'
import type {
  IDashboard,
  IDashboardRepository,
} from '../interfaces/dashboard.interface'

const toNumber = (value: number | string | null | undefined) => {
  if (typeof value === 'number') return value

  const parsed = Number(value ?? 0)
  return Number.isFinite(parsed) ? parsed : 0
}

const toMoney = (value: number | string | null | undefined) => {
  const normalized = toNumber(value)
  return Math.round((normalized + Number.EPSILON) * 100) / 100
}

const toMonthRange = (month: string, year: string) => {
  const monthAsNumber = Number.parseInt(month, 10)
  const yearAsNumber = Number.parseInt(year, 10)

  if (
    !Number.isFinite(monthAsNumber) ||
    monthAsNumber < 1 ||
    monthAsNumber > 12
  ) {
    throw new Error('Invalid month. Use values from 1 to 12.')
  }

  if (
    !Number.isFinite(yearAsNumber) ||
    yearAsNumber < 1900 ||
    yearAsNumber > 9999
  ) {
    throw new Error('Invalid year. Use a valid 4-digit year.')
  }

  const startDate = new Date(Date.UTC(yearAsNumber, monthAsNumber - 1, 1))
  const endDate = new Date(Date.UTC(yearAsNumber, monthAsNumber, 1))

  return { startDate, endDate }
}

export class DashboardRepository implements IDashboardRepository {
  async getDashboard(
    workspaceId: string,
    month: string,
    year: string
  ): Promise<IDashboard> {
    const now = new Date()
    const { startDate, endDate } = toMonthRange(month, year)

    const monthlyBaseWhere = and(
      eq(transactionsTable.workspaceId, workspaceId),
      isNull(transactionsTable.deletedAt),
      gte(transactionsTable.paymentDate, startDate),
      lt(transactionsTable.paymentDate, endDate)
    )

    const [
      resumeRows,
      lastTransactions,
      expenseByCategoryRows,
      monthlyPayments,
      latePayments,
    ] = await Promise.all([
      db
        .select({
          totalIncome: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INCOME' then ${transactionsTable.amount} else 0 end), 0)`,
          totalExpense: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'EXPENSE' then ${transactionsTable.amount} else 0 end), 0)`,
          totalInvestment: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INVESTMENT' then ${transactionsTable.amount} else 0 end), 0)`,
        })
        .from(transactionsTable)
        .where(monthlyBaseWhere),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: monthlyBaseWhere,
        limit: 10,
        orderBy: desc(transactionsTable.paymentDate),
      }),

      db
        .select({
          name: transactionsTable.category,
          expense: sql<number>`coalesce(sum(${transactionsTable.amount}), 0)`,
        })
        .from(transactionsTable)
        .where(and(monthlyBaseWhere, eq(transactionsTable.type, 'EXPENSE')))
        .groupBy(transactionsTable.category),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: and(monthlyBaseWhere, eq(transactionsTable.type, 'EXPENSE')),
        orderBy: desc(transactionsTable.paymentDate),
      }),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: and(
          eq(transactionsTable.workspaceId, workspaceId),
          isNull(transactionsTable.deletedAt),
          eq(transactionsTable.type, 'EXPENSE'),
          eq(transactionsTable.status, 'PENDING'),
          lt(transactionsTable.paymentDate, now)
        ),
        orderBy: desc(transactionsTable.paymentDate),
      }),
    ])

    const resumeRow = resumeRows[0]

    const totalIncome = toMoney(resumeRow?.totalIncome)
    const totalExpense = toMoney(resumeRow?.totalExpense)
    const totalInvestment = toMoney(resumeRow?.totalInvestment)
    const totalBalance = toMoney(totalIncome - totalExpense - totalInvestment)

    const expenseByCategory = expenseByCategoryRows.map(expense => {
      const expenseValue = toMoney(expense.expense)
      const progress =
        totalExpense > 0 ? toMoney((expenseValue / totalExpense) * 100) : 0

      return {
        name: expense.name,
        expense: expenseValue,
        totalExpense,
        progress,
      }
    })

    return {
      resume: {
        totalIncome,
        totalExpense,
        totalBalance,
        totalInvestment,
      },
      monthlyDistribution: {
        income: totalIncome,
        expense: totalExpense,
        investment: totalInvestment,
      },
      lastTransactions,
      expenseByCategory,
      monthlyPayments,
      latePayments,
    }
  }
}
