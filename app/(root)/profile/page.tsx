import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "@/auth";
import MovieList from "@/components/MovieList";
import { sampleMovies } from "@/constants";

const Page = () => {
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <MovieList title="Borrowed Books" movies={sampleMovies} />
    </>
  );
};
export default Page;
