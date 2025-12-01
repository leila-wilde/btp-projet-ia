export const environment = {
  production: true,
  apiUrl: '/api',
  jwtTokenKey: 'auth_token',
  // JWT Configuration
  jwt: {
    storage: 'localStorage',
    expirationTime: 3600000,
    refreshPath: '/auth/refresh'
  },
  // API Configuration
  api: {
    auth: {
      login: '/auth/login',
      register: '/auth/register',
      logout: '/auth/logout',
      refresh: '/auth/refresh'
    },
    users: {
      profile: '/users/me',
      changePassword: '/users/change-password'
    },
    events: {
      list: '/events',
      create: '/events',
      detail: '/events/:id',
      register: '/events/:id/register',
      unregister: '/events/:id/unregister'
    },
    forum: {
      threads: '/forum/threads',
      posts: '/forum/posts',
      threadDetail: '/forum/threads/:id',
      userThreads: '/forum/user/threads',
      userPosts: '/forum/user/posts'
    },
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
