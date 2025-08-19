import { and, count, desc, eq, isNotNull, isNull } from 'drizzle-orm'
import { db } from '../../../db/connection'
import { usersTable } from '../../../db/schemas/users'
import type {
  IUser,
  IUserRepository,
} from '../../../interfaces/users/user.interface'
import type { IPaginationOutput } from '../../../shared/types/response'
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
      where: eq(usersTable.id, userId),
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

  async listAllUsers(
    page = 1,
    limit = 10
  ): Promise<IPaginationOutput<IUserOutput>> {
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
        where: isNull(usersTable.deletedAt),
        limit: safeLimit,
        offset: offset,
        orderBy: desc(usersTable.createdAt),
      }),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new Error('Page out of range. Please enter a valid page.')
    }

    return {
      data: users,
      totalCount: totalCount,
      totalPages: safeTotalPages,
      currentPage: safePage,
      limit: safeLimit,
    }
  }

  async listInactiveUsers(
    page = 1,
    limit = 10
  ): Promise<IPaginationOutput<IUserOutput>> {
    const safePage = Math.max(1, page)
    const safeLimit = Math.max(1, Math.min(limit, 100))
    const offset = (safePage - 1) * safeLimit

    const [totalCount, users] = await Promise.all([
      db
        .select({ count: count() })
        .from(usersTable)
        .where(isNotNull(usersTable.deletedAt))
        .then(row => Number(row[0].count ?? 0)),

      db.query.usersTable.findMany({
        columns: { passwordHashed: false, deletedAt: false },
        where: isNotNull(usersTable.deletedAt),
        limit: safeLimit,
        offset: offset,
        orderBy: desc(usersTable.createdAt),
      }),
    ])

    const totalPages = Math.ceil(totalCount / safeLimit)
    const safeTotalPages = Math.max(1, totalPages)
    if (safePage > safeTotalPages) {
      throw new Error('Page out of range. Please enter a valid page.')
    }

    return {
      data: users,
      totalCount: totalCount,
      totalPages: safeTotalPages,
      currentPage: safePage,
      limit: safeLimit,
    }
  }
}
