import Page from "@/app/(root)/profile/page";
import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { purchases } from "@/database/schema";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
  signOut: jest.fn(),
}));

jest.mock("@/database/drizzle", () => ({
  db: { select: jest.fn() },
}));

jest.mock("@/components/MovieList", () => ({
  __esModule: true,
  default: jest.fn(() => null),
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("drizzle-orm", () => ({
  and: jest.fn((...conditions) => conditions),
  desc: jest.fn((column) => column),
  eq: jest.fn((column, value) => ({ column, value })),
}));

describe("Profile library page", () => {
  const userId = "11111111-1111-4111-8111-111111111111";
  const ownedMovie = {
    id: "22222222-2222-4222-8222-222222222222",
    title: "Owned Movie",
    director: "Test Director",
    genre: "Drama",
    rating: "4.2",
    description: "A movie in the user's library.",
    coverColor: "#000000",
    coverUrl: "https://example.com/cover.jpg",
    summary: "A test summary.",
    createdAt: new Date("2025-01-01"),
    isPurchased: "purchase-id",
  };

  const configureLibraryQuery = (rows: unknown[]) => {
    const orderBy = jest.fn().mockResolvedValue(rows);
    const where = jest.fn().mockReturnValue({ orderBy });
    const innerJoin = jest.fn().mockReturnValue({ where });
    const from = jest.fn().mockReturnValue({ innerJoin });
    (db.select as jest.Mock).mockReturnValue({ from });
    return { where };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (auth as jest.Mock).mockResolvedValue({ user: { id: userId } });
  });

  it("loads only completed purchases for the signed-in user", async () => {
    const { where } = configureLibraryQuery([ownedMovie]);

    const page = await Page();
    const librarySection = (page as any).props.children[1];

    expect(librarySection.props.title).toBe("My Library");
    expect(librarySection.props.movies).toEqual([
      { ...ownedMovie, isPurchased: true },
    ]);
    expect(where).toHaveBeenCalledWith([
      { column: purchases.userId, value: userId },
      { column: purchases.purchaseStatus, value: "COMPLETED" },
    ]);
  });

  it("shows a helpful empty state when the user has no purchases", async () => {
    configureLibraryQuery([]);

    const page = await Page();
    const emptyState = (page as any).props.children[1];

    expect(emptyState.type).toBe("section");
    expect(emptyState.props.children[0].props.children).toBe(
      "Your library is empty"
    );
  });
});
