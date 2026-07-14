import { AppError, ErrorCodes } from '../../../errors/app-error'
import type { WorkspaceRepository } from '../repositories/workspace.repository'

type GetWorkspaceProps = {
  slug: string
}

export class GetWorkspaceDetailsService {
  constructor(private workspaceRepository: WorkspaceRepository) {}

  async getWorkspaceBySlug({ slug }: GetWorkspaceProps) {
    if (!slug.trim()) {
      throw new AppError(
        'Workspace slug is required.',
        400,
        ErrorCodes.WORKSPACE_SLUG_REQUIRED
      )
    }

    const workspace = await this.workspaceRepository.findWorkspaceBySlug(slug)
    if (!workspace) {
      throw new AppError(
        'Workspace not found.',
        404,
        ErrorCodes.WORKSPACE_NOT_FOUND
      )
    }
    return workspace
  }
}
