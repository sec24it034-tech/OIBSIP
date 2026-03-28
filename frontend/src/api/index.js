import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add token to requests
API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const logout = () => API.post('/auth/logout');
export const getCurrentUser = () => API.get('/auth/me');
export const forgotPassword = (data) => API.post('/auth/forgotpassword', data);
export const resetPassword = (token, data) => API.put(`/auth/resetpassword/${token}`, data);
export const updateProfile = (data) => API.put('/auth/updatedetails', data);

// Pizza APIs
export const getPizzas = () => API.get('/pizza');
export const getPizzaById = (id) => API.get(`/pizza/${id}`);
export const getIngredients = () => API.get('/pizza/ingredients/all');

// Order APIs
export const createOrder = (data) => API.post('/order', data);
export const getMyOrders = () => API.get('/order/myorders');
export const getOrderById = (id) => API.get(`/order/${id}`);
export const updateOrderStatus = (id, status) => API.put(`/order/${id}/status`, { orderStatus: status });
export const updatePayment = (id, data) => API.put(`/order/${id}/payment`, data);

// Payment APIs
export const createRazorpayOrder = (data) => API.post('/payment/create-order', data);
export const verifyPayment = (data) => API.post('/payment/verify', data);
export const getRazorpayKey = () => API.get('/payment/key');

// Admin APIs
export const getAllIngredients = () => API.get('/admin/ingredients');
export const getLowStockIngredients = () => API.get('/admin/ingredients/low-stock');
export const addIngredient = (data) => API.post('/admin/ingredients', data);
export const updateIngredient = (id, data) => API.put(`/admin/ingredients/${id}`, data);
export const updateIngredientStock = (id, stock) => API.put(`/admin/ingredients/${id}/stock`, { stock });
export const deleteIngredient = (id) => API.delete(`/admin/ingredients/${id}`);
export const getAllOrders = (status) => API.get(`/admin/orders${status ? `?status=${status}` : ''}`);
export const getAdminOrderById = (id) => API.get(`/admin/orders/${id}`);
export const updateAdminOrderStatus = (id, status) => API.put(`/admin/orders/${id}/status`, { orderStatus: status });
export const getDashboardStats = () => API.get('/admin/dashboard');

// User APIs
export const getUserProfile = () => API.get('/user/profile');
export const updateUserProfile = (data) => API.put('/user/profile', data);
export const updateUserAddress = (data) => API.put('/user/address', data);

export default API;