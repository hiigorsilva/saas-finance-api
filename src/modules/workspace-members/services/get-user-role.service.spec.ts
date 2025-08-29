import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetUserRoleService } from './get-user-role.service'

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

describe('GetUserRoleService', async () => {
  let sut: GetUserRoleService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new GetUserRoleService(
      mockWorkspaceMemberRepository,
      mockWorkspaceRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    userId: 'user_id',
  }

  it('should throw an error if workspace not found', async () => {
    const { workspaceId, userId } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.getUserRole(workspaceId, userId)).rejects.toThrow(
      'Workspace not found.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.getUserRole).not.toHaveBeenCalled()
  })

  it('should throw an error if user is not a member of the workspace', async () => {
    const { workspaceId, userId } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(sut.getUserRole(workspaceId, userId)).rejects.toThrow(
      'You are not a member of this workspace.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceMemberRepository.getUserRole).not.toHaveBeenCalled()
  })

  it('should get the user role', async () => {
    const { workspaceId, userId } = inputData
    const response = 'MEMBER'

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceMemberRepository.getUserRole.mockResolvedValue(response)

    const result = await sut.getUserRole(workspaceId, userId)

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceMemberRepository.getUserRole).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(result).toEqual(response)
  })
})
