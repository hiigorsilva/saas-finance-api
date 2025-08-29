import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ChangeRoleMemberDTO } from '../dto/change-role-member.dto'
import { ChangeRoleMemberService } from './change-role-member.service'

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

const inputData = {
  workspaceId: 'workspace_id',
  memberId: 'member_id',
  newRole: 'VIEWER' as ChangeRoleMemberDTO,
}

describe('ChangeRoleMemberService', async () => {
  let sut: ChangeRoleMemberService

  beforeEach(() => {
    sut = new ChangeRoleMemberService(
      mockWorkspaceMemberRepository,
      mockWorkspaceRepository
    )
  })

  it('should throw an error if workspace not found', async () => {
    const { workspaceId, memberId, newRole } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.changeMemberRole({ workspaceId, memberId, newRole })
    ).rejects.toThrow('Workspace not found.')
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).not.toHaveBeenCalled()
    expect(mockWorkspaceMemberRepository.isOwner).not.toHaveBeenCalled()
    expect(
      mockWorkspaceMemberRepository.changeMemberRole
    ).not.toHaveBeenCalled()
  })

  it('should  throw an error if user is not a member of the workspace', async () => {
    const { workspaceId, memberId, newRole } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(
      sut.changeMemberRole({ workspaceId, memberId, newRole })
    ).rejects.toThrow('User is not a member of this workspace.')
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceMemberRepository.isOwner).not.toHaveBeenCalled()
    expect(
      mockWorkspaceMemberRepository.changeMemberRole
    ).not.toHaveBeenCalled()
  })

  it('should throw an error if user is the workspace owner', async () => {
    const { workspaceId, memberId, newRole } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(true)

    await expect(
      sut.changeMemberRole({ workspaceId, memberId, newRole })
    ).rejects.toThrow(
      'You cannot change the role of the workspace owner as they are the original creator.'
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(mockWorkspaceMemberRepository.isOwner).toHaveBeenCalledWith(
      workspaceId,
      memberId
    )
    expect(
      mockWorkspaceMemberRepository.changeMemberRole
    ).not.toHaveBeenCalled()
  })

  it('should change the role of the workspace member', async () => {
    const { workspaceId, memberId, newRole } = inputData

    const response = {
      status: 'Member role successfully changed.',
    }

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(false)
    mockWorkspaceMemberRepository.changeMemberRole.mockResolvedValue(response)

    const result = await sut.changeMemberRole({
      workspaceId,
      memberId,
      newRole,
    })

    expect(result).toEqual(response.status)
  })
})
