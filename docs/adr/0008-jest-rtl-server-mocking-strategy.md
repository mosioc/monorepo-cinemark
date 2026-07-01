# ADR-0008: Jest & RTL Testing Strategy for Server-First Architecture

**Status:** Accepted    
**Date:** -  
**Author:** Mehdi Maleki  

## Context

Testing a Server-First architecture (RSC + Server Actions) is notoriously difficult because the code runs in a Node.js environment, not the browser. We need a testing strategy that provides high confidence in critical paths (Auth, Purchases) without slowing down development.

## Decision

We will use **Jest** and **React Testing Library (RTL)**. We will adopt a **heavy mocking strategy** for server-side dependencies (Drizzle ORM, Upstash, NextAuth) and focus unit/integration tests on Server Actions and interactive Client Components.

## Alternatives Considered

- **Vitest:** Considered. Vitest is faster and has native ESM support. However, Jest has a more mature ecosystem for complex module mocking and better legacy support for certain RTL utilities.
- **Playwright / Cypress (E2E):** Rejected for the current phase. E2E tests are too slow for the tight feedback loop required by a solo developer. They will be introduced in a later phase for critical user journeys.
- **Testing Server Components directly:** Rejected. RSCs are async and run on the server. Testing them directly requires complex test-runner setups.

## Consequences

### Positive

- **Fast Feedback Loop:** Unit tests for Server Actions and RTL tests for Client components run in milliseconds.
- **Focus on Business Logic:** By mocking the DB, we test the *logic* of the Server Actions (e.g., "does it prevent duplicate purchases?") rather than the database connection.

### Negative & Risks

- **Mock Maintenance Overhead:** Drizzle ORM uses a chained query builder (`db.select().from().where()`). Mocking this chain in Jest requires verbose, brittle setup.
- **False Sense of Security:** Heavy mocking means we aren't testing the actual database integration.
- **Mitigation:** We maintain a centralized mock factory in `__tests__/mocks/index.ts`. We accept that DB integration is verified via manual testing and Drizzle Studio during development, reserving automated tests for business logic and UI behavior.
