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
  }));

  if (latestMovies.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">No movies available</h2>
          <p className="text-muted-foreground">Check back later for movies!</p>
        </div>
      </div>
    );
  }

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
