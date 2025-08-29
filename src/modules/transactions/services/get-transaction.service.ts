import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { TransactionRepository } from '../repositories/transaction.repository'

type GetTransactionProps = {
  workspaceId: string
  transactionId: string
}

export class GetTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async getTransactionById({
    workspaceId,
    transactionId,
  }: GetTransactionProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const transaction = await this.transactionRepository.findTransactionById(
      workspaceId,
      transactionId
    )
    return transaction
  }
}
