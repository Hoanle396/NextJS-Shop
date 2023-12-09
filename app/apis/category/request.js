import request from '../axios';

export const getCategory = async () => {
  const { data } = await request({
    url: '/category',
    method: 'GET'
  });
  return data;
};

export const getCategoryById = async (id) => {
  const { data } = await request({
    url: `/category/${id}`,
    method: 'GET'
  });
  return data;
};

