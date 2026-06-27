import type { RouteShorthandOptions } from 'fastify'
import z from 'zod'
import { privateRoute } from '../../../middlewares/private-route'
import {
  dataResponseSchema,
  errorResponseSchema,
} from '../../../shared/schemas/response.schema'
import { workspaceDetailsSchema } from '../utils/schemas/workspace-details.schema'

export const getWorkspaceBySlugParamsSchema = z.object({
  slug: z.string(),
})

export const getWorkspaceBySlugSchema: RouteShorthandOptions = {
  preHandler: [privateRoute],
  schema: {
    summary: 'Get a workspace by slug',
    description:
      'Returns workspace details when the authenticated user belongs to the requested workspace.',
    tags: ['Workspace'],
    security: [{ bearerAuth: [] }],
    params: getWorkspaceBySlugParamsSchema,
    response: {
      200: dataResponseSchema(workspaceDetailsSchema),
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
    },
  },
}
