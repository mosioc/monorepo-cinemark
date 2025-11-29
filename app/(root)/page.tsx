import { db } from "@/database/drizzle";
import { movies } from "@/database/schema";
import { auth } from "@/auth";
import { desc } from "drizzle-orm";
import MovieSearch from "@/components/MovieSearch";

const Home = async () => {
  const session = await auth();
  const latestMoviesRaw = await db
    .select()
    .from(movies)
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
    <MovieSearch
      movies={latestMovies}
      userId={session?.user?.id as string}
    />
  );
};

export default Home;
