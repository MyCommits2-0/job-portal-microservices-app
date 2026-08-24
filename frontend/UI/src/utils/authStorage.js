const AUTH_KEY = "authUser";

export const ROLES = {
  CANDIDATE: "candidate",
  RECRUITER: "recruiter",
  ADMIN: "admin",
};

export const roleHomePath = {
  [ROLES.CANDIDATE]: "/candidate/home",
  [ROLES.RECRUITER]: "/recruiter/dashboard",
  [ROLES.ADMIN]: "/admin/dashboard",
};

// Auth_User-Service returns role as an uppercase enum name (CANDIDATE/RECRUITER/ADMIN);
// the rest of the app (route guards, sidebar links, roleHomePath above) works with the
// lowercase ROLES constants, so every session boundary normalizes through this.
function normalizeRole(backendRole) {
  return String(backendRole || "").toLowerCase();
}

/**
 * Persists a real Auth_User-Service AuthResponseDto
 * ({ token, refreshToken, userId, email, role, message }) as the active session.
 * `extra.name` lets callers attach a display name the DTO itself doesn't carry
 * (e.g. the full name just typed into the register form, or a follow-up /auth/me call).
 */
export function setSession(authResponse, extra = {}) {
  const authUser = {
    role: normalizeRole(authResponse.role),
    name: extra.name || "",
    email: authResponse.email || "",
    userId: authResponse.userId,
    accessToken: authResponse.token,
    refreshToken: authResponse.refreshToken,
    loggedInAt: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  return authUser;
}

// Rotates the access/refresh token pair on the current session in place, without
// touching the rest of it. Used after a silent POST /auth/refresh-token call.
export function updateTokens(accessToken, refreshToken) {
  const authUser = getAuthUser();
  if (!authUser) return null;

  authUser.accessToken = accessToken;
  authUser.refreshToken = refreshToken;

  localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  return authUser;
}

// Merges additional profile fields (currently just `name`) into the active session.
export function updateSessionProfile(fields = {}) {
  const authUser = getAuthUser();
  if (!authUser) return null;

  Object.assign(authUser, fields);

  localStorage.setItem(AUTH_KEY, JSON.stringify(authUser));
  return authUser;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function getAuthUser() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getAccessToken() {
  return getAuthUser()?.accessToken || null;
}

export function getRefreshToken() {
  return getAuthUser()?.refreshToken || null;
}

export function isAuthenticated(role) {
  const user = getAuthUser();
  if (!user) return false;
  return role ? user.role === role : true;
}
