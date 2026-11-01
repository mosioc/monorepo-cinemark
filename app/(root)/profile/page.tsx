import React from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import MovieList from "@/components/MovieList";
import { db } from "@/database/drizzle";
import { movies, purchases } from "@/database/schema";
import { and, desc, eq } from "drizzle-orm";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) redirect("/sign-in");

  const libraryMovies = await db
    .select({
      id: movies.id,
      title: movies.title,
      director: movies.director,
      genre: movies.genre,
      rating: movies.rating,
      description: movies.description,
      coverColor: movies.coverColor,
      coverUrl: movies.coverUrl,
      summary: movies.summary,
      createdAt: movies.createdAt,
      isPurchased: purchases.id,
    })
    .from(purchases)
    .innerJoin(movies, eq(purchases.movieId, movies.id))
    .where(
      and(
        eq(purchases.userId, userId),
        eq(purchases.purchaseStatus, "COMPLETED")
      )
    )
    .orderBy(desc(purchases.purchaseDate));

  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      {libraryMovies.length ? (
        <MovieList
          title="My Library"
          movies={libraryMovies.map((movie) => ({
            ...movie,
            isPurchased: Boolean(movie.isPurchased),
          }))}
        />
      ) : (
        <section className="text-center py-12">
          <h1 className="text-3xl font-bold mb-3">Your library is empty</h1>
          <p className="text-light-100">
            Add a movie from its details page and it will appear here.
          </p>
        </section>
      )}
    </>
  );
};
export default Page;
