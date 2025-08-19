import { ListWorkspaceController } from '../controllers/list-workspace.controller'
import { WorkspaceRepository } from '../repositories/workspace.repository'
import { ListWorkspaceService } from '../services/list-workspace.service'

const workspaceRepository = new WorkspaceRepository()
const listWorkspaceService = new ListWorkspaceService(workspaceRepository)
export const listWorkspaceController = new ListWorkspaceController(
  listWorkspaceService
)
