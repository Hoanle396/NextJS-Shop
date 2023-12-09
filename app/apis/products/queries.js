import { useQuery } from 'react-query';
import { getProduct, getProductById } from './request';

export const useProduct = (params = {},option) => {
  return useQuery(['/product'], () => getProduct(params), {
    ...option
  });
};
export const useProductById = (id, option = {}) => {
  return useQuery(['/product/{id}', id], () => getProductById(id), {
    ...option
  });
};
