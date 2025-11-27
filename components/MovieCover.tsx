"use client";

import React from "react";
import { cn } from "@/lib/utils";
import config from "@/config";
import { IKImage } from "imagekitio-react";

type MovieCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<MovieCoverVariant, string> = {
  extraSmall: "movie-cover_extra_small",
  small: "movie-cover_small",
  medium: "movie-cover_medium",
  regular: "movie-cover_regular",
  wide: "movie-cover_wide",
};

interface Props {
  className?: string;
  variant?: MovieCoverVariant;
  coverColor: string;
  coverImage: string;
}

const MovieCover = ({
  className,
  variant = "regular",
  coverColor = "#012B48",
  coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  return (
    <div
      className={cn(
        "relative transition-all duration-300",
        variantStyles[variant],
        className
      )}
    >
      <div
        className="absolute z-10"
        style={{ left: "12%", width: "87.5%", height: "88%" }}
      >
        <IKImage
          path={coverImage}
          urlEndpoint={config.env.imagekit.urlEndpoint}
          alt="Movie cover"
          fill
          className="rounded-sm object-fill"
          loading="lazy"
          lqip={{ active: true }}
        />
      </div>
    </div>
  );
};
export default MovieCover;
