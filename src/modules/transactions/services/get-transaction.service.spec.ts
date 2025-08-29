import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GetTransactionService } from './get-transaction.service'

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

describe('GetTransactionService', async () => {
  let sut: GetTransactionService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new GetTransactionService(
      mockTransactionRepository,
      mockWorkspaceRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    transactionId: 'transaction_id',
  }

  it('should throw an error if workspace is not found', async () => {
    const { workspaceId, transactionId } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.getTransactionById({ workspaceId, transactionId })
    ).rejects.toThrow('Workspace not found.')
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.findTransactionById).not.toHaveBeenCalled()
  })

  it('should get transaction details by id', async () => {
    const { workspaceId, transactionId } = inputData

    const response = {
      id: 'transaction_id',
      createdByUserId: 'user_creator_id',
      workspaceId: 'workspace_id',
      name: 'Nome da transação',
      description: 'Descrição da transação',
      type: 'INCOME',
      amount: '147.20',
      category: 'OTHER',
      paymentDate: new Date(),
      isRecurring: false,
      recurringEndDate: null,
      currentInstallment: null,
      recurringInterval: null,
      installmentTotal: null,
      updatedAt: new Date(),
      createdAt: new Date(),
    }

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.findTransactionById.mockResolvedValue(response)

    const result = await sut.getTransactionById({ workspaceId, transactionId })

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.findTransactionById).toHaveBeenCalledWith(
      workspaceId,
      transactionId
    )
    expect(result).toEqual(response)
  })
})
