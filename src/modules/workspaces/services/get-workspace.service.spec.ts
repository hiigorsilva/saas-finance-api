import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IWorkspace } from '../interfaces/workspace.interface'
import { GetWorkspaceService } from './get-workspace.service'

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

const dataInput = {
  userId: 'user_id',
  workspaceId: 'workspace_id',
}

describe('GetWorkspaceService', async () => {
  let sut: GetWorkspaceService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new GetWorkspaceService(
      mockWorkspaceRepository,
      mockWorkspaceMemberRepository
    )
  })

  it('should return an error if user is not a member of the workspace', async () => {
    const { workspaceId, userId } = dataInput

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(sut.getWorkspaceById({ userId, workspaceId })).rejects.toThrow(
      'You are not a member of this workspace.'
    )

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).not.toHaveBeenCalled()
    expect(mockWorkspaceRepository.findWorkspaceById).not.toHaveBeenCalled()
  })

  it('should return an error if workspace is not exists', async () => {
    const { workspaceId, userId } = dataInput

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.getWorkspaceById({ userId, workspaceId })).rejects.toThrow(
      'Workspace not found.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceRepository.findWorkspaceById).not.toHaveBeenCalled()
  })

  it('should return an error if workspace is not exists', async () => {
    const { workspaceId, userId } = dataInput

    const workspaceDetails = {
      id: 'user_id',
      name: 'workspace_name',
      description: 'descrição do workspace',
      type: 'SHARED',
      ownerId: 'owner_id',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IWorkspace

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.findWorkspaceById.mockResolvedValue(
      workspaceDetails
    )

    const result = await sut.getWorkspaceById({ userId, workspaceId })

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(result).toEqual(workspaceDetails)
  })
})
