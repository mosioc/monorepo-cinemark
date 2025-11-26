import {
  varchar,
  uuid,
  integer,
  text,
  pgTable,
  date,
  pgEnum,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";

// User roles and statuses
export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);
export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  status: STATUS_ENUM("status").default("PENDING"),
  role: ROLE_ENUM("role").default("USER"),
  lastActivityDate: date("last_activity_date").defaultNow(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Movies table
export const movies = pgTable("movies", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  director: varchar("director", { length: 255 }).notNull(),
  genre: text("genre").notNull(),
  rating: integer("rating").notNull(),
  description: text("description").notNull(),
  coverColor: varchar("cover_color", { length: 7 }).notNull(),
  coverUrl: text("cover_url").notNull(),
  videoUrl: text("video_url").notNull(),
  summary: varchar("summary").notNull(),
  isPurchased: boolean("is_purchased").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Purchases table
export const purchases = pgTable("purchases", {
  id: uuid("id").notNull().primaryKey().defaultRandom().unique(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  movieId: uuid("movie_id")
    .references(() => movies.id)
    .notNull(),
  purchaseDate: timestamp("purchase_date", { withTimezone: true })
    .defaultNow()
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
