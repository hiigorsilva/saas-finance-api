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
  const monthValue = Number(month)
  const yearValue = Number(year)

  if (!Number.isFinite(monthValue) || monthValue < 1 || monthValue > 12) {
    throw new Error('Invalid month')
  }

  if (!Number.isFinite(yearValue)) {
    throw new Error('Invalid year')
  }

  const startDate = new Date(Date.UTC(yearValue, monthValue - 1, 1))
  const endDate = new Date(Date.UTC(yearValue, monthValue, 1))

  return { startDate, endDate }
}

export class DashboardRepository implements IDashboardRepository {
  async getDashboard(
    workspaceId: string,
    month: string,
    year: string
  ): Promise<IDashboard> {
    // const now = new Date()
    const { startDate, endDate } = toMonthRange(month, year)

    const monthlyBaseWhere = and(
      eq(transactionsTable.workspaceId, workspaceId),
      isNull(transactionsTable.deletedAt),
      gte(transactionsTable.paymentDate, startDate),
      lt(transactionsTable.paymentDate, endDate)
    )

    // 📅 mês anterior
    const prevDate = new Date(Number(year), Number(month) - 2, 1)
    const prevMonth = prevDate.getMonth() + 1
    const prevYear = prevDate.getFullYear()

    const { startDate: prevStart, endDate: prevEnd } = toMonthRange(
      String(prevMonth),
      String(prevYear)
    )

    const [
      resumeRows,
      lastTransactions,
      expenseByCategoryRows,
      previousMonthRows,
    ] = await Promise.all([
      // resumo atual
      db
        .select({
          totalIncome: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INCOME' then ${transactionsTable.amount} else 0 end), 0)`,
          totalExpense: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'EXPENSE' then ${transactionsTable.amount} else 0 end), 0)`,
          totalInvestment: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INVESTMENT' then ${transactionsTable.amount} else 0 end), 0)`,
        })
        .from(transactionsTable)
        .where(monthlyBaseWhere),

      // últimas transações
      db.query.transactionsTable.findMany({
        columns: { deletedAt: false },
        where: monthlyBaseWhere,
        limit: 10,
        orderBy: desc(transactionsTable.paymentDate),
      }),

      // despesas por categoria
      db
        .select({
          name: transactionsTable.category,
          expense: sql<number>`coalesce(sum(${transactionsTable.amount}), 0)`,
        })
        .from(transactionsTable)
        .where(and(monthlyBaseWhere, eq(transactionsTable.type, 'EXPENSE')))
        .groupBy(transactionsTable.category),

      // mês anterior
      db
        .select({
          totalIncome: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'INCOME' then ${transactionsTable.amount} else 0 end), 0)`,
          totalExpense: sql<number>`coalesce(sum(case when ${transactionsTable.type} = 'EXPENSE' then ${transactionsTable.amount} else 0 end), 0)`,
        })
        .from(transactionsTable)
        .where(
          and(
            eq(transactionsTable.workspaceId, workspaceId),
            isNull(transactionsTable.deletedAt),
            gte(transactionsTable.paymentDate, prevStart),
            lt(transactionsTable.paymentDate, prevEnd)
          )
        ),
    ])

    const resume = resumeRows[0]
    const prev = previousMonthRows[0]

    const totalIncome = toMoney(resume?.totalIncome)
    const totalExpense = toMoney(resume?.totalExpense)
    const totalInvestment = toMoney(resume?.totalInvestment)

    const totalBalance = toMoney(totalIncome - totalExpense - totalInvestment)

    // 📊 percentuais corretos (base = receita)
    const totalIncomePercent = totalIncome > 0 ? 100 : 0
    const totalExpensePercent =
      totalIncome > 0 ? toMoney((totalExpense / totalIncome) * 100) : 0
    const totalInvestmentPercent =
      totalIncome > 0 ? toMoney((totalInvestment / totalIncome) * 100) : 0
    const totalBalancePercent =
      totalIncome > 0 ? toMoney((totalBalance / totalIncome) * 100) : 0

    // 🧠 métricas
    const savings = totalIncome - totalExpense

    const savingsRate =
      totalIncome > 0 ? toMoney((savings / totalIncome) * 100) : 0

    const daysInMonth = new Date(Number(year), Number(month), 0).getDate()

    const burnRate = totalExpense > 0 ? toMoney(totalExpense / daysInMonth) : 0

    const today = new Date()
    const isCurrentMonth =
      today.getUTCMonth() + 1 === Number(month) &&
      today.getUTCFullYear() === Number(year)

    const daysElapsed = isCurrentMonth ? today.getUTCDate() : daysInMonth

    const avgExpense = daysElapsed > 0 ? totalExpense / daysElapsed : 0

    const projectedExpense = avgExpense * daysInMonth

    const projectedBalance = toMoney(
      totalIncome - projectedExpense - totalInvestment
    )

    const expenseRatio =
      totalIncome > 0 ? toMoney((totalExpense / totalIncome) * 100) : 0

    const prevIncome = toMoney(prev?.totalIncome)
    const prevExpense = toMoney(prev?.totalExpense)

    const expenseChange =
      prevExpense > 0
        ? toMoney(((totalExpense - prevExpense) / prevExpense) * 100)
        : 0

    const incomeChange =
      prevIncome > 0
        ? toMoney(((totalIncome - prevIncome) / prevIncome) * 100)
        : 0

    // 📊 categorias
    const expenseByCategory = expenseByCategoryRows.map(item => {
      const value = toMoney(item.expense)

      return {
        name: item.name,
        expense: value,
        totalExpense,
        progress: totalExpense > 0 ? toMoney((value / totalExpense) * 100) : 0,
      }
    })

    // 📊 distribuição
    const monthlyDistribution = {
      income: totalIncomePercent,
      expense: totalExpensePercent,
      investment: totalInvestmentPercent,
    }

    return {
      resume: {
        totalIncome,
        totalIncomePercent,
        totalExpense,
        totalExpensePercent,
        totalBalance,
        totalBalancePercent,
        totalInvestment,
        totalInvestmentPercent,
      },
      metrics: {
        savingsRate,
        burnRate,
        projectedBalance,
        expenseRatio,
        expenseChange,
        incomeChange,
      },
      monthlyDistribution,
      lastTransactions,
      expenseByCategory,
    }
  }
}
