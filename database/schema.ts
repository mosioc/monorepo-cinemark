import {
  varchar,
  uuid,
  numeric,
  text,
  pgTable,
  timestamp,
  pgEnum,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

// Enums
export const STATUS_ENUM = pgEnum("status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const ROLE_ENUM = pgEnum("role", ["USER", "ADMIN"]);
export const PURCHASE_STATUS_ENUM = pgEnum("purchase_status", [
  "PENDING",
  "COMPLETED",
  "REFUNDED",
]);

// Users table
export const users = pgTable(
  "users",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    status: STATUS_ENUM("status").default("PENDING"),
    role: ROLE_ENUM("role").default("USER"),
    lastActivityDate: timestamp("last_activity_date", {
      withTimezone: true,
    }).defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("users_email_unique").on(table.email),
  })
);

// Movies table
export const movies = pgTable("movies", {
  id: uuid("id").notNull().primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  director: varchar("director", { length: 255 }).notNull(),
  genre: text("genre").notNull(),
  rating: numeric("rating", { precision: 3, scale: 1 }).notNull(),
  description: text("description").notNull(),
  coverColor: varchar("cover_color", { length: 7 }).notNull(),
  coverUrl: text("cover_url").notNull(),
  videoUrl: text("video_url").notNull(),
  summary: varchar("summary").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

// Purchases table
export const purchases = pgTable(
  "purchases",
  {
    id: uuid("id").notNull().primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    movieId: uuid("movie_id")
      .notNull()
      .references(() => movies.id),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("USD"),
    purchaseStatus:
      PURCHASE_STATUS_ENUM("purchase_status").default("COMPLETED"),
    purchaseDate: timestamp("purchase_date", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    userMovieUnique: uniqueIndex("purchases_user_movie_unique").on(
      table.userId,
      table.movieId
    ),
    idxUser: index("purchases_user_idx").on(table.userId),
    idxMovie: index("purchases_movie_idx").on(table.movieId),
  })
);
