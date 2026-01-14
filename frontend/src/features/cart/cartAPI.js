// import axios from "axios";

// const BASE_URL = "http://localhost:8000";

// // Add an item to cart
// export function addToCart(item) {
//   return axios
//     .post(`${BASE_URL}/cart`, item)
//     .then((response) => ({ data: response.data }))
//     .catch((error) => {
//       throw error.response?.data || error.message;
//     });
// }

// // Fetch all items of the logged-in user
// export function fetchItemsByUserId() {
//   return axios
//     .get(`${BASE_URL}/cart`)
//     .then((response) => ({ data: response.data }))
//     .catch((error) => {
//       throw error.response?.data || error.message;
//     });
// }

// // Update a cart item
// export function updateCart(update) {
//   return axios
//     .patch(`${BASE_URL}/cart/${update.id}`, update)
//     .then((response) => ({ data: response.data }))
//     .catch((error) => {
//       throw error.response?.data || error.message;
//     });
// }

// // Delete a single item from cart
// export function deleteItemFromCart(itemId) {
//   return axios
//     .delete(`${BASE_URL}/cart/${itemId}`)
//     .then(() => ({ data: { id: itemId } }))
//     .catch((error) => {
//       throw error.response?.data || error.message;
//     });
// }

// // Reset entire cart (delete all items)
// export async function resetCart() {
//   try {
//     const response = await fetchItemsByUserId();
//     const items = response.data;

//     for (let item of items) {
//       await deleteItemFromCart(item.id);
//     }

//     return { status: "success" };
//   } catch (error) {
//     throw error;
//   }
// }


import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true, // ensures cookies/session are sent
});

// Add an item to cart
export function addToCart(item) {
  return api
    .post("/cart", item)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Fetch all items of the logged-in user
export function fetchItemsByUserId() {
  return api
    .get("/cart")
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Update a cart item
export function updateCart(update) {
  return api
    .patch(`/cart/${update.id}`, update)
    .then((response) => ({ data: response.data }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Delete a single item from cart
export function deleteItemFromCart(itemId) {
  return api
    .delete(`/cart/${itemId}`)
    .then(() => ({ data: { id: itemId } }))
    .catch((error) => {
      throw error.response?.data || error.message;
    });
}

// Reset entire cart (delete all items)
export async function resetCart() {
  try {
    const response = await fetchItemsByUserId();
    const items = response.data;

    for (let item of items) {
      await deleteItemFromCart(item.id);
    }

    return { status: "success" };
  } catch (error) {
    throw error;
  }
}
