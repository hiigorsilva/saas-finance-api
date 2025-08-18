import { UserRepository } from '../../users/repositories/user.repository'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { AddMemberToWorkspaceController } from '../controllers/add-member-to-workspace.controller'
import { WorkspaceMembersRepository } from '../repositories/workspace-members.repository'
import { WorkspaceMemberService } from '../services/add-member.service'

const workspaceMemberRepository = new WorkspaceMembersRepository()
const workspaceRepository = new WorkspaceRepository()
const userRepository = new UserRepository()
const workspaceMemberService = new WorkspaceMemberService(
  workspaceMemberRepository,
  workspaceRepository,
  userRepository
)
export const addMemberToWorkspaceController =
  new AddMemberToWorkspaceController(workspaceMemberService)
