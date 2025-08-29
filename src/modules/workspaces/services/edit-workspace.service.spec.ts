import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IWorkspaceOutput, UpdateWorkspaceDTO } from '../dto/workspace.dto'
import { EditWorkspaceService } from './edit-workspace.service'

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

const inputData = {
  workspaceId: 'workspace_id',
  userId: 'user_id',
  data: {
    name: 'Nome_workspace',
    type: 'SHARED',
    description: 'descrição do workspace',
  } as UpdateWorkspaceDTO,
}

describe('EditWorkspaceService', async () => {
  let sut: EditWorkspaceService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new EditWorkspaceService(mockWorkspaceRepository)
  })

  it('should return an error if workspace is not exists', async () => {
    const { userId, workspaceId, data } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.edit({ userId, workspaceId, data })).rejects.toThrow(
      'Workspace not found.'
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
  })

  it('should edit a workspace by id', async () => {
    const { userId, workspaceId, data } = inputData

    const workspaceEdited = {
      id: 'workspace_id',
      name: 'Workspace Name',
      description: 'Descrição do workspace',
      type: 'SHARED',
    } as IWorkspaceOutput

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.edit.mockResolvedValue(workspaceEdited)

    const result = await sut.edit({ userId, workspaceId, data })

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceRepository.edit).toHaveBeenCalledWith(
      workspaceId,
      userId,
      data
    )
    expect(result).toEqual(workspaceEdited)
  })
})
