import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RemoveMemberService } from './remove-member.service'

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

const mockWorkspaceRepository = {
  alreadyExistsById: vi.fn(),
  alreadyExistsByName: vi.fn(),
  edit: vi.fn(),
  findWorkspaceById: vi.fn(),
  isPrivateWorkspace: vi.fn(),
  list: vi.fn(),
  remove: vi.fn(),
  save: vi.fn(),
}

describe('RemoveMemberService', async () => {
  let sut: RemoveMemberService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new RemoveMemberService(
      mockWorkspaceMemberRepository,
      mockWorkspaceRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    userId: 'user_id',
    memberId: 'member_id',
  }

  it('should throw an error if the user wants to remove himself from the workspace', async () => {
    const inputDataWithEqualsIds = {
      workspaceId: 'workspace_id',
      userId: 'equals_id',
      memberId: 'equals_id',
    }
    const { workspaceId, userId, memberId } = inputDataWithEqualsIds

    await expect(
      sut.removeMember({ workspaceId, userId, memberId })
    ).rejects.toThrow(
      'The user cannot remove themselves from the workspace. Instead, delete the workspace.'
    )
    expect(mockWorkspaceMemberRepository.isOwner).not.toHaveBeenCalled()
    expect(mockWorkspaceRepository.alreadyExistsById).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.removeMember).not.toHaveBeenCalled()
  })

  it('should throw an error if the member is the owner of the workspace', async () => {
    const { workspaceId, userId, memberId } = inputData

    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(true)

    await expect(
      sut.removeMember({ workspaceId, userId, memberId })
    ).rejects.toThrow('The workspace owner cannot be removed.')

    expect(mockWorkspaceMemberRepository.isOwner).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.removeMember).not.toHaveBeenCalled()
  })

  it('should throw an error if workspace not found', async () => {
    const { workspaceId, userId, memberId } = inputData

    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(false)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.removeMember({ workspaceId, userId, memberId })
    ).rejects.toThrow('Workspace not found.')

    expect(mockWorkspaceMemberRepository.isOwner).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.removeMember).not.toHaveBeenCalled()
  })

  it('should throw an error if user is not a member of the workspace', async () => {
    const { workspaceId, userId, memberId } = inputData

    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(false)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(
      sut.removeMember({ workspaceId, userId, memberId })
    ).rejects.toThrow('User is not a member of this workspace.')

    expect(mockWorkspaceMemberRepository.isOwner).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceMemberRepository.removeMember).not.toHaveBeenCalled()
  })

  it('should remove the member from the workspace', async () => {
    const { workspaceId, userId, memberId } = inputData
    const response = { status: 'Member successfully removed.' }

    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(false)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceMemberRepository.removeMember.mockResolvedValue(response)

    const result = await sut.removeMember({ workspaceId, userId, memberId })
    expect(result).toEqual(response.status)
  })
})
