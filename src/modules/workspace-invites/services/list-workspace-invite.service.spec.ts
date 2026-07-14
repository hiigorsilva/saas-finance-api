import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListWorkspaceInviteService } from './list-workspace-invite.service'

const mockWorkspaceInvitesRepository = {
  listInvitesByUser: vi.fn(),
}

describe('ListWorkspaceInviteService', () => {
  let sut: ListWorkspaceInviteService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new ListWorkspaceInviteService(
      mockWorkspaceInvitesRepository as never
    )
  })

  it('should list invites by user', async () => {
    const invites = [
      {
        id: 'invite_id',
        workspaceId: 'workspace_id',
        workspaceName: 'Workspace Alpha',
        inviterId: 'owner_id',
        inviterName: 'John Owner',
        inviteeId: 'user_id',
        status: 'PENDING',
        expiresAt: new Date(),
      },
    ]

    mockWorkspaceInvitesRepository.listInvitesByUser.mockResolvedValue(invites)

    const result = await sut.list('user_id')

    expect(
      mockWorkspaceInvitesRepository.listInvitesByUser
    ).toHaveBeenCalledWith('user_id')
    expect(result).toEqual(invites)
  })
})
