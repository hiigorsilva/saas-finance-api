import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { IEditTransactionDTO } from '../dto/transaction.dto'
import type { TransactionRepository } from '../repositories/transaction.repository'

type EditTransactionProps = {
  workspaceId: string
  transactionId: string
  data: IEditTransactionDTO
}

export class EditTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async editTransaction({
    workspaceId,
    transactionId,
    data,
  }: EditTransactionProps) {
    const alreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!alreadyExists) throw new Error('Workspace not found.')

    const transactionIsExists =
      await this.transactionRepository.alreadyExistsById(
        workspaceId,
        transactionId
      )
    if (!transactionIsExists) throw new Error('Transaction not found.')

    const transaction = await this.transactionRepository.edit(
      workspaceId,
      transactionId,
      data
    )
    return transaction
  }
}
