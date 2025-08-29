import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { ICreateTransactionDTO } from '../dto/transaction.dto'
import type { TransactionRepository } from '../repositories/transaction.repository'

type CreateTransactionProps = {
  workspaceId: string
  userId: string
  data: ICreateTransactionDTO
}

export class CreateTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async create({ workspaceId, userId, data }: CreateTransactionProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const transaction = await this.transactionRepository.save(
      workspaceId,
      userId,
      data
    )
    return transaction
  }
}
