import axios from "axios";

// Axios instance with credentials
const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // ensures cookies/session are sent
});

// Create a new order
export function createOrder(order) {
  return api
    .post("/orders", order)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Update an existing order
export function updateOrder(order) {
  return api
    .patch(`/orders/${order.id}`, order)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Fetch all orders with sort & pagination (exact same query string logic)
export function fetchAllOrders(sort = {}, pagination = {}) {
  let queryString = "";

  for (let key in sort) {
    queryString += `${key}=${sort[key]}&`;
  }
  for (let key in pagination) {
    queryString += `${key}=${pagination[key]}&`;
  }

  return api
    .get(`/orders?${queryString}`)
    .then((response) => {
      const totalOrders = response.headers["x-total-count"];
      return { data: { orders: response.data, totalOrders: +totalOrders } };
    })
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}
