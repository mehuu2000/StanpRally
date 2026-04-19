const DEV_FALLBACK_AUTH_SECRET = 'local-dev-auth-secret-change-me';

export const authSecret =
  process.env.NEXTAUTH_SECRET ??
  process.env.AUTH_SECRET ??
  DEV_FALLBACK_AUTH_SECRET;
