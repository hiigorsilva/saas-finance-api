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

  async delete(userId: string, workspaceId: string, transactionId: string) {
    const alreadyExists = await this.workspaceRepository.alreadyExistsById(
      workspaceId,
      userId
    )
    if (!alreadyExists) throw new Error('Workspace not found.')

    const transactionIsExists =
      await this.transactionRepository.alreadyExistsById(
        userId,
        workspaceId,
        transactionId
      )
    if (!transactionIsExists) throw new Error('Transaction not found.')

    const transaction = await this.transactionRepository.delete(
      userId,
      workspaceId,
      transactionId
    )
    return transaction.status
  }

  async update(
    userId: string,
    workspaceId: string,
    transactionId: string,
    data: CreateTransactionDto
  ) {
    const alreadyExists = await this.workspaceRepository.alreadyExistsById(
      workspaceId,
      userId
    )
    if (!alreadyExists) throw new Error('Workspace not found.')

    const transactionIsExists =
      await this.transactionRepository.alreadyExistsById(
        userId,
        workspaceId,
        transactionId
      )
    if (!transactionIsExists) throw new Error('Transaction not found.')

    const transaction = await this.transactionRepository.update(
      userId,
      workspaceId,
      transactionId,
      data
    )
    return transaction
  }
}
