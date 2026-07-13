import { ListWorkspaceInviteController } from '../controllers/list-workspace-invite.controller'
import { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'
import { ListWorkspaceInviteService } from '../services/list-workspace-invite.service'

const workspaceInvitesRepository = new WorkspaceInvitesRepository()
const listWorkspaceInviteService = new ListWorkspaceInviteService(
  workspaceInvitesRepository
)

export const listWorkspaceInviteController = new ListWorkspaceInviteController(
  listWorkspaceInviteService
)
