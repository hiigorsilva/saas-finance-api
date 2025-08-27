import { beforeEach, describe, expect, it, vi } from 'vitest'
import { SignInService } from './signin.service'

const mockUserRepository = {
  isUserExistsByEmail: vi.fn(),
  save: vi.fn(),
  isUserExistsById: vi.fn(),
  findUserByEmail: vi.fn(),
  findUserById: vi.fn(),
  listAllUsers: vi.fn(),
  listInactiveUsers: vi.fn(),
}

vi.mock('../validations/password-validate', () => ({
  validatePassword: (password: string, _: string) =>
    Promise.resolve(password === 'valid_password'),
}))

describe('SigninService', () => {
  let signinService: SignInService

  beforeEach(() => {
    vi.clearAllMocks()
    signinService = new SignInService(mockUserRepository)
  })

  it('should throw an error if user is not found', async () => {
    mockUserRepository.findUserByEmail.mockResolvedValue(null)

    const userData = {
      email: 'john@email.com',
      password: '12345678',
    }

    await expect(signinService.execute(userData)).rejects.toThrow(
      'Invalid credentials.'
    )

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      userData.email
    )
  })

  it('should throw an error if password is invalid', async () => {
    const userFromDatabase = {
      id: '123',
      name: 'John Doe',
      email: 'john@email.com',
      password: 'hashed-12345678',
    }
    mockUserRepository.findUserByEmail.mockResolvedValue(userFromDatabase)

    const userData = {
      email: 'john@email.com',
      password: 'invalid_password',
    }

    await expect(signinService.execute(userData)).rejects.toThrow(
      'Invalid credentials.'
    )

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      userData.email
    )
  })

  it('should return the user if credentials are valid', async () => {
    const userFromDatabase = {
      id: '123',
      email: 'john@email.com',
      password: 'hashed-12345678',
    }

    mockUserRepository.findUserByEmail.mockResolvedValue(userFromDatabase)

    const userData = {
      email: 'john@email.com',
      password: 'valid_password',
    }

    const user = await signinService.execute(userData)
    expect(user).toEqual(userFromDatabase)

    expect(mockUserRepository.findUserByEmail).toHaveBeenCalledWith(
      userData.email
    )
  })
})
