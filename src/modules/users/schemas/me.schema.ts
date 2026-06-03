import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  financialProfile: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const meSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get authenticated user profile',
    description:
      'Returns the profile of the user identified by the Bearer token. Use it to hydrate the current session on the client.',
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    response: {
      200: dataResponseSchema(userSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
