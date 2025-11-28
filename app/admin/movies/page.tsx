import React from "react";
import { db } from "@/database/drizzle";
import { movies } from "@/database/schema";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const MoviesPage = async () => {
  const allMovies = await db.select().from(movies);

  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Movies</h2>
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/movies/new" className="text-white">
            + Create a New Movie
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        {allMovies.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No movies found. Create one to get started!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">Title</th>
                  <th className="text-left py-3 px-4 font-semibold">Director</th>
                  <th className="text-left py-3 px-4 font-semibold">Genre</th>
                  <th className="text-left py-3 px-4 font-semibold">Rating</th>
                  <th className="text-left py-3 px-4 font-semibold">Created At</th>
                </tr>
              </thead>
              <tbody>
                {allMovies.map((movie) => (
                  <tr key={movie.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{movie.title}</td>
                    <td className="py-3 px-4">{movie.director}</td>
                    <td className="py-3 px-4">{movie.genre}</td>
                    <td className="py-3 px-4">{movie.rating}</td>
                    <td className="py-3 px-4">
                      {movie.createdAt
                        ? new Date(movie.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
};

export default MoviesPage;

