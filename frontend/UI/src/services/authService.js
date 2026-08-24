import { createApiClient } from "../utils/httpClient";
import { getRefreshToken, logout as clearLocalSession } from "../utils/authStorage";

const AUTH_API_BASE_URL =
  import.meta.env.VITE_AUTH_SERVICE_URL || "http://localhost:8080/auth";

const api = createApiClient(AUTH_API_BASE_URL);

/* ===============================
   REGISTER / LOGIN
   Both return Auth_User-Service's AuthResponseDto:
   { token, refreshToken, userId, email, role, message }
================================ */

export const registerUser = async ({ fullName, email, password, role }) => {
  const response = await api.post("/register", {
    fullName,
    email,
    password,
    // Auth_User-Service's Role enum is CANDIDATE/RECRUITER/ADMIN.
    role: String(role).toUpperCase(),
  });

  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const response = await api.post("/login", { email, password });
  return response.data;
};

/* ===============================
   EMAIL VERIFICATION / PASSWORD RESET
================================ */

export const verifyEmail = async (token) => {
  const response = await api.get("/verify-email", { params: { token } });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ token, newPassword }) => {
  const response = await api.post("/reset-password", { token, newPassword });
  return response.data;
};

/* ===============================
   SESSION
================================ */

// Requires the Authorization header, which the shared client attaches
// automatically from the stored access token.
export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};

export const changePassword = async ({ currentPassword, newPassword }) => {
  const response = await api.post("/change-password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

// Best-effort: revokes the refresh token server-side, then always clears the
// local session regardless of whether the network call succeeds.
export const logoutUser = async () => {
  const refreshToken = getRefreshToken();

  clearLocalSession();

  if (!refreshToken) {
    return;
  }

  try {
    await api.post("/logout", { refreshToken });
  } catch {
    // Local session is already cleared; a failed server-side revoke isn't
    // worth surfacing to the user.
  }
};

/* ===============================
   ERROR HANDLING
   Auth_User-Service's GlobalExceptionHandler returns either:
   - 400 { message: "..." } for business errors (bad credentials, duplicate
     email, expired token, etc.)
   - 400 { fieldName: "message", ... } for @Valid bean-validation failures
================================ */

export function extractAuthErrorMessage(error) {
  const data = error?.response?.data;

  if (!data) {
    return error?.message || "Something went wrong. Please try again.";
  }

  if (typeof data.message === "string") {
    return data.message;
  }

  const firstFieldError = Object.values(data).find(
    (value) => typeof value === "string"
  );

  return firstFieldError || "Something went wrong. Please try again.";
}
