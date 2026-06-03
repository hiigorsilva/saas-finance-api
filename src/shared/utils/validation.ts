import type { ZodError } from 'zod'

export const getValidationMessage = (error: ZodError) => {
  return error.issues.at(0)?.message ?? 'Dados da requisição inválidos'
}
