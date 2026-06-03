import type {
  ApiPaginatedResponse,
  ApiResponse,
  IPaginationOutput,
} from '../types/response'

export const dataResponse = <T>(data: T): ApiResponse<T> => ({
  data,
})

export const paginatedResponse = <T>({
  data,
  ...props
}: IPaginationOutput<T>): ApiPaginatedResponse<T> => ({
  data,
  props,
})
