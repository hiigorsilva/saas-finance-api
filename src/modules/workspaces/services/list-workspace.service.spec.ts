import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListWorkspaceService } from './list-workspace.service'

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

const data = {
  userId: 'user_id',
  page: 1,
  limit: 10,
}

describe('ListWorkspaceService', async () => {
  let sut: ListWorkspaceService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new ListWorkspaceService(mockWorkspaceRepository)
  })

  it('should list all workspaces', async () => {
    const { userId, page, limit } = data
    const workspaces = {
      data: [
        {
          id: 'workspace_id',
          type: 'SHARED',
          name: 'Workspace_Name',
          description: 'Descrição do workspace',
        },
      ],
      totalCount: 1,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
    }

    mockWorkspaceRepository.list.mockResolvedValue(workspaces)
    const result = await sut.list({ userId, page, limit })

    expect(mockWorkspaceRepository.list).toHaveBeenCalledWith(
      userId,
      page,
      limit
    )
    expect(result).toEqual(workspaces)
  })
})
