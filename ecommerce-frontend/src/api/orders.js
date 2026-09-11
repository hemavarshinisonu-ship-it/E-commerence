import api from './axios';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', typeof orderData === 'string' ? { shippingAddress: orderData } : orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};
