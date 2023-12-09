import request from '../axios';

export const login = async (payload) => {
  const { data } = await request({
    url: '/auth/login',
    method: 'POST',
    data: payload
  });
  return data;
};

export const secret = async () => {
  const { data } = await request({
    url: '/auth/me',
    method: 'GET'
  });
  return data;
};
