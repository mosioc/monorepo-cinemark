"use server";

import { db } from "@/database/drizzle";
import { movies, purchases } from "@/database/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { z } from "zod";

const DUPLICATE_PURCHASE_ERROR =
  "You have already added this movie to your library";

export const purchaseMovie = async (movieId: string) => {
  const parsedMovieId = z.string().uuid().safeParse(movieId);
  if (!parsedMovieId.success) {
    return { success: false, error: "Invalid movie" };
  }

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, error: "You must be signed in to add movies" };
  }

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

    const [record] = await db
      .insert(purchases)
      .values({
        userId,
        movieId,
        price: "0",
        currency: "USD",
        purchaseStatus: "COMPLETED",
      })
      .onConflictDoNothing({
        target: [purchases.userId, purchases.movieId],
      })
      .returning({ id: purchases.id });

    if (!record) {
      return { success: false, error: DUPLICATE_PURCHASE_ERROR };
    }

    return {
      success: true,
      data: record,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while adding the movie to your library",
    };
  }
};
