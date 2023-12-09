import { useQuery } from 'react-query';
import { getDiscount } from './request';

export const useDiscountWork = (option) => {
  return useQuery(['/discount'], () => getDiscount(), {
    ...option
  });
};