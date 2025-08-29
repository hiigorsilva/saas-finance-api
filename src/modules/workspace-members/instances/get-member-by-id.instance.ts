import { UserRepository } from '../../users/repositories/user.repository'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { GetMemberByIdController } from '../controllers/get-member-by-id.controller'
import { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'
import { GetMemberByIdService } from '../services/get-member-by-id.service'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const workspaceRepository = new WorkspaceRepository()
const userRepository = new UserRepository()
const getMemberByIdService = new GetMemberByIdService(
  workspaceMemberRepository,
  workspaceRepository,
  userRepository
)
export const getMemberByIdController = new GetMemberByIdController(
  getMemberByIdService
)
