"use client";

type MovieCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

const variantStyles: Record<MovieCoverVariant, string> = {
  extraSmall: "book-cover_extra_small",
  small: "book-cover_small",
  medium: "book-cover_medium",
  regular: "book-cover_regular",
  wide: "book-cover_wide",
};

interface Props {
  className?: string;
  variant?: MovieCoverVariant;
  coverColor: string;
  coverImage: string;
}

const MovieCover = ({
  // className,
  // variant = "regular",
  // coverColor = "#012B48",
  // coverImage = "https://placehold.co/400x600.png",
}: Props) => {
  return (
    <div
      // className={cn(
      //   "relative transition-all duration-300",
      //   variantStyles[variant],
      //   className
      // )}
    ></div>
  );
};
export default MovieCover;
