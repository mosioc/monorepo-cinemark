import { purchaseMovie } from '@/lib/actions/movie';
import { db } from '@/database/drizzle';
import { movies, purchases } from '@/database/schema';

// mock database
jest.mock('@/database/drizzle', () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

describe('Movie Purchase Server Action', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockParams = {
    userId: 'user-123',
    movieId: 'movie-456',
  };

  it('should purchase movie successfully', async () => {
    // mock movie exists
    const mockMovieSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 'movie-456', title: 'Test Movie' }]),
        }),
      }),
    });

    // mock no existing purchase
    const mockPurchaseSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]),
        }),
      }),
    });

    // mock insert purchase
    const mockInsert = jest.fn().mockReturnValue({
      values: jest.fn().mockResolvedValue([{ id: 'purchase-123' }]),
    });

    (db.select as jest.Mock)
      .mockReturnValueOnce(mockMovieSelect()) // first call for movie
      .mockReturnValueOnce(mockPurchaseSelect()); // second call for purchase

    (db.insert as jest.Mock).mockReturnValue(mockInsert());

    const result = await purchaseMovie(mockParams);

    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(db.insert).toHaveBeenCalled();
  });

  it('should reject purchase when movie not found', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([]), // no movie found
        }),
      }),
    });

    (db.select as jest.Mock).mockReturnValue(mockSelect());

    const result = await purchaseMovie(mockParams);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Movie not found');
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('should reject duplicate purchase', async () => {
    // mock movie exists
    const mockMovieSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 'movie-456', title: 'Test Movie' }]),
        }),
      }),
    });

    // mock existing purchase
    const mockPurchaseSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue([{ id: 'purchase-123' }]), // purchase exists
        }),
      }),
    });

    (db.select as jest.Mock)
      .mockReturnValueOnce(mockMovieSelect())
      .mockReturnValueOnce(mockPurchaseSelect());

    const result = await purchaseMovie(mockParams);

    expect(result.success).toBe(false);
    expect(result.error).toBe('You have already added this movie to your library');
    expect(db.insert).not.toHaveBeenCalled();
  });

  it('should handle database errors', async () => {
    const mockSelect = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(new Error('Database error')),
        }),
      }),
    });

    (db.select as jest.Mock).mockReturnValue(mockSelect());

    const result = await purchaseMovie(mockParams);

    expect(result.success).toBe(false);
    expect(result.error).toBe('An error occurred while adding the movie to your library');
  });
});

