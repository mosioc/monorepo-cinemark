ALTER TABLE "movies" ALTER COLUMN "video_url" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "movies" DROP COLUMN "video_url";
