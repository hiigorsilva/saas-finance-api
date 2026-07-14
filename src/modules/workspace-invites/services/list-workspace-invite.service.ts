import type { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'

export class ListWorkspaceInviteService {
  constructor(private workspaceInvitesRepository: WorkspaceInvitesRepository) {}

  async list(userId: string) {
    return this.workspaceInvitesRepository.listInvitesByUser(userId)
  }
}
