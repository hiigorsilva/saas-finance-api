import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { TransactionRepository } from '../repositories/transaction.repository'

type ListTransactionProps = {
  workspaceId: string
  page: number
  limit: number
}

export class ListTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async listAll({ workspaceId, page, limit }: ListTransactionProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const transactions = await this.transactionRepository.list(
      workspaceId,
      page,
      limit
    )
    return transactions
  }
}
