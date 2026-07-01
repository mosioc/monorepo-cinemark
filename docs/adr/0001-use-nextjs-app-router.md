# ADR-0001: Adopt Server-First Architecture with Next.js 16 App Router

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki  
**Deciders:** Mehdi Maleki  

## Context

Cinemark requires a full-stack architecture that delivers high SEO performance, minimizes client-side JavaScript, and reduces the operational overhead of maintaining separate frontend and backend repositories. As a solo developer, minimizing boilerplate and context-switching is critical.

## Decision

We will use **Next.js 16 (App Router)** with a **Server-First** rendering strategy.

1. **React Server Components (RSC)** are the default for all data-fetching and UI rendering (e.g., `MovieHero`, `Admin Dashboard`).
2. **Client Components** (`"use client"`) are strictly isolated to interactive boundaries (e.g., `AuthForm`, `MovieSearch`, `MovieBuy`).
3. **Server Actions** (`"use server"`) replace traditional REST API routes for all internal data mutations (e.g., `purchaseMovie`, `signUp`).

## Alternatives Considered

- **Next.js Pages Router:** Rejected. Lacks native RSC support, resulting in larger client bundles and requiring verbose data-fetching methods (`getServerSideProps`).
- **Remix:** Rejected. While excellent for data loading, its ecosystem is smaller, and it lacks the native, deep integration with Vercel's edge/serverless infrastructure that Next.js provides.
- **Traditional SPA + Separate API (e.g., React + Express):** Rejected. Doubles the deployment footprint, requires managing CORS, and increases context-switching for a solo developer.

## Consequences

### Positive

- **Zero API Boilerplate:** Server Actions eliminate the need to write, secure, and type separate API endpoints for internal mutations.
- **Optimized Payloads:** RSC ensures that heavy dependencies (like `drizzle-orm` or `bcryptjs`) are never bundled to the client.
- **SEO & LCP:** Server-rendered HTML provides immediate content for crawlers and improves Largest Contentful Paint.

### Negative & Risks

- **"use client" Boundary Confusion:** Developers must carefully manage the serialization boundary. Passing non-serializable props (like functions or complex classes) from Server to Client components will cause runtime errors.
- **Testing Complexity:** Testing RSCs and Server Actions requires complex mocking of Next.js internals (`next/headers`, `next/navigation`) and database clients.
- **Mitigation:** We enforce a strict file-naming and folder-structure convention. Client components are prefixed or grouped, and Server Actions are isolated in `lib/actions/`.
