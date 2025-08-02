import type { WorkspaceRepository } from '../repositories/workspace-repository'
import type { CreateWorkspaceBodyType } from '../schemas/workspace-schema'

export class WorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async create(data: CreateWorkspaceBodyType, userId: string) {
    const alreadyExists = await this.workspaceRepository.alreadyExistsByName(
      data.name,
      userId
    )
    if (alreadyExists) {
      throw new Error('Workspace name already exists')
    }

    const workspace = await this.workspaceRepository.create(data, userId)
    return workspace
  }

  async list(userId: string) {
    const workspaces = await this.workspaceRepository.list(userId)
    return workspaces
  }

  async delete(workspaceId: string, userId: string) {
    const workspaceIsExists = await this.workspaceRepository.alreadyExistsById(
      workspaceId,
      userId
    )
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const { status } = await this.workspaceRepository.delete(
      workspaceId,
      userId
    )
    return status
  }

  async update(
    workspaceId: string,
    userId: string,
    data: CreateWorkspaceBodyType
  ) {
    const workspaceIsExists = await this.workspaceRepository.alreadyExistsById(
      workspaceId,
      userId
    )
    if (!workspaceIsExists) throw new Error('Workspace not found.')

    const workspace = await this.workspaceRepository.update(
      workspaceId,
      userId,
      data
    )
    return workspace
  }
}
