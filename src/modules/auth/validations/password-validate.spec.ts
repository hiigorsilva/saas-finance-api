import { beforeEach, describe, expect, it, vi } from 'vitest'
import { validatePassword } from './password-validate'

const data = {
  password: '12345678',
  passwordHashed: 'hashed-12345678',
}

describe('validatePassword', async () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true if password is valid', () => {
    const result = validatePassword(data.password, data.passwordHashed)
    expect(result).toBe(true)
  })
})
