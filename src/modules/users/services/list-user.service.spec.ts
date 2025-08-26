import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ListUserService } from './list-user.service'

const mockUserRepository = {
  isUserExistsByEmail: vi.fn(),
  save: vi.fn(),
  isUserExistsById: vi.fn(),
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  listAllUsers: vi.fn(),
  listInactiveUsers: vi.fn(),
}

const props = {
  userId: '132',
  page: 1,
  limit: 10,
}

describe('ListUserService', () => {
  let sut: ListUserService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new ListUserService(mockUserRepository)
  })

  describe('listAllUsers', () => {
    it('should throw an error if user is not exists', async () => {
      const { userId, page, limit } = props
      mockUserRepository.isUserExistsById.mockResolvedValue(false)
      expect(sut.listAllUsers({ userId, page, limit })).rejects.toThrow(
        'User not found'
      )

      expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.listAllUsers).not.toHaveBeenCalled()
    })

    it('should return all users if user is exists', async () => {
      const { userId, page, limit } = props

      const users = {
        data: [
          {
            id: 'database_id',
            name: 'John Doe',
            email: 'john.doe@example.com',
            financialProfile: null,
            createdAt: '2025-08-26T20:53:27.565Z',
            updatedAt: '2025-08-26T20:53:27.565Z',
          },
        ],
        totalCount: 1,
        totalPages: 1,
        currentPage: 1,
        limit: 1,
      }

      mockUserRepository.isUserExistsById.mockResolvedValue(true)

      mockUserRepository.listAllUsers.mockResolvedValue(users)
      expect(sut.listAllUsers({ userId, page, limit })).resolves.toEqual(users)
      expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(userId)
      expect(mockUserRepository.listAllUsers(page, limit)).resolves.toEqual(
        users
      )
    })
  })
})
