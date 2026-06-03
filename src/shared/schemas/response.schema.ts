import z from 'zod'

export const errorResponseSchema = z.object({
  message: z.string(),
  code: z.string(),
})

export const dataResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
  })

export const paginatedResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    props: z.object({
      totalCount: z.number(),
      totalPages: z.number(),
      currentPage: z.number(),
      limit: z.number(),
    }),
  })
