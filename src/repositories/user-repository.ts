import { eq } from 'drizzle-orm'
import { db } from '../db/connection'
import { usersTable } from '../db/schemas/users'

type CreateUser = {
  name: string
  email: string
  passwordHashed: string
}

export class UserRepository {
  async findByEmail(email: string): Promise<boolean> {
    const user = await db.query.usersTable.findFirst({
      columns: { email: true },
      where: eq(usersTable.email, email),
    })
    return !!user
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
