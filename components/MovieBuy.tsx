"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { purchaseMovie } from "@/lib/actions/movie";

interface Props {
  userId: string;
  movieId: string;
  price: string;
}

const MovieBuy = ({ userId, movieId, price }: Props) => {
  const router = useRouter();
  const [purchasing, setPurchasing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePurchaseMovie = async () => {
    setPurchasing(true);
    setError(null);

    try {
      const result = await purchaseMovie({ movieId, userId, price });

      if (result.success) {
        alert("Movie purchased successfully!");
        router.push("/");
      } else {
        setError(result.error || "Failed to purchase movie");
      }
    } catch (error) {
      setError("An error occurred while purchasing the movie");
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <div>
      <Button
        className="movie-overview_btn"
        onClick={handlePurchaseMovie}
        disabled={purchasing}
      >
        <Image src="/icons/movie.svg" alt="purchase" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {purchasing ? "Purchasing ..." : "Purchase Movie"}
        </p>
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default MovieBuy;
