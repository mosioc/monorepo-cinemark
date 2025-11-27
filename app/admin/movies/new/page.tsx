import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import MovieForm from "@/components/admin/forms/MovieForm";

const Page = () => {
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/movies">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <MovieForm />
      </section>
    </>
  );
};
export default Page;
