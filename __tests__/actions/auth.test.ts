import { signUp, signInWithCredentials } from '@/lib/actions/auth';
import { db } from '@/database/drizzle';
import { users } from '@/database/schema';
import { signIn } from '@/auth';
import ratelimit from '@/lib/ratelimit';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { workflowClient } from '@/lib/workflow';
import { hash } from 'bcryptjs';

// mock dependencies
jest.mock('@/database/drizzle', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

jest.mock('@/auth', () => ({
  signIn: jest.fn(),
  signOut: jest.fn(),
  auth: jest.fn(),
}));

jest.mock('@/lib/ratelimit', () => ({
  __esModule: true,
  default: {
    limit: jest.fn(),
  },
}));

jest.mock('next/headers', () => ({
  headers: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

jest.mock('@/lib/workflow', () => ({
  workflowClient: {
    trigger: jest.fn(),
  },
}));

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('Auth Server Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (headers as jest.Mock).mockResolvedValue({
      get: jest.fn().mockReturnValue('127.0.0.1'),
    });
    (ratelimit.limit as jest.Mock).mockResolvedValue({ success: true });
  });

  describe('signUp', () => {
    const mockUserData = {
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    it('should create user successfully', async () => {
      // mock database: no existing user
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([]),
          }),
        }),
      });
      (db.select as jest.Mock).mockReturnValue(mockSelect());

      // mock database: insert user
      const mockInsert = jest.fn().mockReturnValue({
        values: jest.fn().mockResolvedValue([]),
      });
      (db.insert as jest.Mock).mockReturnValue(mockInsert());

      // mock hash
      (hash as jest.Mock).mockResolvedValue('hashed-password');

      // mock workflow
      (workflowClient.trigger as jest.Mock).mockResolvedValue({});

      // mock sign in after sign up
      (signIn as jest.Mock).mockResolvedValue({ error: null });

      const result = await signUp(mockUserData);

      expect(result.success).toBe(true);
      expect(db.insert).toHaveBeenCalled();
      expect(workflowClient.trigger).toHaveBeenCalled();
    });

    it('should reject duplicate user', async () => {
      // mock database: user exists
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue([{ id: '1', email: 'test@example.com' }]),
          }),
        }),
      });
      (db.select as jest.Mock).mockReturnValue(mockSelect());

      const result = await signUp(mockUserData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('User already exists.');
      expect(db.insert).not.toHaveBeenCalled();
    });

    it('should handle rate limiting', async () => {
      (ratelimit.limit as jest.Mock).mockResolvedValue({ success: false });

      const result = await signUp(mockUserData);

      expect(redirect).toHaveBeenCalledWith('/too-fast');
    });

    it('should handle errors during sign up', async () => {
      const mockSelect = jest.fn().mockReturnValue({
        from: jest.fn().mockReturnValue({
          where: jest.fn().mockReturnValue({
            limit: jest.fn().mockRejectedValue(new Error('Database error')),
          }),
        }),
      });
      (db.select as jest.Mock).mockReturnValue(mockSelect());

      const result = await signUp(mockUserData);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Something went wrong during sign up.');
    });
  });

  describe('signInWithCredentials', () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should sign in successfully', async () => {
      (signIn as jest.Mock).mockResolvedValue({ error: null });

      const result = await signInWithCredentials(mockCredentials);

      expect(result.success).toBe(true);
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: mockCredentials.email,
        password: mockCredentials.password,
        redirect: false,
      });
    });

    it('should handle sign in error', async () => {
      (signIn as jest.Mock).mockResolvedValue({ error: 'Invalid credentials' });

      const result = await signInWithCredentials(mockCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid credentials');
    });

    it('should handle rate limiting', async () => {
      (ratelimit.limit as jest.Mock).mockResolvedValue({ success: false });

      await signInWithCredentials(mockCredentials);

      expect(redirect).toHaveBeenCalledWith('/too-fast');
    });

    it('should handle unexpected errors', async () => {
      (signIn as jest.Mock).mockRejectedValue(new Error('Unexpected error'));

      const result = await signInWithCredentials(mockCredentials);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Something went wrong during sign in.');
    });
  });
});

