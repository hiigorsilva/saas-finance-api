import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import { GetDashboardController } from '../controllers/get-dashboard.controller'
import { DashboardRepository } from '../repositories/dashboard.repository'
import { GetDashboardService } from '../services/dasboard.service'

const dashboardRepository = new DashboardRepository()
const workspaceRepository = new WorkspaceRepository()
const getDashboardService = new GetDashboardService(
  dashboardRepository,
  workspaceRepository
)

export const getDashboardController = new GetDashboardController(
  getDashboardService
)
