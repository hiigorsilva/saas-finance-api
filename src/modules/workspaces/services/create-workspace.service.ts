import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import type { CreateWorkspaceDTO } from '../dto/workspace.dto'
import type { WorkspaceRepository } from '../repositories/workspace.repository'

export class CreateWorkspaceService {
  constructor(
    private workspaceRepository: WorkspaceRepository,
    private workspaceMembersRepository: WorkspaceMemberRepository
  ) {}

  async create(data: CreateWorkspaceDTO, userId: string) {
    const alreadyExists = await this.workspaceRepository.alreadyExistsByName(
      data.name,
      userId
    )
    if (alreadyExists) {
      throw new AppError(
        'Workspace name already exists',
        409,
        ErrorCodes.WORKSPACE_NAME_ALREADY_EXISTS
      )
    }

    const workspace = await this.workspaceRepository.save(data, userId)

    const addMemberToWorkspace =
      await this.workspaceMembersRepository.addMember(
        workspace.id,
        userId,
        'OWNER'
      )
    if (!addMemberToWorkspace)
      throw new AppError(
        'Error adding member to workspace',
        500,
        ErrorCodes.WORKSPACE_MEMBER_CREATION_FAILED
      )

    return workspace
  }
}
