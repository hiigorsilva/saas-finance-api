import crypto from 'node:crypto'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RemoveUserService } from './remove-user.service'

const mockUserRepository = {
  isUserExistsByEmail: vi.fn(),
  save: vi.fn(),
  isUserExistsById: vi.fn(),
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  listAllUsers: vi.fn(),
  listInactiveUsers: vi.fn(),
  remove: vi.fn(),
}

describe('RemoveUserService', async () => {
  let sut: RemoveUserService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new RemoveUserService(mockUserRepository)
  })

  const inputData = {
    userId: crypto.randomUUID(),
  }

  it('should throw an error if user is not found', async () => {
    const { userId } = inputData

    mockUserRepository.isUserExistsById.mockResolvedValue(false)

    await expect(sut.removeUser({ userId })).rejects.toThrow('User not found.')

    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.remove).not.toHaveBeenCalled()
  })

  it('should remove a user', async () => {
    const { userId } = inputData
    const response = { status: 'User successfully deleted.' }

    mockUserRepository.isUserExistsById.mockResolvedValue(true)
    mockUserRepository.remove.mockResolvedValue(response)

    const result = await sut.removeUser({ userId })

    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.remove).toHaveBeenCalledWith(userId)
    expect(result).toEqual(response.status)
  })
})
