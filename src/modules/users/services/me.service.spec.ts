import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { IUserOutput } from '../dto/user.dto'
import { MeService } from './me.service'

const mockUserRepository = {
  isUserExistsByEmail: vi.fn(),
  save: vi.fn(),
  isUserExistsById: vi.fn(),
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  listAllUsers: vi.fn(),
  listInactiveUsers: vi.fn(),
}

describe('MeService', () => {
  let sut: MeService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new MeService(mockUserRepository)
  })

  const userId = '123'

  it('should throw an error if user is not found', async () => {
    mockUserRepository.isUserExistsById.mockResolvedValue(false)

    await expect(sut.getUserData(userId)).rejects.toThrow('User not found')
    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.findUserById).not.toHaveBeenCalled()
  })

  it('should return user data if user is found', async () => {
    const user: IUserOutput = {
      id: userId,
      name: 'John Doe',
      financialProfile: null,
      email: 'john.doe@example.com',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockUserRepository.isUserExistsById.mockResolvedValue(true)
    mockUserRepository.findUserById.mockResolvedValue(user)

    const result = await sut.getUserData(userId)

    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(userId)
    expect(mockUserRepository.findUserById).toHaveBeenCalledWith(userId)
    expect(result).toEqual(user)
  })
})
