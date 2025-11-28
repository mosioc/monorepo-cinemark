"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { purchaseMovie } from "@/lib/actions/movie";

interface Props {
  userId: string;
  movieId: string;
}

const MovieBuy = ({ userId, movieId }: Props) => {
  const router = useRouter();
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleAddToLibrary = async () => {
    setAdding(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await purchaseMovie({ movieId, userId });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.refresh();
        }, 1500);
      } else {
        setError(result.error || "Failed to add movie to library");
      }
    } catch (error) {
      setError("An error occurred while adding the movie");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div>
      <Button
        className="movie-overview_btn"
        onClick={handleAddToLibrary}
        disabled={adding || success}
      >
        <Image src="/icons/movie.svg" alt="add to library" width={20} height={20} />
        <p className="font-bebas-neue text-xl text-dark-100">
          {adding ? "Adding ..." : success ? "Added to Library!" : "Add Movie to My Library"}
        </p>
      </Button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-500 mt-2">Movie added successfully!</p>}
    </div>
  );
};

export default MovieBuy;
