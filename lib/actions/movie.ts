"use server";

import { db } from "@/database/drizzle";
import { movies, purchases } from "@/database/schema";
import { eq, and } from "drizzle-orm";

interface PurchaseMovieParams {
  userId: string;
  movieId: string;
}

export const purchaseMovie = async (params: PurchaseMovieParams) => {
  const { userId, movieId } = params;

  try {
    const movie = await db
      .select({ id: movies.id, title: movies.title })
      .from(movies)
      .where(eq(movies.id, movieId))
      .limit(1);

    if (!movie.length) {
      return {
        success: false,
        error: "Movie not found",
      };
    }

    const existingPurchase = await db
      .select()
      .from(purchases)
      .where(and(eq(purchases.userId, userId), eq(purchases.movieId, movieId)))
      .limit(1);

    if (existingPurchase.length > 0) {
      return {
        success: false,
        error: "You have already added this movie to your library",
      };
    }

    const record = await db.insert(purchases).values({
      userId,
      movieId,
      price: "0",
      currency: "USD",
      purchaseStatus: "COMPLETED",
    });

    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while adding the movie to your library",
    };
  }
};
