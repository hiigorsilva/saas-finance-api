import { UserRepository } from '../../users/repositories/user.repository'
import { WorkspaceInvitesRepository } from '../../workspace-invites/repositories/workspace-invites.repository'
import { SendWorkspaceInviteService } from '../../workspace-invites/services/send-workspace-invite.service'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { AddMemberController } from '../controllers/add-member.controller'
import { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'
import { WorkspaceMemberService } from '../services/add-member.service'

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
const workspaceMemberService = new WorkspaceMemberService(
  sendWorkspaceInviteService
)
export const addMemberController = new AddMemberController(
  workspaceMemberService
)
