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
  updateUser: vi.fn(),
}

describe('RemoveUserService', async () => {
  let sut: RemoveUserService

  beforeEach(() => {
    vi.clearAllMocks()
    sut = new RemoveUserService(mockUserRepository)
  })

  const inputData = {
    userIdParams: crypto.randomUUID(),
  }

  it('should throw an error if user is not found', async () => {
    const { userIdParams } = inputData

    mockUserRepository.isUserExistsById.mockResolvedValue(false)

    await expect(sut.removeUser({ userIdParams })).rejects.toThrow(
      'User not found.'
    )

    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(
      userIdParams
    )
    expect(mockUserRepository.remove).not.toHaveBeenCalled()
  })

  it('should remove a user', async () => {
    const { userIdParams } = inputData
    const response = { status: 'User successfully deleted.' }

    mockUserRepository.isUserExistsById.mockResolvedValue(true)
    mockUserRepository.remove.mockResolvedValue(response)

    const result = await sut.removeUser({ userIdParams })

    expect(mockUserRepository.isUserExistsById).toHaveBeenCalledWith(
      userIdParams
    )
    expect(mockUserRepository.remove).toHaveBeenCalledWith(userIdParams)
    expect(result).toEqual(response.status)
  })
})
