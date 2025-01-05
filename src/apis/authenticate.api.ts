import { AuthResponse1 } from 'src/types/auth.type'
import http from 'src/utils/http'

const URL = '/api/Identity'

const authApi = {
  loginAccount: (body: { email: string; password: string }) => http.post<AuthResponse1>(`${URL}/login`, body),
  registerAccount: (body: { email: string; username: string; password: string }) =>
    http.post<string>(`${URL}/register`, body),
  forgotAccount: (body: { email: string; password: string }) => http.post<string>(`${URL}/forgot_password`, body),
  logoutAccount: () => http.post('/logout')
}

export default authApi
