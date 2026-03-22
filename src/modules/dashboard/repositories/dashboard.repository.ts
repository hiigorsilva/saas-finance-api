import { and, desc, eq, gte, isNull, lt, sql } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { transactionsTable } from '../../../db/schemas/transactions'
import type {
  IDashboard,
  IDashboardRepository,
} from '../interfaces/dashboard.interface'

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

  const startDate = new Date(yearAsNumber, monthAsNumber - 1, 1)
  const endDate = new Date(yearAsNumber, monthAsNumber, 1)

  return { startDate, endDate }
}

const toCurrentWeekRange = (now: Date) => {
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - now.getDay())
  startDate.setHours(0, 0, 0, 0)

  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 7)

  return { startDate, endDate }
}

const toCurrentMonthRange = (now: Date) => {
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)

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
    const { startDate: weekStartDate, endDate: weekEndDate } =
      toCurrentWeekRange(now)
    const { startDate: currentMonthStartDate, endDate: currentMonthEndDate } =
      toCurrentMonthRange(now)

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
      weeklyPayment,
      latePayments,
    ] = await Promise.all([
      db
        .select({
          totalIncome: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INCOME' then ${transactionsTable.amount} else 0 end), 0)::float8`,
          totalExpense: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'EXPENSE' then ${transactionsTable.amount} else 0 end), 0)::float8`,
          totalInvestment: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INVESTMENT' then ${transactionsTable.amount} else 0 end), 0)::float8`,
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
          expense: sql<string>`coalesce(sum(${transactionsTable.amount}), 0)::text`,
        })
        .from(transactionsTable)
        .where(and(monthlyBaseWhere, eq(transactionsTable.type, 'EXPENSE')))
        .groupBy(transactionsTable.category),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: and(
          eq(transactionsTable.workspaceId, workspaceId),
          isNull(transactionsTable.deletedAt),
          gte(transactionsTable.paymentDate, weekStartDate),
          lt(transactionsTable.paymentDate, weekEndDate)
        ),
        orderBy: desc(transactionsTable.paymentDate),
      }),

      db.query.transactionsTable.findMany({
        columns: {
          deletedAt: false,
        },
        where: and(
          eq(transactionsTable.workspaceId, workspaceId),
          isNull(transactionsTable.deletedAt),
          gte(transactionsTable.paymentDate, currentMonthStartDate),
          lt(transactionsTable.paymentDate, currentMonthEndDate),
          lt(transactionsTable.paymentDate, now)
        ),
        orderBy: desc(transactionsTable.paymentDate),
      }),
    ])

    const resumeRow = resumeRows[0]

    const totalIncome = Number((resumeRow?.totalIncome ?? 0).toFixed(2))
    const totalExpense = Number((resumeRow?.totalExpense ?? 0).toFixed(2))
    const totalInvestment = Number((resumeRow?.totalInvestment ?? 0).toFixed(2))
    const totalBalance = Number(
      (totalIncome - totalExpense - totalInvestment).toFixed(2)
    )

    const expenseByCategory = expenseByCategoryRows.map(expense => {
      const expenseValue = Number.parseFloat(expense.expense)
      const progress =
        totalExpense > 0
          ? Number(((expenseValue / totalExpense) * 100).toFixed(2))
          : 0

      return {
        name: expense.name,
        expense: expense.expense,
        totalExpense: totalExpense.toFixed(2),
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
      weeklyPayment,
      latePayments,
    }
  }
}
