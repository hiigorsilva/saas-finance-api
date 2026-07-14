import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceMemberService } from './add-member.service'

const mockSendWorkspaceInviteService = {
  send: vi.fn(),
}

const inputData = {
  workspaceId: 'workspace_id',
  inviterId: 'owner_id',
  email: 'john.doe@email.com',
}

describe('WorkspaceMemberService', async () => {
  let sut: WorkspaceMemberService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new WorkspaceMemberService(mockSendWorkspaceInviteService as never)
  })

  it('should delegate to send workspace invite service', async () => {
    mockSendWorkspaceInviteService.send.mockResolvedValue({ id: 'invite_id' })

    const result = await sut.addMember(inputData)

    expect(mockSendWorkspaceInviteService.send).toHaveBeenCalledWith(inputData)
    expect(result).toEqual({ id: 'invite_id' })
  })
})
