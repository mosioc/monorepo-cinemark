import { z } from "zod";

export const signUpSchema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const movieSchema = z.object({
  id: z.string().uuid(), // assuming IDs are UUIDs
  title: z.string().trim().min(2).max(100),
  director: z.string().trim().min(2).max(100),
  genre: z.string().trim().min(2).max(50),
  rating: z.coerce.number().min(1).max(5),
  description: z.string().trim().min(10).max(1000),
  coverColor: z
    .string()
    .trim()
    .regex(/^#[0-9A-F]{6}$/i),
  coverUrl: z.string().url(),
  videoUrl: z.string().url(),
  summary: z.string().trim().min(10),
  isPurchased: z.boolean(),
  createdAt: z
    .union([z.date(), z.null()])
    .refine((val) => val === null || val instanceof Date, {
      message: "Invalid date",
    }),
});
