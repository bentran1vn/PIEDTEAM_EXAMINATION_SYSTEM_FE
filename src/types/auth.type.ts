import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  refreshTokenExpiryTime: string
}>

export type AuthResponse1 = {
  accessToken: string
}
