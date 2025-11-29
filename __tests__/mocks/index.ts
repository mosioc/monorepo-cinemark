// shared mocks for database, auth, redis, etc.

export const mockDb = {
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  orderBy: jest.fn().mockReturnThis(),
  returning: jest.fn().mockResolvedValue([]),
};

export const mockRatelimit = {
  limit: jest.fn().mockResolvedValue({ success: true }),
};

export const mockSignIn = jest.fn().mockResolvedValue({ error: null });
export const mockSignOut = jest.fn();
export const mockAuth = jest.fn();

export const mockHeaders = jest.fn().mockResolvedValue({
  get: jest.fn().mockReturnValue('127.0.0.1'),
});

export const mockWorkflowClient = {
  trigger: jest.fn().mockResolvedValue({}),
};

