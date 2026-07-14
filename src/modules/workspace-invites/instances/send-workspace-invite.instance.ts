import { UserRepository } from '../../users/repositories/user.repository'
import { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { SendWorkspaceInviteController } from '../controllers/send-workspace-invite.controller'
import { WorkspaceInvitesRepository } from '../repositories/workspace-invites.repository'
import { SendWorkspaceInviteService } from '../services/send-workspace-invite.service'

const workspaceInvitesRepository = new WorkspaceInvitesRepository()
const workspaceRepository = new WorkspaceRepository()
const workspaceMemberRepository = new WorkspaceMemberRepository()
const userRepository = new UserRepository()

const sendWorkspaceInviteService = new SendWorkspaceInviteService(
  workspaceInvitesRepository,
  workspaceRepository,
  workspaceMemberRepository,
  userRepository
)

export const sendWorkspaceInviteController = new SendWorkspaceInviteController(
  sendWorkspaceInviteService
)
