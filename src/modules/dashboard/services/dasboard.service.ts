import { AppError } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { DashboardRepository } from '../repositories/dashboard.repository'

type GetDashboardProps = {
  workspaceId: string
  month: string
  year: string
}

export class GetDashboardService {
  constructor(
    private dashboardRepository: DashboardRepository,
    private workspaceRepository: WorkspaceRepository
  ) {}

  async getDashboard({ workspaceId, month, year }: GetDashboardProps) {
    const workspaceIsExists =
      await this.workspaceRepository.alreadyExistsById(workspaceId)
    if (!workspaceIsExists) throw new AppError('Workspace not found.', 404)

    const dashboard = await this.dashboardRepository.getDashboard(
      workspaceId,
      month,
      year
    )
    return dashboard
  }
}
