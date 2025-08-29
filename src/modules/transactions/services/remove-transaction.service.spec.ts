import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RemoveTransactionService } from './remove-transaction.service'

const mockTransactionRepository = {
  alreadyExistsById: vi.fn(),
  save: vi.fn(),
  edit: vi.fn(),
  remove: vi.fn(),
  findTransactionById: vi.fn(),
  list: vi.fn(),
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

describe('RemoveTransactionService', async () => {
  let sut: RemoveTransactionService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new RemoveTransactionService(
      mockTransactionRepository,
      mockWorkspaceRepository,
      mockWorkspaceMemberRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    transactionId: 'transaction_id',
    userId: 'user_id',
  }

  it('should throw an error if user is not a member of the workspace', async () => {
    const { transactionId, workspaceId, userId } = inputData

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(false)

    await expect(
      sut.removeTransaction({ workspaceId, transactionId, userId })
    ).rejects.toThrow('You are not a member of this workspace.')

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).not.toHaveBeenCalled()
    expect(mockTransactionRepository.alreadyExistsById).not.toHaveBeenCalled()
    expect(mockTransactionRepository.remove).not.toHaveBeenCalled()
  })

  it('should throw an error if workspace is not found', async () => {
    const { transactionId, workspaceId, userId } = inputData

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.removeTransaction({ workspaceId, transactionId, userId })
    ).rejects.toThrow('Workspace not found.')

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.alreadyExistsById).not.toHaveBeenCalled()
    expect(mockTransactionRepository.remove).not.toHaveBeenCalled()
  })

  it('should throw an error if transaction is not found', async () => {
    const { transactionId, workspaceId, userId } = inputData

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.removeTransaction({ workspaceId, transactionId, userId })
    ).rejects.toThrow('Transaction not found.')

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId,
      transactionId
    )
    expect(mockTransactionRepository.remove).not.toHaveBeenCalled()
  })

  it('should remove a transaction', async () => {
    const { transactionId, workspaceId, userId } = inputData
    const response = { status: 'Transaction deleted successfully.' }

    mockWorkspaceMemberRepository.isMember.mockResolvedValue(true)
    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.remove.mockResolvedValue(response)

    const result = await sut.removeTransaction({
      workspaceId,
      transactionId,
      userId,
    })

    expect(mockWorkspaceMemberRepository.isMember).toHaveBeenCalledWith(
      workspaceId,
      userId
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId,
      transactionId
    )
    expect(mockTransactionRepository.remove).toHaveBeenCalledWith(
      workspaceId,
      transactionId
    )
    expect(result).toEqual(response.status)
  })
})
