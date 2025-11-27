import dummyMovies from "../dummymovies.json";
import ImageKit from "imagekit";
import { movies } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import { randomUUID } from "crypto";

config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

const uploadToImageKit = async (
  url: string,
  fileName: string,
  folder: string
) => {
  try {
    const response = await imagekit.upload({
      file: url,
      fileName,
      folder,
    });

    return response.filePath;
  } catch (error) {
    console.error("Error uploading image to ImageKit:", error);
    throw error; // Re-throw to handle in seed function
  }
};

const seed = async () => {
  console.log("Seeding data...");

  try {
    for (const movie of dummyMovies) {
      console.log(`Processing ${movie.title}...`);

      const coverUrl = await uploadToImageKit(
        movie.coverUrl,
        `${movie.title}.jpg`,
        "/movies/covers"
      );

      const videoUrl = await uploadToImageKit(
        movie.videoUrl,
        `${movie.title}.mp4`,
        "/movies/videos"
      );

      const { id, source, ...movieData } = movie;

      await db.insert(movies).values({
        id: randomUUID(),
        ...movieData,
        coverUrl: coverUrl!,
        videoUrl: videoUrl!,
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
