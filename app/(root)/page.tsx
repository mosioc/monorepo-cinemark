import { db } from "@/database/drizzle";
import { movies, users } from "@/database/schema";
import MovieList from "@/components/MovieList";
import MovieHero from "@/components/MovieHero";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";

const Home = async () => {
  const session = await auth();

  const latestMoviesRaw = await db
    .select()
    .from(movies)
    .limit(10)
    .orderBy(desc(movies.createdAt));

  const latestMovies: Movie[] = latestMoviesRaw.map((movie) => ({
    ...movie,
    rating: parseFloat(movie.rating),
  }));

  return (
    <>
      <MovieHero {...latestMovies[0]} userId={session?.user?.id as string} />
      <MovieList
        title="Latest Movies"
        movies={latestMovies.slice(1)}
        containerClassName="mt-28"
      />
    </>
  );
};

export default Home;
