import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'

export const userUpdateInputSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  birthDate: z
    .string()
    .nullable()
    .describe('It must be in the format YYYY-MM-DD'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(20, 'Password must be at most 20 characters long'),
})

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
  financialProfile: z.string().nullable(),
  birthDate: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export const updateUserSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Update user profile',
    description:
      "Update the authenticated user's profile information, including name, birth date, and password.",
    tags: ['User'],
    security: [{ bearerAuth: [] }],
    consumes: ['application/json'],
    body: userUpdateInputSchema,
    response: {
      200: dataResponseSchema(userSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
