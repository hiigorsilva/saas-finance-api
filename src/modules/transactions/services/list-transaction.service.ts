import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { TransactionRepository } from '../repositories/transaction.repository'

type ListTransactionProps = {
  workspaceId: string
  page: number
  limit: number
  search?: string
}

export class ListTransactionService {
  constructor(
    private transactionRepository: TransactionRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async listAll({ workspaceId, page, limit, search }: ListTransactionProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists)
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )

    if (search && search.length < 3) {
      throw new AppError(
        'The search term must be at least 3 characters long.',
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const transactions = await this.transactionRepository.list(
      workspaceId,
      page,
      limit,
      search
    )
    return transactions
  }
}
