import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IPaginationOutput } from '../../../shared/types/response'
import type { ITransaction } from '../interfaces/transaction.interface'
import { ListTransactionService } from './list-transaction.service'

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
  findWorkspaceBySlug: vi.fn(),
  isPrivateWorkspace: vi.fn(),
  list: vi.fn(),
  remove: vi.fn(),
  save: vi.fn(),
}

describe('ListTransactionService', async () => {
  let sut: ListTransactionService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new ListTransactionService(
      mockTransactionRepository,
      mockWorkspaceRepository
    )
  })

  const inputData = {
    workspaceId: 'workspace_id',
    page: 1,
    limit: 10,
  }

  it('should throw an error if workspace is not found', async () => {
    const { workspaceId, page, limit } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(false)

    await expect(sut.listAll({ workspaceId, page, limit })).rejects.toThrow(
      'Workspace not found.'
    )
    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.list).not.toHaveBeenCalled()
  })

  it('should list all transactions', async () => {
    const { workspaceId, page, limit } = inputData

    const response: IPaginationOutput<ITransaction> = {
      data: [
        {
          id: 'transaction_id',
          ownerId: 'user_creator_id',
          workspaceId: 'workspace_id',
          name: 'Nome da transação',
          description: 'Descrição da transação',
          type: 'INCOME',
          amount: '147.2',
          category: 'OTHER',
          paymentDate: new Date(),
          paymentMethod: 'PIX',
          updatedAt: new Date(),
          createdAt: new Date(),
        },
      ],
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      totalCount: 1,
    }

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.list.mockResolvedValue(response)

    const result = await sut.listAll({ workspaceId, page, limit })

    expect(mockWorkspaceRepository.alreadyExistsById).toHaveBeenCalledWith(
      workspaceId
    )
    expect(mockTransactionRepository.list).toHaveBeenCalledWith(
      workspaceId,
      page,
      limit,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )
    expect(result).toEqual(response)
  })

  it('should list transactions using flat filters from query', async () => {
    const { workspaceId, page, limit } = inputData
    const startDate = new Date('2026-01-01T00:00:00.000Z')
    const endDate = new Date('2026-01-31T23:59:59.999Z')

    const response: IPaginationOutput<ITransaction> = {
      data: [],
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      totalCount: 0,
    }

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)
    mockTransactionRepository.list.mockResolvedValue(response)

    const result = await sut.listAll({
      workspaceId,
      page,
      limit,
      search: 'mercado',
      type: 'EXPENSE',
      category: 'FOOD',
      paymentMethod: 'PIX',
      startDate,
      endDate,
    })

    expect(mockTransactionRepository.list).toHaveBeenCalledWith(
      workspaceId,
      page,
      limit,
      'mercado',
      'EXPENSE',
      'FOOD',
      'PIX',
      startDate,
      endDate
    )
    expect(result).toEqual(response)
  })

  it('should throw an error when startDate is greater than endDate', async () => {
    const { workspaceId, page, limit } = inputData

    mockWorkspaceRepository.alreadyExistsById.mockResolvedValue(true)

    await expect(
      sut.listAll({
        workspaceId,
        page,
        limit,
        startDate: new Date('2026-02-01T00:00:00.000Z'),
        endDate: new Date('2026-01-31T23:59:59.999Z'),
      })
    ).rejects.toThrow(
      'The start date must be earlier than or equal to the end date.'
    )

    expect(mockTransactionRepository.list).not.toHaveBeenCalled()
  })
})
