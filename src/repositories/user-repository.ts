import { eq } from 'drizzle-orm'
import { db } from '../db/connection'
import { usersTable } from '../db/schemas/users'
import type { InputCreateUser, IUserRepository } from '../interfaces/users/user'

export class UserRepository implements IUserRepository {
  async isUserExistsById(userId: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, userId),
    })
    return !!user
  }

  async isUserExistsByEmail(email: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return !!user
  }

  async findUserById(userId: string) {
    const user = await db.query.usersTable.findFirst({
      columns: {
        passwordHashed: false,
      },
      where: eq(usersTable.id, userId),
    })
    return user ?? null
  }

  async findUserByEmail(email: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return user ?? null
  }

  async create(data: InputCreateUser) {
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        passwordHashed: data.passwordHashed,
      })
      .returning({ id: usersTable.id })

    if (!newUser) throw new Error('Error creating user')
    return newUser
  }
}
