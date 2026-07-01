# ADR-0004: Use Upstash QStash for Asynchronous Email Workflows

**Status:** Accepted  
**Date:** -  
**Author:** Mehdi Maleki  

## Context

Upon user registration, we need to send a welcome email immediately, and a re-engagement email 3 days later if the user is inactive. This requires delayed, stateful background jobs.

## Decision

We will use **Upstash QStash Workflows** to orchestrate delayed tasks, utilizing **Resend** as the underlying email delivery provider.

## Alternatives Considered

- **Node-cron / Vercel Cron Jobs:** Rejected. Cron jobs run on a schedule, not on an event (like a specific user signing up). Managing state (e.g., "did this specific user trigger the 3-day check?") requires building a custom database-backed scheduler.
- **BullMQ / Redis Queues:** Rejected. Requires a persistent Node.js worker process to consume the queue. Incompatible with Vercel's purely serverless, ephemeral compute model.
- **Blocking the HTTP Request:** Rejected. Sending emails synchronously during the `signUp` Server Action would drastically increase the response time and risk timeouts.

## Consequences

### Positive

- **Serverless Native:** QStash is designed for serverless. It handles the state, delays, and retries without requiring us to manage a persistent worker server.
- **Decoupling:** The `signUp` action returns immediately after triggering the workflow, keeping the UI highly responsive.

### Negative & Risks

- **Debugging Complexity:** Tracing a workflow that sleeps for 3 days requires checking the Upstash dashboard rather than standard application logs.
- **Cost:** QStash charges per workflow execution and message.
- **Mitigation:** We keep workflow logic strictly isolated in `lib/workflow.ts` and `app/api/workflows/`. We use structured logging to track workflow triggers.
