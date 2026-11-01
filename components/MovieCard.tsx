import React from "react";
import Link from "next/link";
import MovieCover from "@/components/MovieCover";
import { cn } from "@/lib/utils";

const MovieCard = ({
  id,
  title,
  genre,
  coverColor,
  coverUrl,
  isPurchased = false,
}: Movie) => (
  <li className={cn(isPurchased && "xs:w-52 w-full")}>
    <Link
      href={`/movies/${id}`}
      className={cn(isPurchased && "w-full flex flex-col items-center")}
    >
      <MovieCover coverColor={coverColor} coverImage={coverUrl} />

      <div className={cn("mt-4", !isPurchased && "xs:max-w-40 max-w-28")}>
        <p className="movie-title">{title}</p>
        <p className="movie-genre">{genre}</p>
      </div>

      {isPurchased && (
        <div className="mt-3 w-full">
          <p className="purchased-movie text-light-100">In your library</p>
        </div>
      )}
    </Link>
  </li>
);

export default MovieCard;
