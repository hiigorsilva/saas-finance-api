import fastify from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { registerCors } from './config/plugins/cors'
import { registerRateLimit } from './config/plugins/rate-limit'
import { registerSerializerAndValidator } from './config/plugins/serialize-validate'
import { registerSwagger } from './config/plugins/swagger'
import { registerServerStart } from './config/start'
import { registerErrorHandler } from './middlewares/error-handler'
import { registerRoutes } from './routes'

const app = fastify().withTypeProvider<ZodTypeProvider>()

// Register plugins
registerSerializerAndValidator(app)
// registerHelmet(app)
registerCors(app)
registerRateLimit(app)
registerSwagger(app)
registerErrorHandler(app)

// Register routes
registerRoutes(app)

// Start server
registerServerStart(app)
