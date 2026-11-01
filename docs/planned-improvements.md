# Planned Improvements

This document tracks the scope and verification expectations for the current GitHub backlog. Statuses distinguish planned work from work in progress; the GitHub issue remains the source of truth for completion.

## Secure personal movie library

Tracked in [issue #69](https://github.com/mosioc/monorepo-cinemark/issues/69).

**Status:** In progress on `feature/69-secure-personal-library`.

The profile page should load the signed-in user's completed purchases and render the related movies. Movie details should reflect whether the current user already owns the movie. The server action must derive the purchaser from `auth()` rather than accepting an authoritative `userId` from browser input. The database uniqueness constraint on `(user_id, movie_id)` remains the final protection against concurrent duplicate inserts; the action should handle a uniqueness conflict as an already-owned result.

**Verification:** test unauthenticated and authenticated calls, ownership isolation, successful insertion, repeated requests, and the UI's owned state. Add a database integration check for the unique constraint if the test environment can run against PostgreSQL.

## Server-side movie search, filters, and pagination

Tracked in [issue #70](https://github.com/mosioc/monorepo-cinemark/issues/70).

Search by title, director, or genre and combine it with genre and rating filters. Put the query, active filters, and page/cursor in URL search parameters. Apply filtering and pagination in the database query so each response returns a bounded page. Use deterministic ordering, including a unique tie-breaker, so records do not move unpredictably between pages.

**Verification:** test parameter parsing, combined filters, empty results, invalid or out-of-range pages, stable ordering, and that the query applies limit/offset or cursor bounds in the database layer. Check that navigation and reload preserve the URL state.

## Admin movie editing

Tracked in [issue #71](https://github.com/mosioc/monorepo-cinemark/issues/71).

Reuse the existing movie form and validation schema for editing. The update server action must validate input on the server and independently verify the current user's admin role; hiding an edit link is not an authorization check. Keep create and update behavior explicit so future fields cannot be silently omitted from one path.

**Verification:** test valid updates, invalid payloads, missing movies, unauthenticated requests, non-admin requests, and successful form feedback/navigation.

## CI checks and Docker image

CI is tracked in [issue #72](https://github.com/mosioc/monorepo-cinemark/issues/72). Container image work is already tracked in [issue #43](https://github.com/mosioc/monorepo-cinemark/issues/43).

The pull request workflow should install the locked dependencies and run lint, tests, and a production build. Before removing the Next.js settings that currently ignore TypeScript and ESLint errors, fix the issues those checks reveal. Docker build/publish details belong with issue #43 and should be linked into CI only when the image workflow is concrete.

**Verification:** confirm each check runs on pull requests, fails the workflow on a failing command, and succeeds with the documented CI environment setup. Build the image as part of issue #43's acceptance criteria.

## Tests and ADRs

Follow [ADR-0008](./adr/0008-jest-rtl-server-mocking-strategy.md) when adding tests. Issue #69 now has action, profile-page, and component tests on its implementation branch; those tests have not yet been run here. Add or update tests alongside the remaining issue implementations. Prefer action tests for authorization and business rules, component tests for visible states, and database integration tests where uniqueness or query behavior cannot be shown by mocks alone.

No architectural decision is finalized by these issues alone. Update an existing ADR or add a new one when implementation settles a consequential choice (for example, pagination strategy or container runtime/deployment target). Keep the ADR status explicit and avoid recording a proposed choice as accepted before it is implemented.
