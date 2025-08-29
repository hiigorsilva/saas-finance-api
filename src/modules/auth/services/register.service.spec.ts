import { beforeEach, describe, expect, it, vi } from 'vitest'
import { RegisterService } from './register.service'

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
  hashPassword: (password: string) => Promise.resolve(`hashed-${password}`),
}))

describe('RegisterService', () => {
  let registerService: RegisterService

  beforeEach(() => {
    vi.clearAllMocks()
    registerService = new RegisterService(mockUserRepository)
  })

  it('should throw an error if password is less than 8 characters', async () => {
    const userData = {
      name: 'John Doe',
      email: 'jhon@email.com',
      password: '12345',
    }
    await expect(registerService.execute(userData)).rejects.toThrow(
      'Password must be at least 8 characters long.'
    )
  })

  it('should throw an error if email is already in use', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@email.com',
      password: '12345678',
    }

    mockUserRepository.isUserExistsByEmail.mockResolvedValue(true)

    await expect(registerService.execute(userData)).rejects.toThrow(
      'This email is already in use.'
    )

    expect(mockUserRepository.isUserExistsByEmail).toHaveBeenCalledWith(
      userData.email
    )
  })

  it('should create a new user with encrypted password and return the created user', async () => {
    const newUser = {
      id: '123',
      name: 'John Doe',
      email: 'jhon@email.com',
      password: 'hashed-12345678',
    }

    mockUserRepository.isUserExistsByEmail.mockResolvedValue(false)
    mockUserRepository.save.mockResolvedValue(newUser)

    const userData = {
      name: 'John Doe',
      email: 'jhon@email.com',
      password: '12345678',
    }
    const result = await registerService.execute(userData)

    expect(mockUserRepository.isUserExistsByEmail).toHaveBeenCalledWith(
      userData.email
    )
    expect(mockUserRepository.save).toHaveBeenCalledWith({
      name: userData.name,
      email: userData.email,
      password: `hashed-${userData.password}`,
    })
    expect(result).toEqual(newUser)
  })
})
