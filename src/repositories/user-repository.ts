import { count, eq, isNull } from 'drizzle-orm'
import { db } from '../db/connection'
import { usersTable } from '../db/schemas/users'
import type {
  InputCreateUser,
  IPaginatedUsers,
  IUserRepository,
} from '../interfaces/users/user'

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

  async listAllUsers(page = 1, limit = 10): Promise<IPaginatedUsers> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const [totalCount, users] = await Promise.all([
      db
        .select({ count: count() })
        .from(usersTable)
        .where(isNull(usersTable.deletedAt))
        .then(row => Number(row[0].count ?? 0)),

      db.query.usersTable.findMany({
        columns: { passwordHashed: false, deletedAt: false },
        limit: safeLimit,
        offset: offset,
        where: isNull(usersTable.deletedAt),
      }),
    ])

    return {
      users: users,
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / safeLimit),
      currentPage: safePage,
      limit: safeLimit,
    }
  }
}
