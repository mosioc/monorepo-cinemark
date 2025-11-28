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
  const heroMovie = filteredMovies[0];
  const otherMovies = filteredMovies.slice(1);

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

      {!searchQuery && hasResults && (
        <>
          {heroMovie && (
            <div className="mt-10">
              <MovieHeroClient {...heroMovie} userId={userId} />
            </div>
          )}
          {otherMovies.length > 0 && (
            <MovieList
              title="Latest Movies"
              movies={otherMovies}
              containerClassName="mt-28"
            />
          )}
        </>
      )}

      {searchQuery && !hasResults && (
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

      {searchQuery && hasResults && (
        <>
          {heroMovie && (
            <div className="mt-10">
              <MovieHeroClient {...heroMovie} userId={userId} />
            </div>
          )}
          {otherMovies.length > 0 && (
            <MovieList
              title="Search Results"
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

