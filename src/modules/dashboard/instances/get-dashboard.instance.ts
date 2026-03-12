import { GetDashboardController } from '../controllers/get-dashboard.controller'
import { DashboardRepository } from '../repositories/dashboard.repository'

const dashboardRepository = new DashboardRepository()

export const getDashboardController = new GetDashboardController(
  dashboardRepository
)
