import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { RemoveMemberController } from '../controllers/remove-member.controller'
import { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'
import { RemoveMemberService } from '../services/remove-member.service'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const workspaceRepository = new WorkspaceRepository()
const removeMemberService = new RemoveMemberService(
  workspaceMemberRepository,
  workspaceRepository
)
export const removeMemberController = new RemoveMemberController(
  removeMemberService
)
