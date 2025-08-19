import { EditWorkspaceController } from '../controllers/edit-workspace.controller'
import { WorkspaceRepository } from '../repositories/workspace.repository'
import { EditWorkspaceService } from '../services/edit-workspace.service'

const workspaceRepository = new WorkspaceRepository()
const editWorkspaceService = new EditWorkspaceService(workspaceRepository)
export const editWorkspaceController = new EditWorkspaceController(
  editWorkspaceService
)
