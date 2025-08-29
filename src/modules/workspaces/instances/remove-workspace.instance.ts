import { RemoveWorkspaceController } from '../controllers/remove-workspace.controller'
import { WorkspaceRepository } from '../repositories/workspace.repository'
import { RemoveWorkspaceService } from '../services/remove-workspace.service'

const workspaceRepository = new WorkspaceRepository()
const removeWorkspaceService = new RemoveWorkspaceService(workspaceRepository)
export const removeWorkspaceController = new RemoveWorkspaceController(
  removeWorkspaceService
)
