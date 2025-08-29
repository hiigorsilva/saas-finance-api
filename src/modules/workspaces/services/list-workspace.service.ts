import type { WorkspaceRepository } from '../repositories/workspace.repository'

type ListWorkspaceProps = {
  userId: string
  page: number
  limit: number
}

export class ListWorkspaceService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async list({ userId, page, limit }: ListWorkspaceProps) {
    const workspaces = await this.workspaceRepository.list(userId, page, limit)
    return workspaces
  }
}
