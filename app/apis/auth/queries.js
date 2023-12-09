import { useQuery } from 'react-query';
import { secret } from './request';

export const useUser = (option = {}) => {
  const { data, ...rest } = useQuery(['/me'], secret, {
    ...option
  });
  return { user: data, ...rest, isLogin: !!data };
};
