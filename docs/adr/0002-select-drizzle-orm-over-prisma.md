# ADR-0002: Select Drizzle ORM over Prisma for Serverless PostgreSQL

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki  

## Context

We need a type-safe Object-Relational Mapper (ORM) for our PostgreSQL database. The application is deployed on Vercel (serverless), meaning cold starts and bundle sizes directly impact latency and costs.

## Decision

We will use **Drizzle ORM** with the `@neondatabase/serverless` driver, targeting **Neon Postgres**. Migrations will be managed via **Drizzle Kit**.

## Alternatives Considered

- **Prisma:** Rejected. Prisma relies on a heavy Rust-based query engine that must be loaded into memory. In a serverless environment, this causes significant cold-start latency (often 500ms+). Furthermore, Prisma's "magic" query builder obscures the underlying SQL, making complex query debugging difficult.
- **Kysely:** Considered. Kysely is an excellent, lightweight SQL query builder. However, it lacks built-in schema definition and migration tooling, which would require us to maintain raw SQL migration files manually.

## Consequences

### Positive

- **Serverless Optimized:** Drizzle has zero runtime overhead and a tiny bundle size, resulting in near-instant cold starts on Vercel.
- **SQL Transparency:** Drizzle's API closely mirrors SQL. If a query is slow, we know exactly what SQL is being generated.
- **Type Safety:** Infers TypeScript types directly from the schema without a separate generation step.

### Negative & Risks

- **Manual Relationship Resolution:** Unlike Prisma's `include` or `select` nested queries, Drizzle requires explicit `leftJoin` or `relation` calls. This increases boilerplate for complex nested data fetching.
- **Smaller Ecosystem:** Fewer third-party integrations (e.g., admin panels) compared to Prisma.
- **Mitigation:** We accept the boilerplate of explicit joins in exchange for performance. We use Drizzle Studio locally for database inspection.
