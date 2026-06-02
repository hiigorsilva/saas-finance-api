import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
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
    private workspaceMemberRepository: WorkspaceMemberRepository
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
    if (!isMember) {
      throw new AppError(
        'You are not a member of this workspace.',
        403,
        ErrorCodes.USER_NOT_WORKSPACE_MEMBER
      )
    }

    const alreadyExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!alreadyExists)
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )

    const transactionIsExists =
      await this.transactionRepository.alreadyExistsById(
        workspaceId,
        transactionId
      )
    if (!transactionIsExists)
      throw new AppError(
        'Transaction not found.',
        404,
        ErrorCodes.TRANSACTION_NOT_FOUND
      )

    const transaction = await this.transactionRepository.remove(
      workspaceId,
      transactionId
    )
    return transaction.status
  }
}
