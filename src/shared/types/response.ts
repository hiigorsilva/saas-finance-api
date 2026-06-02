export interface IPaginationOutput<T> {
  data: T[]
  totalCount: number
  totalPages: number
  currentPage: number
  limit: number
}

export type ApiResponse<T> = {
  data: T
}

export type ApiPaginatedResponse<T> = {
  data: T[]
  props: Omit<IPaginationOutput<T>, 'data'>
}

export type ApiErrorResponse = {
  message: string
}
