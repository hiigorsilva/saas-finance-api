import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerCors } from './config/plugins/cors'
import { registerHelmet } from './config/plugins/helmet'
import { registerRateLimit } from './config/plugins/rate-limit'
import { registerSerializerAndValidator } from './config/plugins/serialize-validate'
import { registerSwagger } from './config/plugins/swagger'
import { registerServerStart } from './config/start'
import { AppError } from './errors/app-error'
import { registerRoutes } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Register plugins
registerSerializerAndValidator(app)
registerHelmet(app)
registerCors(app)
registerRateLimit(app)
registerSwagger(app)

app.setErrorHandler((error, _request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      statusCode: error.statusCode,
      message: error.message,
      stack: error.stack,
    })
  }

  return reply.status(500).send({
    statusCode: 500,
    message: 'Internal server error',
    stack: error.stack,
  })
})

// Register routes
registerRoutes(app)

// Start server
registerServerStart(app)
