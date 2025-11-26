import React from "react";
import { redirect } from "next/navigation";
import MovieHero from "@/components/MovieHero";

const Page = () => {
  return (
    <>
      <MovieHero />

      <div className="movie-details">
        <div className="flex-[1.5]">
          <section className="mt-10 flex flex-col gap-7">
            <h3>Summary</h3>

            {/* <div className="space-y-5 text-xl text-light-100">
              {params.summary.split("\n").map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div> */}
          </section>
        </div>
      </div>
    </>
  );
};
export default Page;
