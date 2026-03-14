import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import { hasPermission } from '../../../middlewares/user-permission'

export const getDashboardParamsSchema = z.object({
  workspaceId: z.string(),
})

export const getDashboardQuerySchema = z.object({
  month: z
    .string()
    .regex(/^(0?[1-9]|1[0-2])$/, 'Month must be between 1 and 12'),
  year: z.string().regex(/^\d{4}$/, 'Year must have 4 digits'),
})

export const getDashboardSchema: RouteShorthandOptions = {
  preHandler: [privateRoute, hasPermission],
  schema: {
    summary: 'Get dashboard data',
    consumes: ['application/json'],
    tags: ['Dashboard'],
    security: [{ bearerAuth: [] }],
    params: getDashboardParamsSchema,
    querystring: getDashboardQuerySchema,
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.object({}),
        }),
      }),
      400: z.object({
        statusCode: z.number().default(400),
        body: z.object({
          error: z.string(),
        }),
      }),
      401: z.object({
        statusCode: z.number().default(401),
        body: z.object({
          error: z.string(),
        }),
      }),
      403: z.object({
        statusCode: z.number().default(403),
        body: z.object({
          error: z.string(),
        }),
      }),
    },
  },
}
