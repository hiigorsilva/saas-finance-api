import { eq } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { usersTable } from '../../../db/schemas/users'
import type {
  IUser,
  IUserRepository,
} from '../../../interfaces/users/user.interface'

export class UserRepository implements IUserRepository {
  async isUserExistsByEmail(email: string): Promise<boolean> {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return !!user
  }

  async isUserExistsById(userId: string): Promise<boolean> {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, userId),
    })
    return !!user
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return user ?? null
  }
}
