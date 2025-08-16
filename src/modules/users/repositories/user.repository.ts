import { and, eq, isNull } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { usersTable } from '../../../db/schemas/users'
import type {
  IUser,
  IUserRepository,
} from '../../../interfaces/users/user.interface'
import type { RegisterUserDTO } from '../../auth/dto/register.dto'
import type { IUserId, IUserOutput } from '../dto/user.dto'

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

  async save(data: RegisterUserDTO): Promise<IUserId> {
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        passwordHashed: data.password,
      })
      .returning({ id: usersTable.id })

    return newUser
  }

  async findUserByEmail(email: string): Promise<IUser | null> {
    const user = await db.query.usersTable.findFirst({
      where: and(eq(usersTable.email, email), isNull(usersTable.deletedAt)),
    })
    return user ?? null
  }

  async findUserById(userId: string): Promise<IUserOutput | null> {
    const user = await db.query.usersTable.findFirst({
      columns: {
        passwordHashed: false,
        deletedAt: false,
      },
      where: and(eq(usersTable.id, userId), isNull(usersTable.deletedAt)),
    })
    return user ?? null
  }
}
