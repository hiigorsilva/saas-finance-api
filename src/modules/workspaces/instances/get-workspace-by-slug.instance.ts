import { GetWorkspaceDetailsController } from '../controllers/get-workspace-by-slug.controller'
import { WorkspaceRepository } from '../repositories/workspace.repository'
import { GetWorkspaceDetailsService } from '../services/get-workspace-details.service'

const workspaceRepository = new WorkspaceRepository()
const getWorkspaceDetailsService = new GetWorkspaceDetailsService(
  workspaceRepository
)
export const getWorkspaceDetailsController = new GetWorkspaceDetailsController(
  getWorkspaceDetailsService
)
