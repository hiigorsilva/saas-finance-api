import { WorkspaceMemberRepository } from '../../workspace-members/repositories/workspace-members.repository'
import { GetWorkspaceController } from '../controllers/get-workspace.controller'
import { WorkspaceRepository } from '../repositories/workspace.repository'
import { GetWorkspaceService } from '../services/get-workspace.service'

const workspaceRepository = new WorkspaceRepository()
const workspaceMemberRepository = new WorkspaceMemberRepository()
const getWorkspaceService = new GetWorkspaceService(
  workspaceRepository,
  workspaceMemberRepository
)
export const getWorkspaceController = new GetWorkspaceController(
  getWorkspaceService
)
