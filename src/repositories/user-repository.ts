import { eq } from 'drizzle-orm'
import { db } from '../db/connection'
import { usersTable } from '../db/schemas/users'
import type { CreateUser, IUserRepository } from '../interfaces/user'

export class UserRepository implements IUserRepository {
  async isUserExists(email: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return !!user
  }

  async findUserByEmail(email: string) {
    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.email, email),
    })
    return user ?? null
  }

  async create(data: CreateUser) {
    const [newUser] = await db
      .insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        passwordHashed: data.passwordHashed,
      })
      .returning({ id: usersTable.id })
    return newUser
  }
}
