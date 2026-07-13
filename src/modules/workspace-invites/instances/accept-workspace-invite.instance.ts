import { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import { AcceptWorkspaceInviteController } from '../controllers/accept-workspace-invite.controller'
import { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'
import { AcceptWorkspaceInviteService } from '../services/accept-workspace-invite.service'

const workspaceInvitesRepository = new WorkspaceInvitesRepository()
const workspaceMemberRepository = new WorkspaceMemberRepository()

const acceptWorkspaceInviteService = new AcceptWorkspaceInviteService(
  workspaceInvitesRepository,
  workspaceMemberRepository
)

export const acceptWorkspaceInviteController =
  new AcceptWorkspaceInviteController(acceptWorkspaceInviteService)
