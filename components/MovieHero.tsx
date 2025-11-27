import React from "react";
import Image from "next/image";
import MovieCover from "@/components/MovieCover";
import MovieBuy from "@/components/MovieBuy";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

interface Props extends Movie {
  userId: string;
}
const MovieHero = async ({
  title,
  director,
  genre,
  rating,
  description,
  coverColor,
  coverUrl,
  id,
  userId,
}: Props) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return (
    <section className="movie-overview">
      <div className="flex flex-1 flex-col gap-5">
        <h1>{title}</h1>

        <div className="movie-info">
          <p>
            By <span className="font-semibold text-light-200">{director}</span>
          </p>

          <p>
            Category{" "}
            <span className="font-semibold text-light-200">{genre}</span>
          </p>

          <div className="flex flex-row gap-1">
            <Image src="/icons/star.svg" alt="star" width={22} height={22} />
            <p>{rating}</p>
          </div>
        </div>

        
        <p className="movie-description">{description}</p>

        {user && <MovieBuy movieId={id} userId={userId} />}
      </div>

      <div className="relative flex flex-1 justify-center">
        <div className="relative">
          <MovieCover
            variant="wide"
            className="z-10"
            coverColor={coverColor}
            coverImage={coverUrl}
          />

          <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
            <MovieCover
              variant="wide"
              coverColor={coverColor}
              coverImage={coverUrl}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MovieHero;
