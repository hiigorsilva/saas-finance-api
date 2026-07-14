import { beforeEach, describe, expect, it, vi } from 'vitest'
import { type AppError, ErrorCodes } from '../../../errors/app-error'
import type { IWorkspaceDetails } from '../interfaces/workspace.interface'
import { GetWorkspaceDetailsService } from './get-workspace-details.service'

const mockWorkspaceRepository = {
  alreadyExistsById: vi.fn(),
  alreadyExistsByName: vi.fn(),
  edit: vi.fn(),
  findWorkspaceById: vi.fn(),
  findWorkspaceBySlug: vi.fn(),
  isPrivateWorkspace: vi.fn(),
  list: vi.fn(),
  remove: vi.fn(),
  save: vi.fn(),
}

const dataInput = {
  slug: 'workspace-name',
}

describe('GetWorkspaceDetailsService', async () => {
  let sut: GetWorkspaceDetailsService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new GetWorkspaceDetailsService(mockWorkspaceRepository)
  })

  it('should return an error if workspace slug is empty', async () => {
    await expect(sut.getWorkspaceBySlug({ slug: '   ' })).rejects.toMatchObject(
      {
        message: 'Workspace slug is required.',
        statusCode: 400,
        code: ErrorCodes.WORKSPACE_SLUG_REQUIRED,
      } satisfies Partial<AppError>
    )

    expect(mockWorkspaceRepository.findWorkspaceBySlug).not.toHaveBeenCalled()
  })

  it('should return an error if workspace does not exist', async () => {
    const { slug } = dataInput

    mockWorkspaceRepository.findWorkspaceBySlug.mockResolvedValue(null)

    await expect(sut.getWorkspaceBySlug({ slug })).rejects.toMatchObject({
      message: 'Workspace not found.',
      statusCode: 404,
      code: ErrorCodes.WORKSPACE_NOT_FOUND,
    } satisfies Partial<AppError>)

    expect(mockWorkspaceRepository.findWorkspaceBySlug).toHaveBeenCalledWith(
      slug
    )
  })

  it('should return workspace details by slug', async () => {
    const { slug } = dataInput
    const joinedAt = new Date()
    const workspaceDetails = {
      id: 'workspace_id',
      name: 'workspace_name',
      slug,
      description: 'descrição do workspace',
      type: 'SHARED',
      ownerId: 'owner_id',
      ownerName: 'Owner Name',
      totalMembers: 1,
      members: [
        {
          id: 'member_id',
          userId: 'user_id',
          workspaceId: 'workspace_id',
          role: 'OWNER',
          joinedAt,
          userName: 'Owner Name',
          userEmail: 'owner@email.com',
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    } as IWorkspaceDetails

    mockWorkspaceRepository.findWorkspaceBySlug.mockResolvedValue(
      workspaceDetails
    )

    const result = await sut.getWorkspaceBySlug({ slug })

    expect(mockWorkspaceRepository.findWorkspaceBySlug).toHaveBeenCalledWith(
      slug
    )
    expect(result).toEqual(workspaceDetails)
  })
})
