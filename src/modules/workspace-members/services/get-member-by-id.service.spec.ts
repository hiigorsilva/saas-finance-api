import { beforeEach, describe, expect, it, vi, vitest } from 'vitest'
import type { IMembersWithRole } from '../dto/list-member.dto'
import { GetMemberByIdService } from './get-member-by-id.service'

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

const mockUserRepository = {
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  isUserExistsByEmail: vi.fn(),
  isUserExistsById: vi.fn(),
  listAllUsers: vi.fn(),
  listInactiveUsers: vi.fn(),
  save: vi.fn(),
}

const inputData = {
  workspaceId: 'workspace_id',
  memberId: 'member_id',
}

describe('GetMemberByIdService', async () => {
  let sut: GetMemberByIdService

  beforeEach(() => {
    vitest.clearAllMocks()
    sut = new GetMemberByIdService(
      mockWorkspaceMemberRepository,
      mockWorkspaceRepository,
      mockUserRepository
    )
  })

  it('should throw an error if workspace not found', async () => {
    const { workspaceId, memberId } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.getMemberById({ workspaceId, memberId })).rejects.toThrow(
      'Workspace not found.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockUserRepository.isUserExistsById).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.getMemberById).not.toHaveBeenCalled()
  })

  it('should throw an error if user not found', async () => {
    const { workspaceId, memberId } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockUserRepository.isUserExistsById.mockResolvedValue(false)

    await expect(sut.getMemberById({ workspaceId, memberId })).rejects.toThrow(
      'User not found.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(memberId)
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.getMemberById).not.toHaveBeenCalled()
  })

  it('should throw an error if user is not a member of the workspace', async () => {
    const { workspaceId, memberId } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockUserRepository.isUserExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(sut.getMemberById({ workspaceId, memberId })).rejects.toThrow(
      'You are not a member of this workspace.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(memberId)
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceMemberRepository.getMemberById).not.toHaveBeenCalled()
  })

  it('should get the data member by id', async () => {
    const { workspaceId, memberId } = inputData

    const dataMember = {
      id: 'member_id',
      name: 'John Doe',
      email: 'john.doe@email.com',
      role: 'MEMBER',
      financialProfile: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    } as IMembersWithRole

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockUserRepository.isUserExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceMemberRepository.getMemberById.mockResolvedValue(dataMember)

    const result = await sut.getMemberById({ workspaceId, memberId })
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(memberId)
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceMemberRepository.getMemberById).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(result).toEqual(dataMember)
  })
})
