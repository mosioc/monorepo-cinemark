"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
// import { toast } from "@/hooks/use-toast";

interface Props {
  userId: string;
  movieId: string;
}

const MovieBuy = ({ userId, movieId }: Props) => {
  const router = useRouter();
  const [buying, setBuying] = useState(false);

  const handleBuyMovie = async () => {
    setBuying(true);

    // try {
    //   const result = await buyMovie({ movieId, userId });

    //   if (result.success) {
    //     toast({
    //       title: "Success",
    //       description: "Movie purchased.",
    //     });

    //     router.push("/");
    //   } else {
    //     toast({
    //       title: "Error",
    //       description: result.error,
    //       variant: "destructive",
    //     });
    //   }
    // } catch (error) {
    //   toast({
    //     title: "Error",
    //     description: "An error occurred while purchasing the movie",
    //     variant: "destructive",
    //   });
    // } finally {
    //   setBuying(false);
    // }
  };

  return (
    <Button
      className="movie-overview_btn"
      onClick={handleBuyMovie}
      disabled={buying}
    >
      <Image src="/icons/movie.svg" alt="movie" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">
        {buying ? "Buying ..." : "Buy Movie"}
      </p>
    </Button>
  );
};
export default MovieBuy;
