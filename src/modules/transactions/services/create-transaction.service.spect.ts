import { beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceRepository } from '../../workspaces/repositories/workspace.repository'
import type { ICreateTransactionDTO } from '../dto/transaction.dto'
import { TransactionRepository } from '../repositories/transaction.repository'
import { CreateTransactionService } from './create-transaction.service'

const mockTransactionRepository = {
  save: vi.fn(),
  list: vi.fn(),
  findTransactionById: vi.fn(),
  edit: vi.fn(),
  remove: vi.fn(),
  alreadyExistsById: vi.fn(),
}

const mockWorkspaceRepository = {
  save: vi.fn(),
  list: vi.fn(),
  findWorkspaceById: vi.fn(),
  edit: vi.fn(),
  remove: vi.fn(),
  alreadyExistsById: vi.fn(),
  alreadyExistsByName: vi.fn(),
  isPrivateWorkspace: vi.fn(),
}

const dataTransaction = {
  workspaceId: 'workspace_id',
  userId: 'user_id',
  data: {
    name: 'John',
    type: 'INCOME',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    amount: '47.50',
    category: 'FOOD',
    paymentDate: new Date(),
    isRecurring: false,
    recurringEndDate: undefined,
    recurringInterval: undefined,
    recurringFrequency: undefined,
    currentInstallment: undefined,
    totalInstallments: undefined,
    installmentTotal: undefined,
  } as ICreateTransactionDTO,
}

describe('CreateTransactionService', async () => {
  let sut: CreateTransactionService

  const transactionRepository = new TransactionRepository()
  const workspaceRepository = new WorkspaceRepository()

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new CreateTransactionService(
      transactionRepository,
      workspaceRepository
    )
  })

  it('should throw an error if workspace is not exists', async () => {
    const { workspaceId, userId, data } = dataTransaction

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
    const { workspaceId, userId, data } = dataTransaction

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    mockTransactionRepository.save.mockResolvedValue(data)

    const result = await sut.create({ workspaceId, userId, data })
    expect(mockTransactionRepository.save).toHaveBeenCalledWith(
      workspaceId,
      userId,
      data
    )
    expect(result).toEqual(data)
  })
})
