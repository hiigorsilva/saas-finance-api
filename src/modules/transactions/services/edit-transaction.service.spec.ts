import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IEditTransactionDTO } from '../dto/transaction.dto'
import { EditTransactionService } from './edit-transaction.service'

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
  let sut: EditTransactionService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new EditTransactionService(
      mockTransactionRepository,
      mockWorkspaceRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    transactionId: 'transaction_id',
    data: {
      name: 'Editando o nome da transação',
      description: 'Editando a transação',
      type: 'INCOME',
      amount: '50.27',
      category: 'FAMILY',
      paymentDate: new Date(),
      isRecurring: false,
      currentInstallment: undefined,
      installmentTotal: undefined,
      recurringEndDate: undefined,
      recurringInterval: undefined,
    } as IEditTransactionDTO,
  }

  it('should throw an error if workspace is not found', async () => {
    const { workspaceId, transactionId, data } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.editTransaction({ workspaceId, transactionId, data })
    ).rejects.toThrow('Workspace not found.')
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(
      mockTransactionRepository.alreadyExistsById
    ).not.toHaveBeenCalledWith(workspaceId, transactionId)
    expect(mockTransactionRepository.edit).not.toHaveBeenCalledWith(
      workspaceId,
      transactionId,
      data
    )
  })

  it('should throw an error if transaction is not found', async () => {
    const { workspaceId, transactionId, data } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(
      sut.editTransaction({ workspaceId, transactionId, data })
    ).rejects.toThrow('Transaction not found.')
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId,
      transactionId
    )
    expect(mockTransactionRepository.edit).not.toHaveBeenCalled()
  })

  it('should edit a transaction', async () => {
    const { workspaceId, transactionId, data } = inputData
    const response = { id: 'transaction_id' }

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.edit.mockResolvedValue(response)

    const result = await sut.editTransaction({
      workspaceId,
      transactionId,
      data,
    })
    expect(result).toEqual(response)
  })
})
