import request from '../axios';

export const getProduct = async (params) => {
  const { data } = await request({
    url: '/product',
    method: 'GET',
    params
  });
  return data;
};

export const getProductById = async (id) => {
  const { data } = await request({
    url: `/product/${id}`,
    method: 'GET'
  });
  return data;
};
