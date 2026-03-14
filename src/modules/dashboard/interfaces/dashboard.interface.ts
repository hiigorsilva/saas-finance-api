import type { ITransaction } from '../../transactions/interfaces/transaction.interface'

export interface IDashboard {
  resume: {
    totalIncome: number
    totalExpense: number
    totalBalance: number
    totalInvestment: number
  }
  monthlyDistribution: {
    income: number
    expense: number
    investment: number
  }
  lastTransactions: Array<ITransaction>
  expenseByCategory: Array<{
    name: string
    expense: string
    totalExpense: string
    progress: number
  }>
  weeklyPayment: Array<ITransaction>
  latePayments: Array<ITransaction>
}

export interface IDashboardRepository {
  getDashboard(
    workspaceId: string,
    month: string,
    year: string
  ): Promise<IDashboard>
}
