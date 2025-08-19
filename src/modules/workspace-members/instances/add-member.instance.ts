import { UserRepository } from '../../users/repositories/user.repository'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { AddMemberController } from '../controllers/add-member.controller'
import { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'
import { WorkspaceMemberService } from '../services/add-member.service'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const workspaceRepository = new WorkspaceRepository()
const userRepository = new UserRepository()
const workspaceMemberService = new WorkspaceMemberService(
  workspaceMemberRepository,
  workspaceRepository,
  userRepository
)
export const addMemberController = new AddMemberController(
  workspaceMemberService
)
