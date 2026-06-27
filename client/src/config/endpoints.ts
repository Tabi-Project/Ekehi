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
  guides: {
    list: '/guides',
    byId: (id: string) => `/guides/${id}`,
  },
  training: {
    list: '/trainings',
    byId: (id: string) => `/trainings/${id}`,
  },
  templates: {
    list: '/templates',
    byId: (id: string) => `/templates/${id}`,
  },
  opportunities: {
    create: '/opportunities',
  },
  meta: {
    get: '/meta',
  },
} as const
