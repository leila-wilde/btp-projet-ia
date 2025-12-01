export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  jwtTokenKey: 'auth_token',
  // JWT Configuration
  jwt: {
    storage: 'localStorage', // 'localStorage' or 'sessionStorage'
    expirationTime: 3600000, // 1 hour in milliseconds
    refreshPath: '/auth/refresh'
  },
  // API Configuration
  api: {
    // Authentication endpoints
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    // User endpoints
    users: {
      profile: '/users/me',
      changePassword: '/users/change-password'
    },
    // Event endpoints
    events: {
      list: '/events',
      create: '/events',
      detail: '/events/:id',
      register: '/events/:id/register',
      unregister: '/events/:id/unregister'
    },
    // Forum endpoints
    forum: {
      threads: '/forum/threads',
      posts: '/forum/posts',
      threadDetail: '/forum/threads/:id',
      userThreads: '/forum/user/threads',
      userPosts: '/forum/user/posts'
    },
    // Workshop endpoints
    workshops: {
      list: '/workshops',
      create: '/workshops',
      detail: '/workshops/:id',
      vote: '/workshops/:id/vote',
      approve: '/workshops/:id/approve',
      reject: '/workshops/:id/reject'
    }
  }
};
