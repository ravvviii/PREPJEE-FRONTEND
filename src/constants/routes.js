export const ROUTES = {
  LOGIN: '/login',
  HOME: '/home',
  SUBJECTS: '/subjects',
  BOOKMARKS: '/bookmarks',
  PROGRESS: '/progress',
  PROFILE: '/profile',
  ADMIN_LOGIN: '/admin/login',
  ADMIN: '/admin',
};

// Routes reachable without a session.
export const PUBLIC_ROUTES = [ROUTES.LOGIN, ROUTES.ADMIN_LOGIN];

// Routes only a logged-out user should see (redirected away if already authenticated).
export const GUEST_ONLY_ROUTES = [ROUTES.LOGIN];
