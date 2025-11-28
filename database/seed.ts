import dummyMovies from "../dummymovies.json";
import { movies } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { randomUUID } from "crypto";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const seed = async () => {
  console.log("Seeding data...");

  try {
    for (const movie of dummyMovies) {
      console.log(`Processing ${movie.title}...`);

      const { id, source, ...movieData } = movie;

      await db.insert(movies).values({
        id: randomUUID(),
        ...movieData,
      });

      console.log(`✅ ${movie.title} seeded successfully!`);
    }

    console.log("🎉 All data seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    process.exit(1);
  }
};

seed();
