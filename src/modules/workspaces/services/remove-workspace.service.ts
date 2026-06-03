import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../repositories/workspace.repository'

type RemoveWorkspaceProps = {
  workspaceId: string
  userId: string
}

export class RemoveWorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async remove({ workspaceId, userId }: RemoveWorkspaceProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists)
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )

    const { status } = await this.workspaceRepository.remove(
      workspaceId,
      userId
    )
    return status
  }
}
