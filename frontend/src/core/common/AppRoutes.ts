export const AppRoutes = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  },
  DASHBOARD: {
    USER: '/api/v1/dashboard',
    ADMIN: '/api/v1/admin/dashboard',
  },
  USERS: {
    GET_ALL: '/api/v1/users',
    CREATE: '/api/v1/users',
    GET_ONE: '/api/v1/users/:id',
    UPDATE: '/api/v1/users/:id',
    DELETE: '/api/v1/users/:id',
  },
  TRANSACTIONS: {
    SUBSCRIBE: '/api/v1/transactions/subscribe',
    MY_TRANSACTIONS: '/api/v1/transactions/me',
    GET_ALL: '/api/v1/transactions',
    APPROVE: '/api/v1/transactions/:id/approve',
    REJECT: '/api/v1/transactions/:id/reject',
  },
  SCRAPER: {
    SCRAPE: '/api/v1/scrape',
    LOGS: '/api/v1/scrape/logs',
  },
};
