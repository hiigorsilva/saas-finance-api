import { AppError } from '../../../errors/app-error'
import type { WorkspaceMemberRepository } from '../repositories/workspace-members.repository'

type ListMemberProps = {
  workspaceId: string
  userId: string
  page: number
  limit: number
}

export class ListMemberService {
  constructor(private workspaceMemberRepository: WorkspaceMemberRepository) {}

  async listAll({ workspaceId, userId, page, limit }: ListMemberProps) {
    const workspaceAlreadyExists =
      await this.workspaceMemberRepository.isMember(workspaceId, userId)
    if (!workspaceAlreadyExists) {
      throw new AppError('You are not a member of this workspace.', 403)
    }

    const members = await this.workspaceMemberRepository.listAllMembers(
      workspaceId,
      page,
      limit
    )

    return members
  }
}
