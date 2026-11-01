import { purchaseMovie } from "@/lib/actions/movie";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { purchases } from "@/database/schema";

jest.mock("@/auth", () => ({ auth: jest.fn() }));

jest.mock("@/database/drizzle", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
  },
}));

describe("purchaseMovie", () => {
  const userId = "11111111-1111-4111-8111-111111111111";
  const movieId = "22222222-2222-4222-8222-222222222222";

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { id: userId } });
  });

  const mockMovieLookup = (rows: unknown[]) => {
    const limit = jest.fn().mockResolvedValue(rows);
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    (db.select as jest.Mock).mockReturnValue({ from });
  };

  const mockInsert = (rows: unknown[]) => {
    const returning = jest.fn().mockResolvedValue(rows);
    const onConflictDoNothing = jest.fn().mockReturnValue({ returning });
    const values = jest.fn().mockReturnValue({ onConflictDoNothing });
    (db.insert as jest.Mock).mockReturnValue({ values });
    return { values, onConflictDoNothing, returning };
  };

  it("uses the signed-in user's ID and atomically adds an existing movie", async () => {
    mockMovieLookup([{ id: movieId, title: "Test Movie" }]);
    const insert = mockInsert([{ id: "33333333-3333-4333-8333-333333333333" }]);

    const result = await purchaseMovie(movieId);

    expect(result).toEqual({
      success: true,
      data: { id: "33333333-3333-4333-8333-333333333333" },
    });
    expect(insert.values).toHaveBeenCalledWith(
      expect.objectContaining({ userId, movieId, purchaseStatus: "COMPLETED" })
    );
    expect(insert.onConflictDoNothing).toHaveBeenCalledWith({
      target: [purchases.userId, purchases.movieId],
    });
  });

  it("rejects calls without an authenticated session", async () => {
    (auth as jest.Mock).mockResolvedValue(null);

    const result = await purchaseMovie(movieId);

    expect(result).toEqual({
      success: false,
      error: "You must be signed in to add movies",
    });
    expect(db.select).not.toHaveBeenCalled();
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("rejects invalid movie IDs before querying the database", async () => {
    const result = await purchaseMovie("not-a-uuid");

    expect(result).toEqual({ success: false, error: "Invalid movie" });
    expect(auth).not.toHaveBeenCalled();
    expect(db.select).not.toHaveBeenCalled();
  });

  it("returns an error when the movie does not exist", async () => {
    mockMovieLookup([]);

    const result = await purchaseMovie(movieId);

    expect(result).toEqual({ success: false, error: "Movie not found" });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("treats a uniqueness conflict as an already-owned movie", async () => {
    mockMovieLookup([{ id: movieId, title: "Test Movie" }]);
    mockInsert([]);

    const result = await purchaseMovie(movieId);

    expect(result).toEqual({
      success: false,
      error: "You have already added this movie to your library",
    });
  });

  it("returns a safe error when the database fails", async () => {
    const limit = jest.fn().mockRejectedValue(new Error("Database error"));
    const where = jest.fn().mockReturnValue({ limit });
    const from = jest.fn().mockReturnValue({ where });
    (db.select as jest.Mock).mockReturnValue({ from });

    const result = await purchaseMovie(movieId);

    expect(result).toEqual({
      success: false,
      error: "An error occurred while adding the movie to your library",
    });
  });
});
