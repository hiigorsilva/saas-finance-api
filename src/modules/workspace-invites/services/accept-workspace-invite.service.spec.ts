import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AcceptWorkspaceInviteService } from './accept-workspace-invite.service'

const mockWorkspaceInvitesRepository = {
  acceptInvite: vi.fn(),
  deleteInvite: vi.fn(),
  findPendingInviteById: vi.fn(),
}

const mockWorkspaceMemberRepository = {
  addMember: vi.fn(),
  isMember: vi.fn(),
}

describe('AcceptWorkspaceInviteService', () => {
  let sut: AcceptWorkspaceInviteService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new AcceptWorkspaceInviteService(
      mockWorkspaceInvitesRepository as never,
      mockWorkspaceMemberRepository as never
    )
  })

  it('should accept invite and add user as MEMBER', async () => {
    const invite = {
      id: 'invite_id',
      workspaceId: 'workspace_id',
      inviterId: 'owner_id',
      inviteeId: 'user_id',
      status: 'PENDING',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
      acceptedAt: null,
      declinedAt: null,
    }

    mockWorkspaceInvitesRepository.findPendingInviteById.mockResolvedValue(
      invite
    )
    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)
    mockWorkspaceInvitesRepository.acceptInvite.mockResolvedValue({
      status: 'Invite accepted successfully.',
    })

    const result = await sut.accept({
      inviteId: 'invite_id',
      userId: 'user_id',
    })

    expect(mockWorkspaceMemberRepository.addMember).toHaveBeenCalledWith(
      'workspace_id',
      'user_id',
      'MEMBER'
    )
    expect(mockWorkspaceInvitesRepository.acceptInvite).toHaveBeenCalledWith(
      'invite_id',
      'user_id'
    )
    expect(result).toEqual({ status: 'Invite accepted successfully.' })
  })

  it('should throw error when invite is expired', async () => {
    const invite = {
      id: 'invite_id',
      workspaceId: 'workspace_id',
      inviterId: 'owner_id',
      inviteeId: 'user_id',
      status: 'PENDING',
      createdAt: new Date(),
      expiresAt: new Date(Date.now() - 1000),
      acceptedAt: null,
      declinedAt: null,
    }

    mockWorkspaceInvitesRepository.findPendingInviteById.mockResolvedValue(
      invite
    )

    await expect(
      sut.accept({ inviteId: 'invite_id', userId: 'user_id' })
    ).rejects.toThrow('Invite expired.')

    expect(mockWorkspaceInvitesRepository.deleteInvite).toHaveBeenCalledWith(
      'invite_id'
    )
    expect(mockWorkspaceMemberRepository.addMember).not.toHaveBeenCalled()
  })
})
