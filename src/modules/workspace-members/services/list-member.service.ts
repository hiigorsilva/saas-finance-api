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
      throw new Error('You are not a member of this workspace.')
    }

    const members = await this.workspaceMemberRepository.listMembers(
      workspaceId,
      page,
      limit
    )

    return members
  }
}
