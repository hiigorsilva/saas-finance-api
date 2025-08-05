import type { CreateTransactionDto } from '../interfaces/transactions/transaction'
import type { TransactionRepository } from '../repositories/transaction-repository'
import type { WorkspaceRepository } from '../repositories/workspace-repository'

export class TransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async create(
    workspaceId: string,
    userId: string,
    data: CreateTransactionDto
  ) {
    const workspaceIsExists = await this.workspaceRepository.alreadyExistsById(
      workspaceId,
      userId
    )
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const transaction = await this.transactionRepository.create(
      workspaceId,
      userId,
      data
    )
    return transaction
  }

  async list(userId: string, workspaceId: string) {
    const transactions = await this.transactionRepository.list(
      userId,
      workspaceId
    )
    return transactions
  }
}
