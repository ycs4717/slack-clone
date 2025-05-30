import api from '../../lib/api';
import { User } from './user.entity';

export const userRepository = {
  async find(keyword: string): Promise<User[]> {
    const result = await api.get('/users', { params: { keyword } });
    return result.data.map((user: User) => new User(user));
  },
};
