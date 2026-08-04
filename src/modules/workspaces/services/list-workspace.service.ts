import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../repositories/workspace.repository'

type ListWorkspaceProps = {
  userId: string
  page: number
  limit: number
  searchWorkspace?: string
}

export class ListWorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async list({ userId, page, limit, searchWorkspace }: ListWorkspaceProps) {
    if (searchWorkspace && searchWorkspace.length < 3) {
      throw new AppError(
        'The search term must be at least 3 characters long.',
        400,
        ErrorCodes.VALIDATION_ERROR
      )
    }

    const workspaces = await this.workspaceRepository.list(
      userId,
      page,
      limit,
      searchWorkspace
    )
    return workspaces
  }
}
