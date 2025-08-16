import type z from 'zod'
import type { signinBodySchema } from '../schemas/signin.schema'

export type SignInUserDTO = z.infer<typeof signinBodySchema>
