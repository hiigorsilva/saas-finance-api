import type { WorkspaceRepository } from '../repositories/workspace-repository'
import type { CreateWorkspaceBodyType } from '../schemas/workspace-schema'

export class WorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async execute(data: CreateWorkspaceBodyType, userId: string) {
    // TODO: verificar se já existe um workspace com o mesmo nome

    const workspace = this.workspaceRepository.create(data, userId)
    return workspace
  }
}
