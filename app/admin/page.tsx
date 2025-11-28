import React from "react";
import { db } from "@/database/drizzle";
import { movies, users, purchases } from "@/database/schema";
import { count, sql, desc, eq } from "drizzle-orm";
import Link from "next/link";

const Page = async () => {
  const [moviesCount, usersCount, purchasesCount, totalRevenue, recentMovies, recentUsers] = await Promise.all([
    db.select({ count: count() }).from(movies),
    db.select({ count: count() }).from(users),
    db.select({ count: count() }).from(purchases),
    db
      .select({
        total: sql<number>`COALESCE(SUM(${purchases.price}), 0)`,
      })
      .from(purchases)
      .where(eq(purchases.purchaseStatus, "COMPLETED")),
    db
      .select({
        id: movies.id,
        title: movies.title,
        createdAt: movies.createdAt,
      })
      .from(movies)
      .orderBy(desc(movies.createdAt))
      .limit(5),
    db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(5),
  ]);

  const stats = {
    movies: moviesCount[0]?.count || 0,
    users: usersCount[0]?.count || 0,
    purchases: purchasesCount[0]?.count || 0,
    revenue: Number(totalRevenue[0]?.total || 0),
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Total Movies</p>
          </div>
          <p className="stat-count">{stats.movies}</p>
        </div>

        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Total Users</p>
          </div>
          <p className="stat-count">{stats.users}</p>
        </div>

        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Total Purchases</p>
          </div>
          <p className="stat-count">{stats.purchases}</p>
        </div>

        <div className="stat">
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
          </div>
          <p className="stat-count">{formatCurrency(stats.revenue)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="w-full rounded-2xl bg-white p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-dark-400">Recent Movies</h2>
            <Link
              href="/admin/movies"
              className="text-sm text-primary-admin hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentMovies.length === 0 ? (
              <p className="text-sm text-dark-400">No movies yet</p>
            ) : (
              recentMovies.map((movie) => (
                <div key={movie.id} className="movie-stripe">
                  <div className="flex-1">
                    <p className="title">{movie.title}</p>
                    <div className="author">
                      <p>{formatDate(movie.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="w-full rounded-2xl bg-white p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-dark-400">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-primary-admin hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-sm text-dark-400">No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div key={user.id} className="movie-stripe">
                  <div className="flex-1">
                    <p className="title">{user.fullName}</p>
                    <div className="author">
                      <p>{user.email}</p>
                      <div></div>
                      <p>{formatDate(user.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
