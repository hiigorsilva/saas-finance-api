import { AppError } from '../../../errors/app-error'
import type { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import type { WorkspaceRepository } from '../repositories/workspace.repository'

type GetWorkspaceProps = {
  userId: string
  workspaceId: string
}

export class GetWorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private workspaceMemberRepository: WorkspaceMemberRepository
  ) {}

  async getWorkspaceById({ userId, workspaceId }: GetWorkspaceProps) {
    const isMember = await this.workspaceMemberRepository.isMember(
      workspaceId,
      userId
    )
    if (!isMember) {
      throw new AppError('You are not a member of this workspace.', 403)
    }

    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists) throw new AppError('Workspace not found.', 404)

    const workspace =
      await this.workspaceRepository.findWorkspaceById(workspaceId)

    return workspace
  }
}
