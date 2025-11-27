import React from "react";
import MovieCard from "@/components/MovieCard";

interface Props {
  title: string;
  movies: Movie[];
  containerClassName?: string;
}

const MovieList = ({ title, movies, containerClassName }: Props) => {
  if (movies.length < 2) return;

  return (
    <section className={containerClassName}>
      <h2 className="font-bebas-neue text-4xl text-light-100">{title}</h2>

      <ul className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.title} {...movie} />
        ))}
      </ul>
    </section>
  );
};
export default MovieList;
