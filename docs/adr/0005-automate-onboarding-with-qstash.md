# ADR-0005: Implement Upstash Redis for Distributed Rate Limiting

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki  

## Context

Authentication endpoints (`/sign-in`, `/sign-up`) are highly vulnerable to brute-force and credential stuffing attacks. We need rate limiting that works across a distributed, serverless environment.

## Decision

We will use **Upstash Redis** with the `@upstash/ratelimit` library, applying a fixed-window limit (e.g., 5 requests per minute per IP) to authentication Server Actions.

## Alternatives Considered

- **In-Memory Rate Limiting (e.g., `express-rate-limit` or `memory-cache`):** Rejected. Serverless functions spin up multiple independent instances. In-memory state is not shared across instances, rendering it useless for distributed rate limiting.
- **Self-Hosted Redis:** Rejected. Requires provisioning, securing, and maintaining a dedicated server or managed database, which is overkill for a solo project.

## Consequences

### Positive

- **Distributed State:** Upstash provides a centralized, globally distributed Redis instance that all serverless functions can access synchronously.
- **Security:** Effectively mitigates brute-force attacks at the application layer before they hit the database.

### Negative & Risks

- **Added Latency:** Every authentication request now requires a network hop to Upstash Redis to check the limit.
- **IP Spoofing:** Relying on `x-forwarded-for` can be spoofed if the app is accessed directly, bypassing the proxy.
- **Mitigation:** We ensure the app is strictly deployed behind Vercel's proxy to trust the `x-forwarded-for` header. The ~10ms latency added by Upstash is an acceptable trade-off for security.
