import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RemoveWorkspaceService } from './remove-workspace.service'

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

const data = {
  workspaceId: 'workspace_id',
  userId: 'user_id',
}

describe('RemoveWorkspaceService', async () => {
  let sut: RemoveWorkspaceService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new RemoveWorkspaceService(mockWorkspaceRepository)
  })

  it('should return an error if workspace is not exists', async () => {
    const { workspaceId, userId } = data

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)
    await expect(sut.remove({ workspaceId, userId })).rejects.toThrow(
      'Workspace not found.'
    )

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceRepository.remove).not.toHaveBeenCalled()
  })

  it('should removes a workspace by id', async () => {
    const { workspaceId, userId } = data

    const mockStatus = 'Workspace deleted successfully.'
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.remove.mockResolvedValue({ status: mockStatus })

    const result = await sut.remove({ workspaceId, userId })

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceRepository.remove).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(result).toEqual(mockStatus)
  })
})
