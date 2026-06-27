import z from 'zod'

export const workspaceDetailsSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  type: z.enum(['PRIVATE', 'SHARED']),
  ownerId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalMembers: z.number(),
  ownerName: z.string(),
  members: z.array(
    z.object({
      id: z.string(),
      userId: z.string(),
      workspaceId: z.string(),
      role: z.enum(['OWNER', 'ADMIN', 'MEMBER', 'VIEWER']),
      joinedAt: z.date(),
      userName: z.string(),
      userEmail: z.string(),
    })
  ),
})
