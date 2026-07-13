import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SendWorkspaceInviteService } from './send-workspace-invite.service'

const mockWorkspaceInvitesRepository = {
  acceptInvite: vi.fn(),
  declineInvite: vi.fn(),
  deleteInvite: vi.fn(),
  findPendingInviteById: vi.fn(),
  hasPendingInvite: vi.fn(),
  listInvitesByUser: vi.fn(),
  sendInvite: vi.fn(),
}

const mockWorkspaceRepository = {
  alreadyExistsById: vi.fn(),
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

const mockUserRepository = {
  findUserByEmail: vi.fn(),
}

describe('SendWorkspaceInviteService', () => {
  let sut: SendWorkspaceInviteService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new SendWorkspaceInviteService(
      mockWorkspaceInvitesRepository as never,
      mockWorkspaceRepository as never,
      mockWorkspaceMemberRepository as never,
      mockUserRepository as never
    )
  })

  it('should send invite with 5-day expiration', async () => {
    const input = {
      workspaceId: 'workspace_id',
      inviterId: 'owner_id',
      email: 'john.doe@email.com',
    }

    mockUserRepository.findUserByEmail.mockResolvedValue({
      id: 'user_id',
      email: 'john.doe@email.com',
    })

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.isPrivateWorkspace.mockResolvedValue(false)
    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)
    mockWorkspaceInvitesRepository.hasPendingInvite.mockResolvedValue(false)
    mockWorkspaceInvitesRepository.sendInvite.mockResolvedValue({
      id: 'invite_id',
    })

    const result = await sut.send(input)

    expect(mockWorkspaceInvitesRepository.sendInvite).toHaveBeenCalledTimes(1)
    expect(mockWorkspaceInvitesRepository.sendInvite).toHaveBeenCalledWith(
      'owner_id',
      'user_id',
      'workspace_id',
      expect.any(Date)
    )
    expect(result).toEqual({ id: 'invite_id' })
  })

  it('should throw conflict when invite is already pending', async () => {
    const input = {
      workspaceId: 'workspace_id',
      inviterId: 'owner_id',
      email: 'john.doe@email.com',
    }

    mockUserRepository.findUserByEmail.mockResolvedValue({
      id: 'user_id',
      email: 'john.doe@email.com',
    })

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockWorkspaceRepository.isPrivateWorkspace.mockResolvedValue(false)
    mockWorkspaceMemberRepository.isOwner.mockResolvedValue(true)
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)
    mockWorkspaceInvitesRepository.hasPendingInvite.mockResolvedValue(true)

    await expect(sut.send(input)).rejects.toThrow(
      'This user already has a pending invite for this workspace.'
    )

    expect(mockWorkspaceInvitesRepository.sendInvite).not.toHaveBeenCalled()
  })
})
