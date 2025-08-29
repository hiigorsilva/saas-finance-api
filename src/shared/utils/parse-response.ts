import type { HttpResponse } from '../types/http'

export const parseResponse = ({ statusCode, body }: HttpResponse) => {
  return {
    statusCode,
    body,
  }
}
