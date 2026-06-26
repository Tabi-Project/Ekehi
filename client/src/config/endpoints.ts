export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    signup: '/auth/signup',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
  },
  me: {
    profile: '/profile',
  },
  opportunities: {
    list: '/opportunities',
    detail: (id: string) => `/opportunities/${id}`,
    save: (id: string) => `/opportunities/${id}/save`,
    unsave: (id: string) => `/opportunities/${id}/save`,
  },
} as const
