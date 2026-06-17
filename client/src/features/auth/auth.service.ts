import { ENDPOINTS } from '@/config/endpoints'
import type { ApiResponse } from '@/lib/api'
import { makeRequest } from '@/lib/api'

import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RefreshResponse,
  SignupRequest,
  SignupResponse,
} from './auth.types'

const signupRequest = makeRequest<SignupResponse, FormData>(
  ENDPOINTS.auth.signup,
  'POST',
)

export const AuthService = {
  login: makeRequest<LoginResponse, LoginRequest>(ENDPOINTS.auth.login, 'POST'),
  signup: (request: SignupRequest): Promise<ApiResponse<SignupResponse>> => {
    const form = new FormData()
    form.append('email', request.email)
    form.append('password', request.password)
    form.append('firstName', request.firstName)
    form.append('lastName', request.lastName)
    if (request.profileImage) {
      form.append('profileImage', request.profileImage)
    }
    return signupRequest({ data: form })
  },
  logout: makeRequest<null>(ENDPOINTS.auth.logout, 'POST'),
  refresh: makeRequest<RefreshResponse, { refresh_token: string }>(
    ENDPOINTS.auth.refresh,
    'POST',
  ),
  me: makeRequest<ProfileResponse>(ENDPOINTS.me.profile, 'GET'),
}
