import { signUpSchema, signInSchema, createMovieSchema } from '@/lib/validations';

describe('Validation Schemas', () => {
  describe('signUpSchema', () => {
    it('should validate correct sign up data', () => {
      const validData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = signUpSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject short full name', () => {
      const invalidData = {
        fullName: 'Jo',
        email: 'john@example.com',
        password: 'password123',
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        fullName: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'short',
      };

      const result = signUpSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('signInSchema', () => {
    it('should validate correct sign in data', () => {
      const validData = {
        email: 'john@example.com',
        password: 'password123',
      };

      const result = signInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'john@example.com',
        password: 'short',
      };

      const result = signInSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe('createMovieSchema', () => {
    it('should validate correct movie data', () => {
      const validData = {
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        rating: 4.5,
        description: 'A test movie description that is long enough',
        coverColor: '#FF5733',
        coverUrl: 'https://example.com/image.jpg',
        summary: 'A test movie summary that is long enough',
      };

      const result = createMovieSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid cover color format', () => {
      const invalidData = {
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        rating: 4.5,
        description: 'A test movie description that is long enough',
        coverColor: 'FF5733', // missing #
        coverUrl: 'https://example.com/image.jpg',
        summary: 'A test movie summary that is long enough',
      };

      const result = createMovieSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid url', () => {
      const invalidData = {
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        rating: 4.5,
        description: 'A test movie description that is long enough',
        coverColor: '#FF5733',
        coverUrl: 'not-a-url',
        summary: 'A test movie summary that is long enough',
      };

      const result = createMovieSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject rating outside 1-5 range', () => {
      const invalidData = {
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        rating: 6, // out of range
        description: 'A test movie description that is long enough',
        coverColor: '#FF5733',
        coverUrl: 'https://example.com/image.jpg',
        summary: 'A test movie summary that is long enough',
      };

      const result = createMovieSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

