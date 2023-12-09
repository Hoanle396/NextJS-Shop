import { useQuery } from 'react-query';
import { getCategory, getCategoryById } from './request';

export const useCategory = (option) => {
  return useQuery(['/category'], () => getCategory(), {
    ...option
  });
};
export const useCategoryById = (id, option = {}) => {
  return useQuery(['/category/{id}', id], () => getCategoryById(id), {
    ...option
  });
};
