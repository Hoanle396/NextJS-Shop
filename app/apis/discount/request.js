import request from '../axios';



export const getDiscount = async () => {
  const { data } = await request({
    url: '/discount/work',
    method: 'GET'
  });
  return data;
};

export const getDiscountById = async (id) => {
  const { data } = await request({
    url: `/discount/${id}`,
    method: 'GET'
  });
  return data;
};

