import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'

export const meSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get data user logged',
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    response: {
      200: z.object({
        statusCode: z.number().default(200),
        body: z.object({
          data: z.object({
            id: z.string(),
            name: z.string(),
            email: z.email(),
            financialProfile: z.string().nullable(),
            createdAt: z.date(),
            updatedAt: z.date(),
          }),
        }),
      }),
    },
  },
}
