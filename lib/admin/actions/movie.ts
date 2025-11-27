"use server";

import { movies } from "@/database/schema";
import { db } from "@/database/drizzle";

export const createMovie = async (params: MovieParams) => {
  try {
    const newMovie = await db
      .insert(movies)
      .values({
        ...params,
        rating: params.rating.toString(), 
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newMovie[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating movie",
    };
  }
};
