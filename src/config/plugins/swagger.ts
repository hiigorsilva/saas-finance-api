import fastifySwagger from '@fastify/swagger'
import scalarFastifyApiReference from '@scalar/fastify-api-reference'
import type { FastifyInstance } from 'fastify'
import { jsonSchemaTransform } from 'fastify-type-provider-zod'
import { env } from '../../shared/utils/env'

const apiDescription = `
SaaS Finance API is a multi-workspace finance platform for personal and shared money management.

Use this documentation to authenticate users, manage workspaces, invite workspace members, register transactions, and read dashboard metrics.

Response conventions:
- Success responses return { data }.
- Paginated responses return { data, props }, where props contains totalCount, totalPages, currentPage, and limit.
- Error responses return { message }. The HTTP status code is exposed by the response status itself.

Authentication:
- Protected routes require a Bearer JWT in the Authorization header.
- Workspace routes are scoped by workspaceId.
- Transaction and member-management routes also enforce role-based permissions inside the workspace.
`

export const registerSwagger = (app: FastifyInstance) => {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'SaaS Finance API',
        description: apiDescription,
        version: '1.0.0',
        contact: {
          name: 'Higor Silva',
          url: 'https://github.com/hiigorsilva',
        },
        license: {
          name: 'MIT',
        },
      },
      servers: [
        {
          url: `http://localhost:${env.PORT}`,
          description: 'Local development server',
        },
      ],
      tags: [
        {
          name: 'Health',
          description:
            'Operational endpoints used to verify whether the API is reachable.',
        },
        {
          name: 'Authentication',
          description:
            'User registration and sign-in. Sign-in and registration return an access token used by protected routes.',
        },
        {
          name: 'User',
          description:
            'Authenticated user data and administrative user listing/removal endpoints.',
        },
        {
          name: 'Workspace',
          description:
            'Workspace lifecycle. Workspaces isolate financial data and can be PRIVATE or SHARED.',
        },
        {
          name: 'Workspace Members',
          description:
            'Member listing and role management for shared workspaces. Role permissions define what each user can do.',
        },
        {
          name: 'Transaction',
          description:
            'Income, expense, and investment records attached to a workspace.',
        },
        {
          name: 'Dashboard',
          description:
            'Aggregated financial metrics, category breakdowns, and latest transactions for a workspace and month.',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description:
              'JWT returned by the authentication endpoints. Send it as: Authorization: Bearer <token>.',
          },
        },
        responses: {
          BadRequest: {
            description:
              'The request payload, params, or querystring did not pass validation.',
          },
          Unauthorized: {
            description:
              'The access token is missing, malformed, expired, or invalid.',
          },
          Forbidden: {
            description:
              'The authenticated user does not have permission to perform this action.',
          },
          NotFound: {
            description:
              'The requested resource does not exist or is not available in the current workspace scope.',
          },
          Conflict: {
            description:
              'The request conflicts with existing data, such as duplicated email, workspace name, or membership.',
          },
        },
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarFastifyApiReference, {
    routePrefix: '/api/docs',
    configuration: {
      theme: 'moon',
    },
  })
}
