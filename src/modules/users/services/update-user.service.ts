import { AppError, ErrorCodes } from '../../../errors/app-error'
import { hashPassword } from '../../auth/validations/password-validate'
import type { UserRepository } from '../repositories/user.repository'

type UpdateUserProps = {
  userId: string
  name: string
  password: string
  birthDate: string | null
}

const isValidBirthDate = (value: string): boolean => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const [yearStr, monthStr, dayStr] = value.split('-')
  const year = Number(yearStr)
  const month = Number(monthStr)
  const day = Number(dayStr)

  const currentYear = new Date().getFullYear()
  if (year < 1900 || year > currentYear) return false

  const utcDate = new Date(Date.UTC(year, month - 1, day))

  return (
    utcDate.getUTCFullYear() === year &&
    utcDate.getUTCMonth() === month - 1 &&
    utcDate.getUTCDate() === day
  )
}

export class UpdateUserService {
  constructor(private userRepository: UserRepository) {}

  async updateUser({ userId, name, password, birthDate }: UpdateUserProps) {
    if (!userId) {
      throw new AppError('User ID is required', 400, ErrorCodes.INVALID_INPUT)
    }

    if (!name || !password) {
      throw new AppError(
        'Name and password are required fields',
        400,
        ErrorCodes.INVALID_INPUT
      )
    }

    if (password.length < 8 || password.length > 20) {
      throw new AppError(
        'Password must be between 8 and 20 characters long',
        400,
        ErrorCodes.INVALID_INPUT
      )
    }

    if (birthDate && !isValidBirthDate(birthDate)) {
      throw new AppError(
        'Birth date must be a valid date in the format YYYY-MM-DD',
        400,
        ErrorCodes.INVALID_INPUT
      )
    }

    const user = await this.userRepository.findUserById(userId)
    if (!user) {
      throw new AppError('User not found', 404, ErrorCodes.USER_NOT_FOUND)
    }

    const formattedBirthDate = birthDate

    const hashedPassword = await hashPassword(password)

    const updatedUser = await this.userRepository.updateUser({
      userId,
      name,
      passwordHashed: hashedPassword,
      birthDate: formattedBirthDate,
    })

    return updatedUser
  }
}
