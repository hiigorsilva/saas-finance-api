import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DeclineWorkspaceInviteService } from './decline-workspace-invite.service'

const mockWorkspaceInvitesRepository = {
  declineInvite: vi.fn(),
  deleteInvite: vi.fn(),
  findPendingInviteById: vi.fn(),
}

describe('DeclineWorkspaceInviteService', () => {
  let sut: DeclineWorkspaceInviteService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new DeclineWorkspaceInviteService(
      mockWorkspaceInvitesRepository as never
    )
  })

  it('should decline invite', async () => {
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
    mockWorkspaceInvitesRepository.declineInvite.mockResolvedValue({
      status: 'Invite declined successfully.',
    })

    const result = await sut.decline({
      inviteId: 'invite_id',
      userId: 'user_id',
    })

    expect(mockWorkspaceInvitesRepository.declineInvite).toHaveBeenCalledWith(
      'invite_id',
      'user_id'
    )
    expect(result).toEqual({ status: 'Invite declined successfully.' })
  })
})
