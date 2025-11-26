import React from "react";
import Link from "next/link";
import MovieCover from "@/components/MovieCover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "@/components/ui/button";

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
          <div className="purchased-movie">
            <Image
              src="/icons/calendar.svg"
              alt="calendar"
              width={18}
              height={18}
              className="object-contain"
            />
            <p className="text-light-100">11 days left to return</p>
          </div>

          <Button className="movie-btn">Download receipt</Button>
        </div>
      )}
    </Link>
  </li>
);

export default MovieCard;
