import type { WorkspaceMembersRepository } from '../../workspace-members/repositories/workspace-members.repository'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { TransactionRepository } from '../repositories/transaction.repository'

type RemoveTransactionProps = {
  workspaceId: string
  transactionId: string
  userId: string
}

export class RemoveTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMembersRepository
  ) {}

  async removeTransaction({
    workspaceId,
    transactionId,
    userId,
  }: RemoveTransactionProps) {
    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      userId
    )
    if (!isMember) throw new Error('You are not a member of this workspace.')

    const alreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!alreadyExists) throw new Error('Workspace not found.')

    const transactionIsExists =
      await this.transactionRepository.alreadyExistsById(
        workspaceId,
        transactionId
      )
    if (!transactionIsExists) throw new Error('Transaction not found.')

    const transaction = await this.transactionRepository.remove(
      workspaceId,
      transactionId
    )
    return transaction.status
  }
}
