import type { ITransaction } from '../../transactions/interfaces/transaction.interface'

export interface IDashboard {
  resume: {
    totalIncome: number
    totalIncomePercent: number
    totalExpense: number
    totalExpensePercent: number
    totalBalance: number
    totalBalancePercent: number
    totalInvestment: number
    totalInvestmentPercent: number
  }

  metrics: {
    savingsRate: number
    burnRate: number
    projectedBalance: number
    expenseRatio: number
    expenseChange: number
    incomeChange: number
  }

  monthlyDistribution: {
    income: number
    expense: number
    investment: number
  }

  lastTransactions: Array<ITransaction>

  expenseByCategory: Array<{
    name: string
    expense: number
    totalExpense: number
    progress: number
  }>
}

export interface IDashboardRepository {
  getDashboard(
    workspaceId: string,
    month: string,
    year: string
  ): Promise<IDashboard>
}
