import { DeclineWorkspaceInviteController } from '../controllers/decline-workspace-invite.controller'
import { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'
import { DeclineWorkspaceInviteService } from '../services/decline-workspace-invite.service'

const workspaceInvitesRepository = new WorkspaceInvitesRepository()
const declineWorkspaceInviteService = new DeclineWorkspaceInviteService(
  workspaceInvitesRepository
)

export const declineWorkspaceInviteController =
  new DeclineWorkspaceInviteController(declineWorkspaceInviteService)
