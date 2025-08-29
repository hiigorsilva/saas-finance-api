import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IMembersWithRole } from '../dto/list-member.dto'
import { ListMemberService } from './list-member.service'

const mockWorkspaceMemberRepository = {
  addMember: vi.fn(),
  changeMemberRole: vi.fn(),
  getMemberById: vi.fn(),
  getUserRole: vi.fn(),
  isMember: vi.fn(),
  isOwner: vi.fn(),
  listAllMembers: vi.fn(),
  removeMember: vi.fn(),
}

describe('ListMemberService', async () => {
  let sut: ListMemberService

  beforeEach(() => {
    sut = new ListMemberService(mockWorkspaceMemberRepository)
  })

  const inputData = {
    workspaceId: 'workspace_id',
    userId: 'user_id',
    page: 1,
    limit: 10,
  }

  it('should throw an error if user is not a member of the workspace', async () => {
    const { workspaceId, userId, page, limit } = inputData

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(
      sut.listAll({ workspaceId, userId, page, limit })
    ).rejects.toThrow('You are not a member of this workspace.')

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceMemberRepository.listAllMembers).not.toHaveBeenCalled()
  })

  it('should list all members of the workspace', async () => {
    const { workspaceId, userId, page, limit } = inputData
    const listMembers = {
      data: [
        {
          id: 'user_id',
          name: 'John Doe',
          email: 'john.doe@email.com',
          role: 'MEMBER',
          financialProfile: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        } as IMembersWithRole,
      ],
      totalCount: 1,
      totalPages: 1,
      currentPage: page,
      limit: limit,
    }

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceMemberRepository.listAllMembers.mockResolvedValue(listMembers)

    const result = await sut.listAll({ workspaceId, userId, page, limit })

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceMemberRepository.listAllMembers).toHaveBeenCalledWith(
      workspaceId,
      page,
      limit
    )
    expect(result).toEqual(listMembers)
  })
})
