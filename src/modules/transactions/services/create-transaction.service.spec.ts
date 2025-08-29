import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { ICreateTransactionDTO } from '../dto/transaction.dto'
import { CreateTransactionService } from './create-transaction.service'

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

describe('CreateTransactionService', () => {
  let sut: CreateTransactionService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new CreateTransactionService(
      mockTransactionRepository,
      mockWorkspaceRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    userId: 'user_id',
    data: {
      name: 'Gasto X',
      description: 'Descrição da transação',
      type: 'EXPENSE',
      amount: '37.90',
      category: 'HOUSING',
      paymentDate: new Date(),
      isRecurring: false,
      currentInstallment: undefined,
      installmentTotal: undefined,
      recurringEndDate: undefined,
      recurringInterval: undefined,
    } as ICreateTransactionDTO,
  }

  it('should throw an error if workspace is not found', async () => {
    const { workspaceId, userId, data } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.create({ workspaceId, userId, data })).rejects.toThrow(
      'Workspace not found.'
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.save).not.toHaveBeenCalled()
  })

  it('should create a new transaction', async () => {
    const { workspaceId, userId, data } = inputData
    const response = { id: 'transaction_id' }

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.save.mockResolvedValue(response)

    const result = await sut.create({ workspaceId, userId, data })
    expect(result).toEqual(response)
  })
})
