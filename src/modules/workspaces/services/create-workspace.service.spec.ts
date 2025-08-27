import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { CreateWorkspaceDTO } from '../dto/workspace.dto'
import { CreateWorkspaceService } from './create-workspace.service'

const mockWorkspaceRepository = {
  list: vi.fn(),
  alreadyExistsByName: vi.fn(),
  save: vi.fn(),
  alreadyExistsById: vi.fn(),
  findWorkspaceById: vi.fn(),
  edit: vi.fn(),
  remove: vi.fn(),
  isPrivateWorkspace: vi.fn(),
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

const inputData = {
  data: {
    name: 'Nome_workspace',
    type: 'SHARED',
    description: 'descrição do workspace',
  } as CreateWorkspaceDTO,
  userId: 'user_id',
}

describe('CreateWorkspaceService', () => {
  let sut: CreateWorkspaceService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new CreateWorkspaceService(
      mockWorkspaceRepository,
      mockWorkspaceMemberRepository
    )
  })

  it('should throw an error if workspace already exists by name', async () => {
    const { data, userId } = inputData
    const { name } = inputData.data

    mockWorkspaceRepository.alreadyExistsByName.mockResolvedValue(true)

    await expect(sut.create(data, userId)).rejects.toThrow(
      'Workspace name already exists'
    )

    expect(mockWorkspaceRepository.alreadyExistsByName).toHaveBeenCalledWith(
      name,
      userId
    )
    expect(mockWorkspaceRepository.save).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.addMember).not.toHaveBeenCalled()
  })

  it('should create a new workspace', async () => {
    const { data, userId } = inputData
    const { name } = inputData.data

    const workspaceId = { id: 'workspace_id' }
    const member = {
      id: '123456',
      workspaceId: 'workspace_id',
      userId: 'user_id',
      role: 'OWNER',
    }

    mockWorkspaceRepository.alreadyExistsByName.mockResolvedValue(false)
    mockWorkspaceRepository.save.mockResolvedValue(workspaceId)
    mockWorkspaceMemberRepository.addMember.mockResolvedValue(member)

    await expect(sut.create(data, userId)).resolves.toEqual(workspaceId)

    expect(mockWorkspaceRepository.alreadyExistsByName).toHaveBeenCalledWith(
      name,
      userId
    )
    expect(mockWorkspaceRepository.save).toHaveBeenCalledWith(data, userId)
    expect(mockWorkspaceMemberRepository.addMember).toHaveBeenCalledWith(
      workspaceId.id,
      userId,
      'OWNER'
    )
  })
})
