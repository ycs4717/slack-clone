import api from '../../lib/api';
import { User } from '../users/user.entity';

export const authRepository = {
  async signup(
    name: string,
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const result = await api.post('/auth/signup', {
      name,
      email,
      password,
    });
    const { user, token } = result.data;
    return { user: new User(user), token };
  },
  async signin(
    email: string,
    password: string
  ): Promise<{ user: User; token: string }> {
    const result = await api.post('/auth/signin', { email, password });
    const { user, token } = result.data;
    return { user: new User(user), token };
  },
  async getCuttentUser(): Promise<User | undefined> {
    const result = await api.get('/auth/me');
    if (result.data == null) return undefined;

    return new User(result.data);
  },
  async checkPasskey(email: string): Promise<number> {
    const result = await api.get('/auth/passkey/status', { params: { email } });
    // server expected to return { status: 0 | 1 }
    return result.data.status;
  },
  async createPasskey(): Promise<void> {
    // Placeholder endpoint - implement WebAuthn registration flow as needed
    await api.post('/auth/passkey/create');
  },
  async skipPasskey(): Promise<void> {
    await api.post('/auth/passkey/skip');
  },
};
