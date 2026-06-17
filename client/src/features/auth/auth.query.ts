import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { clearTokens, getAccessToken, setTokens } from '@/lib/auth/token-store'

import { AuthService } from './auth.service'
import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  SignupRequest,
  SignupResponse,
} from './auth.types'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useMeQuery(enabled = true) {
  return useQuery<ProfileResponse, Error>({
    queryKey: authKeys.me(),
    queryFn: () => AuthService.me().then((response) => response.data),
    enabled: enabled && Boolean(getAccessToken()),
  })
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: (data) =>
      AuthService.login({ data }).then((response) => response.data),
    onSuccess: (response) => {
      setTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      })
      queryClient.invalidateQueries({ queryKey: authKeys.me() })
    },
  })
}

export function useSignupMutation() {
  const queryClient = useQueryClient()
  return useMutation<SignupResponse, Error, SignupRequest>({
    mutationFn: (data) =>
      AuthService.signup(data).then((response) => response.data),
    onSuccess: (response) => {
      if (response.session?.access_token && response.session.refresh_token) {
        setTokens({
          access_token: response.session.access_token,
          refresh_token: response.session.refresh_token,
        })
        queryClient.invalidateQueries({ queryKey: authKeys.me() })
      }
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  return useMutation<null, Error, void>({
    mutationFn: () => AuthService.logout().then((response) => response.data),
    onSettled: () => {
      clearTokens()
      queryClient.clear()
    },
  })
}
