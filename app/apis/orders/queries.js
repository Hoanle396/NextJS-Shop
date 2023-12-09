import { useQuery } from 'react-query';
import { getOrderById, getOrders } from './request';

export const useOrders = (option) => {
  return useQuery(['/orders'], () => getOrders(), {
    ...option
  });
};
export const useOrderById = (id, option = {}) => {
  return useQuery(['/order/{id}', id], () => getOrderById(id), {
    ...option
  });
};
