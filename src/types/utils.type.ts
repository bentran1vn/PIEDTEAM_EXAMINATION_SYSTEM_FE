export interface ErrorResponse<Data> {
  message: string
  data?: Data
}
export interface SuccessResponse<Data> {
  value: Data
  isSuccess: boolean
  isFailure: boolean
  error: Error
}

interface Error {
  code: string
  message: string
}

// -? loại bỏ undefined của key optional
// handle?
export type NoUndefinedField<T> = {
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
