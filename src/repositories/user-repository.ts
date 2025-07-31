import { eq } from 'drizzle-orm'
import { db } from '../db/connection'
import { usersTable } from '../db/schemas/users'

type CreateUser = {
  name: string
  email: string
  passwordHashed: string
}

export class UserRepository {
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
    return user
  }

  async create(data: CreateUser): Promise<{ id: string }> {
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
