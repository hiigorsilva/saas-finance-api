import { WorkspaceMembersRepository } from '../../workspace-members/repositories/workspace-members.repository'
import { CreateWorkspaceController } from '../controllers/create-workspace.controller'
import { WorkspaceRepository } from '../repositories/workspace.repository'
import { CreateWorkspaceService } from '../services/create-workspace.service'

const workspaceRepository = new WorkspaceRepository()
const workspaceMembersRepository = new WorkspaceMembersRepository()
const createWorkspaceService = new CreateWorkspaceService(
  workspaceRepository,
  workspaceMembersRepository
)
export const createWorkspaceController = new CreateWorkspaceController(
  createWorkspaceService
)
