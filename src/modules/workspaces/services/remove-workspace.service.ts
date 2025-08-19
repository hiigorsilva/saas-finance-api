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
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const { status } = await this.workspaceRepository.remove(
      workspaceId,
      userId
    )
    return status
  }
}
