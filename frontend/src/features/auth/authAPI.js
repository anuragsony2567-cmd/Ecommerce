import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // send cookies/session
});

// Create a new user (signup)
export function createUser(userData) {
  return api
    .post("/auth/signup", userData)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Login user
export function loginUser(loginInfo) {
  return api
    .post("/auth/login", loginInfo)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Check if user is authenticated
export function checkAuth() {
  return api
    .get("/auth/check")
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Sign out user
export function signOut() {
  return api
    .get("/auth/logout")
    .then(() => ({ data: "success" }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Request password reset
export function resetPasswordRequest(email) {
  return api
    .post("/auth/reset-password-request", { email })
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Reset password
export function resetPassword(data) {
  return api
    .post("/auth/reset-password", data)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}
