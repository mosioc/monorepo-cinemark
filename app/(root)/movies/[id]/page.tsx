import React from "react";
import { db } from "@/database/drizzle";
import { movies } from "@/database/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import MovieHero from "@/components/MovieHero";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const id = (await params).id;
  const session = await auth();

  const [movieDetails] = await db
    .select()
    .from(movies)
    .where(eq(movies.id, id))
    .limit(1);

  if (!movieDetails) redirect("/404");

  return (
    <>
      <MovieHero {...movieDetails} userId={session?.user?.id as string} />

      <div className="movie-details">
        <div className="flex-[1.5]">
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>

            <div className="space-y-5 text-xl text-light-100">
              {movieDetails.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
