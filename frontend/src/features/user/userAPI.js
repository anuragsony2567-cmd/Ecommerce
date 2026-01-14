import axios from "axios";

// Axios instance with credentials
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // ensures cookies/session are sent
});

// Fetch orders of the logged-in user
export function fetchLoggedInUserOrders() {
  return api
    .get("/orders/own/")
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Fetch logged-in user details
export function fetchLoggedInUser() {
  return api
    .get("/users/own")
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Update a user
export function updateUser(update) {
  return api
    .patch(`/users/${update.id}`, update)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}
