# ADR-0003: Implement NextAuth v5 with JWT Strategy and Credentials

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki   

## Context

The application requires secure user authentication, password hashing, and session management. We need role-based access control (USER vs ADMIN). We do not currently require third-party OAuth providers (Google, GitHub).

## Decision

We will use **NextAuth v5 (Auth.js)** utilizing the **Credentials Provider** for email/password authentication. Passwords will be hashed using `bcryptjs`. Sessions will use the **JWT strategy** rather than database sessions.

## Alternatives Considered

- **Custom JWT/Auth Implementation:** Rejected. Reinventing authentication introduces severe security risks (e.g., timing attacks, improper cookie flags).
- **Managed Auth (Clerk, Auth0):** Rejected. While feature-rich, they introduce external network latency on every request, add monthly costs, and create vendor lock-in for core user data.
- **Database Sessions (NextAuth `strategy: "database"`):** Rejected. Requires a database read on *every* authenticated request to validate the session token, increasing latency and DB load.

## Consequences

### Positive

- **Stateless Sessions:** JWT strategy eliminates database reads for session validation, improving read performance.
- **Edge/Middleware Compatible:** JWT tokens can be easily read and verified in Next.js Middleware for route protection without hitting the database.
- **Security:** `bcryptjs` provides industry-standard password hashing with automatic salting.

### Negative & Risks

- **No Instant Revocation:** Because JWTs are stateless, if a user is banned or changes their password, their existing JWT remains valid until it expires.
- **v5 Beta Status:** NextAuth v5 is in beta. API changes may occur during minor version bumps.
- **Mitigation:** We set a relatively short JWT expiration (e.g., 30 days). For critical admin actions, we can re-validate the user's role from the database. We pin the NextAuth version strictly in `package.json`.
