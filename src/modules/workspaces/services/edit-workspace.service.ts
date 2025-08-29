import type { UpdateWorkspaceDTO } from '../dto/workspace.dto'
import type { WorkspaceRepository } from '../repositories/workspace.repository'

type EditWorkspaceProps = {
  workspaceId: string
  userId: string
  data: UpdateWorkspaceDTO
}

export class EditWorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async edit({ userId, workspaceId, data }: EditWorkspaceProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const workspace = await this.workspaceRepository.edit(
      workspaceId,
      userId,
      data
    )
    return workspace
  }
}
