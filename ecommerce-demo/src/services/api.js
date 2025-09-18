import axios from "axios";

const API_URL = "http://localhost:9000/store";
const AUTH_API_URL = "http://localhost:9000/auth";
const PUBLISHABLE_KEY = "pk_f39b41d09e59ef35a32f1f1608cace1f3e6916954f0701c83aedc38ccf9912e4";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "x-publishable-api-key": PUBLISHABLE_KEY,
  },
   withCredentials: true, // cho phép gửi cookie (dùng cho session cart)
});

// Axios instance cho /auth
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "x-publishable-api-key": PUBLISHABLE_KEY,
  },
  withCredentials: true,
});
/* ---------------- SẢN PHẨM ---------------- */
export async function fetchProducts() {
  const res = await api.get("/products");
  return res.data.products;
}

export async function fetchProductById(id) {
  const res = await api.get(`/products/${id}`);
  return res.data.product;
}

/* ---------------- GIỎ HÀNG ---------------- */
//lấy cartId
export async function createCart() {
  const res = await api.post("/carts", {});
  return res.data.cart;
}

export async function fetchCartDetail(cartId) {
  const res = await api.get(`/carts/${cartId}`);
  return res.data.cart;
}

export async function addToCart(cartId, variantId, quantity = 1) {
  const res = await api.post(`/carts/${cartId}/line-items`, { variant_id: variantId, quantity });
  return res.data.cart;
}

export async function updateCartItem(cartId, lineId, quantity) {
  const res = await api.put(`/carts/${cartId}/line-items/${lineId}`, { quantity });
  return res.data.cart;
}

export async function removeCartItem(cartId, lineId) {
  const res = await api.delete(`/carts/${cartId}/line-items/${lineId}`);
  return res.data.cart;
}

// ---------------- AUTH ----------------

//     const res = await api.post("/customers", data);
//     // data ví dụ: { email, password, first_name, last_name, phone }
//     return res.data.customer;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// }
// Đăng nhập lấy token
export async function registerCustomerAuth(data) {
  try {
    const res = await authApi.post("/customer/emailpass/register", data);
    // data ví dụ: { email, password }
    return res.data; // sẽ có access_token
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Đăng ký hồ sơ khách hàng nhận token từ registerCustomerAuth
export async function registerCustomer(data, token) {
  try {
    const res = await api.post("/customers", data, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}


// Đăng nhập khách hàng
export async function loginCustomer(email, password) {
  try {
    const res = await api.post("/auth/customer/emailpass", { email, password });
    // => { customer, token }
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
}

// Lấy thông tin customer hiện tại
export async function getCurrentCustomer() {
  try {
    // Endpoint đúng: GET /store/customers/me
    const res = await api.get("/customers/me");
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}


// Cập nhật profile
export async function updateCustomerProfile(data) {
  try {
    // Endpoint đúng: POST /store/customers/me
    const res = await api.post("/customers/me", data);
    return res.data.customer;
  } catch (err) {
    throw err.response?.data || err;
  }
}



/* ---------------- Payment Collections ---------------- */
// Tạo payment collection từ cart
export async function createPaymentCollection(cartId) {
  const res = await api.post(`/payment-collections`, { cart_id: cartId });
  return res.data.payment_collection;
}

// Thêm payment session (manual, paypal, stripe)
export async function addPaymentSession(collectionId, providerId) {
  const res = await api.post(`/payment-collections/${collectionId}/payment-sessions`, {
    provider_id: providerId,
  });
  return res.data.payment_collection;
}

// Hoàn tất thanh toán (order sẽ được tạo)
export async function completePayment(collectionId) {
  const res = await api.post(`/payment-collections/${collectionId}/complete`);
  return res.data.order;
}



/* ---------------- ORDERS ---------------- */

// Lấy chi tiết 1 order theo id
export async function fetchOrderById(orderId) {
  const res = await api.get(`/orders/${orderId}`);
  return res.data.order;
}

// Lấy danh sách đơn hàng (nếu user đã login)
// cần có token customer (login xong gắn Authorization header)
//ý là buộc ng dùng phải login mới lấy đc order
export async function fetchOrders(customerToken) {
  const authApi = axios.create({
    baseURL: API_URL,
    headers: {
      "x-publishable-api-key": PUBLISHABLE_KEY,
      Authorization: `Bearer ${customerToken}`, // token từ login
    },
  });

  const res = await authApi.get(`/orders`);
  return res.data.orders;
}


