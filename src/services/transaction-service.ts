import { and, eq } from 'drizzle-orm'
import { Permissions, type Roles } from '../data/roles'
import { db } from '../db/connection'
import { workspaceMembersTable } from '../db/schemas/workspace-members'
import type { CreateTransactionDto } from '../interfaces/transactions/transaction'
import type { TransactionRepository } from '../repositories/transaction-repository'
import type { WorkspaceRepository } from '../repositories/workspace-repository'
import { can } from '../validations/permissions'

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

  async list(userId: string, workspaceId: string, page: number, limit: number) {
    const transactions = await this.transactionRepository.list(
      userId,
      workspaceId,
      page,
      limit
    )
    return transactions
  }

  async findTransactionById(
    userId: string,
    workspaceId: string,
    transactionId: string
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

    const transaction = await this.transactionRepository.findTransactionById(
      userId,
      workspaceId,
      transactionId
    )

    return transaction
  }

  async delete(userId: string, workspaceId: string, transactionId: string) {
    const memberRole = await db.query.workspaceMembersTable.findFirst({
      where: and(
        eq(workspaceMembersTable.workspaceId, workspaceId),
        eq(workspaceMembersTable.userId, userId)
      ),
    })
    if (!memberRole) throw new Error('You are not a member of this workspace.')

    const hasPermission = can(
      memberRole.role as Roles,
      Permissions.TRANSACTION_DELETE
    )
    if (!hasPermission) {
      throw new Error('You do not have permission to delete this transaction.')
    }

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
