"use client";

import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import MovieList from "@/components/MovieList";
import MovieHeroClient from "@/components/MovieHeroClient";

interface Props {
  movies: Movie[];
  userId: string;
}

const MovieSearch = ({ movies, userId }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMovies = useMemo(() => {
    if (!searchQuery.trim()) {
      return movies;
    }

    const query = searchQuery.toLowerCase().trim();
    return movies.filter(
      (movie) =>
        movie.title.toLowerCase().includes(query) ||
        movie.director.toLowerCase().includes(query) ||
        movie.genre.toLowerCase().includes(query)
    );
  }, [movies, searchQuery]);

  const hasResults = filteredMovies.length > 0;
  const heroMovie = hasResults ? filteredMovies[0] : null;
  const otherMovies = hasResults ? filteredMovies.slice(1) : [];
  const listTitle = searchQuery ? "Search Results" : "Latest Movies";

  return (
    <>
      <div className="search">
        <Image
          src="/icons/search-fill.svg"
          alt="search"
          width={20}
          height={20}
          className="object-contain"
        />
        <Input
          type="text"
          placeholder="Search movies by title, director, or genre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      {/* show empty state when no movies exist at all */}
      {movies.length === 0 && (
        <div className="flex items-center justify-center min-h-[40vh] mt-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
              No movies available
            </h2>
            <p className="text-light-100">Check back later for new releases</p>
          </div>
        </div>
      )}

      {/* show no results message when search returns nothing */}
      {movies.length > 0 && searchQuery && !hasResults && (
        <div className="flex items-center justify-center min-h-[40vh] mt-10">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2 text-white">
              No movies found
            </h2>
            <p className="text-light-100">
              Try searching with different keywords
            </p>
          </div>
        </div>
      )}

      {/* show movies (hero + list) when results exist */}
      {movies.length > 0 && hasResults && (
        <>
          {heroMovie && (
            <div className="mt-10">
              <MovieHeroClient {...heroMovie} userId={userId} />
            </div>
          )}
          {otherMovies.length > 0 && (
            <MovieList
              title={listTitle}
              movies={otherMovies}
              containerClassName="mt-28"
            />
          )}
        </>
      )}
    </>
  );
};

export default MovieSearch;
