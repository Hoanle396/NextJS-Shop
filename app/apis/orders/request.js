import request from '../axios';

export const getOrders = async () => {
  const { data } = await request({
    url: '/order',
    method: 'GET'
  });
  return data;
};

export const getOrderById = async (id) => {
  const { data } = await request({
    url: `/order/${id}`,
    method: 'GET'
  });
  return data;
};

export const createOrder = async (payload) => {
  const { data } = await request({
    url: `/order`,
    method: 'POST',
    data: payload
  });
  return data;
};
