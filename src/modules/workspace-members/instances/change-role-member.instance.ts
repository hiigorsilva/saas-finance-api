import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { ChangeRoleMemberController } from '../controllers/change-role-member.controller'
import { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'
import { ChangeRoleMemberService } from '../services/change-role-member.service'

const workspaceMemberRepository = new WorkspaceMemberRepository()
const workspaceRepository = new WorkspaceRepository()
const changeRoleMemberService = new ChangeRoleMemberService(
  workspaceMemberRepository,
  workspaceRepository
)
export const changeRoleMemberController = new ChangeRoleMemberController(
  changeRoleMemberService
)
