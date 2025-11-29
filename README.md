# Cinemark

A modern movie streaming and purchasing platform built with Next.js, featuring user authentication, movie browsing, purchase management, and an admin dashboard.

## Table of Contents

- [Short Description](#short-description)
- [Technology Stack](#technology-stack)
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Installation](#installation)
- [Usage](#usage)
- [Code Structure](#code-structure)
- [Dependencies](#dependencies)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Contribution Guidelines](#contribution-guidelines)


## Short Description

Cinemark is a full-stack web application that enables users to browse, search, and purchase movies. The platform includes role-based access control with separate interfaces for regular users and administrators. Built with Next.js 16 App Router, it leverages server components, server actions, and modern React patterns to deliver a performant and scalable movie streaming experience.

## Technology Stack

**Frontend**
- Next.js 16 (App Router)
- React 19
- TailwindCSS 4
- Radix UI Components
- Lucide Icons
- React Hook Form
- ImageKit React SDK

**Backend**
- Next.js Server Actions
- NextAuth v5 (Credentials Provider)
- Drizzle ORM
- PostgreSQL (Neon / Vercel Postgres)
- Redis (Upstash) for rate limiting and caching
- Upstash QStash Workflows
- Resend (Email automation)

**Testing & Tooling**
- Jest
- React Testing Library
- Drizzle Kit
- ESLint 9
- TypeScript 5
- tsx

**Deployment & DevOps**
- Vercel (recommended)
- Environment variables via `.env.local`
- Automated workflows with Upstash

## Features

### User Features

- **Authentication System**: Secure sign-up and sign-in with NextAuth v5
- **Movie Browsing**: Browse and search through available movies
- **Movie Details**: View detailed information about each movie including ratings, descriptions, and summaries
- **Purchase Management**: Add movies to personal library with purchase tracking
- **User Profile**: Access personal profile and purchase history
- **Rate Limiting**: Protection against brute force attacks on authentication endpoints

### Admin Features

- **Dashboard**: Overview of movies, users, purchases, and revenue statistics
- **Movie Management**: Create, view, and manage movie catalog
- **User Management**: View and manage user accounts
- **Analytics**: Track recent movies and user registrations

### Technical Features

- **Server-Side Rendering**: Optimized performance with Next.js server components
- **Database Integration**: PostgreSQL database with Drizzle ORM
- **Caching**: Redis-based rate limiting and session management
- **Workflow Automation**: Automated email notifications for user onboarding
- **Image Management**: ImageKit integration for optimized image delivery
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Testing**: Comprehensive test suite with Jest and React Testing Library

## Architecture Overview

The application follows a modern Next.js architecture with clear separation between client and server components, server actions for data mutations, and a well-structured database layer.

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React Components]
        ClientActions[Client Actions]
    end
    
    subgraph "Next.js App Router"
        Pages[Pages]
        ServerComponents[Server Components]
        ServerActions[Server Actions]
        APIRoutes[API Routes]
    end
    
    subgraph "Authentication"
        NextAuth[NextAuth v5]
        Session[Session Management]
    end
    
    subgraph "Business Logic"
        Actions[Action Handlers]
        Validations[Zod Validations]
        Workflows[Upstash Workflows]
    end
    
    subgraph "Data Layer"
        DrizzleORM[Drizzle ORM]
        PostgreSQL[(PostgreSQL Database)]
        Redis[(Redis Cache)]
    end
    
    subgraph "External Services"
        ImageKit[ImageKit]
        QStash[QStash/Workflows]
        Resend[Resend Email]
    end
    
    UI --> Pages
    Pages --> ServerComponents
    ServerComponents --> ServerActions
    ClientActions --> ServerActions
    ServerActions --> Actions
    Actions --> NextAuth
    Actions --> Validations
    Actions --> DrizzleORM
    DrizzleORM --> PostgreSQL
    Actions --> Redis
    APIRoutes --> Workflows
    Workflows --> QStash
    QStash --> Resend
    ServerComponents --> ImageKit
```

## Installation

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- Redis instance (Upstash recommended)
- ImageKit account
- Resend account for email functionality

### Step-by-Step Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd monorepo-cinemark
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Upstash Redis
UPSTASH_REDIS_REST_URL=your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Upstash QStash (Workflows)
QSTASH_URL=your-qstash-url
QSTASH_TOKEN=your-qstash-token

# ImageKit
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=your-imagekit-url
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your-public-key
IMAGEKIT_PRIVATE_KEY=your-private-key

# Resend
RESEND_TOKEN=your-resend-token

# API Endpoints
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3000
NEXT_PUBLIC_PROD_API_ENDPOINT=https://your-production-url.com
```

4. **Set up the database**

Generate and run migrations:

```bash
npm run db:generate
npm run db:migrate
```

5. **Seed the database (optional)**

```bash
npm run seed
```

6. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

Build the application:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

### Database Management

Generate new migration files after schema changes:

```bash
npm run db:generate
```

Apply migrations to the database:

```bash
npm run db:migrate
```

Open Drizzle Studio to view and manage database:

```bash
npm run db:studio
```

### Testing

Run all tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

Generate coverage report:

```bash
npm run test:coverage
```

### Linting

Run ESLint:

```bash
npm run lint
```

## Code Structure

```
monorepo-cinemark/
├── app/                          # Next.js App Router pages
│   ├── (auth)/                  # Authentication routes group
│   │   ├── sign-in/
│   │   └── sign-up/
│   ├── (root)/                  # Main application routes
│   │   ├── movies/
│   │   │   └── [id]/           # Dynamic movie detail page
│   │   ├── profile/
│   │   └── page.tsx            # Home page
│   ├── admin/                   # Admin dashboard routes
│   │   ├── movies/
│   │   └── users/
│   └── api/                     # API routes
│       ├── auth/
│       ├── imagekit/
│       └── workflows/
├── components/                   # React components
│   ├── admin/                   # Admin-specific components
│   ├── ui/                      # Reusable UI components
│   ├── AuthForm.tsx
│   ├── Header.tsx
│   ├── MovieBuy.tsx
│   ├── MovieCard.tsx
│   ├── MovieHero.tsx
│   ├── MovieList.tsx
│   └── MovieSearch.tsx
├── database/                     # Database configuration
│   ├── schema.ts                # Drizzle ORM schema definitions
│   ├── drizzle.ts               # Database connection
│   ├── redis.ts                 # Redis client
│   └── seed.ts                  # Database seeding script
├── lib/                         # Utility libraries
│   ├── actions/                 # Server actions
│   │   ├── auth.ts             # Authentication actions
│   │   └── movie.ts            # Movie-related actions
│   ├── admin/                   # Admin-specific actions
│   ├── ratelimit.ts            # Rate limiting configuration
│   ├── validations.ts          # Zod validation schemas
│   ├── utils.ts                # Utility functions
│   └── workflow.ts             # Workflow and email utilities
├── constants/                   # Application constants
├── migrations/                  # Database migration files
├── public/                      # Static assets
│   ├── icons/
│   └── images/
├── styles/                      # Global styles
├── __tests__/                   # Test files
│   ├── actions/
│   ├── components/
│   ├── lib/
│   └── utils/
├── auth.ts                      # NextAuth configuration
├── config.ts                    # Environment configuration
├── drizzle.config.ts            # Drizzle Kit configuration
├── next.config.ts               # Next.js configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies and scripts
```

### Key Files and Directories

- **`app/`**: Next.js App Router pages and API routes. Uses route groups `(auth)` and `(root)` for layout organization.
- **`components/`**: React components organized by feature. UI components in `ui/` subdirectory.
- **`lib/actions/`**: Server actions for data mutations. Marked with `"use server"` directive.
- **`database/schema.ts`**: Drizzle ORM schema defining users, movies, and purchases tables.
- **`auth.ts`**: NextAuth v5 configuration with credentials provider.
- **`lib/ratelimit.ts`**: Rate limiting configuration using Upstash Redis.
- **`lib/workflow.ts`**: Workflow client and email sending utilities.

## Dependencies

### Core Dependencies

- **next** (16.0.4): React framework with App Router
- **react** (19.2.0): UI library
- **react-dom** (19.2.0): React DOM renderer
- **typescript** (^5): Type safety

### Authentication

- **next-auth** (^5.0.0-beta.30): Authentication framework
- **bcryptjs** (^3.0.3): Password hashing

### Database

- **drizzle-orm** (^0.44.7): TypeScript ORM
- **@neondatabase/serverless** (^1.0.2): Neon PostgreSQL client
- **@vercel/postgres** (^0.10.0): Alternative PostgreSQL client

### Caching and Workflows

- **@upstash/redis** (^1.35.7): Redis client
- **@upstash/ratelimit** (^2.0.7): Rate limiting
- **@upstash/workflow** (^0.2.22): Workflow automation

### UI and Styling

- **tailwindcss** (^4): Utility-first CSS framework
- **@radix-ui/react-avatar** (^1.1.11): Avatar component
- **@radix-ui/react-label** (^2.1.8): Label component
- **lucide-react** (^0.554.0): Icon library

### Forms and Validation

- **react-hook-form** (^7.66.1): Form management
- **@hookform/resolvers** (^5.2.2): Form validation resolvers
- **zod** (^4.1.13): Schema validation

### Media

- **imagekit** (^6.0.0): ImageKit SDK
- **imagekitio-react** (^4.3.0): React components for ImageKit

### Utilities

- **dayjs** (^1.11.19): Date manipulation
- **clsx** (^2.1.1): Conditional class names
- **react-hot-toast** (^2.6.0): Toast notifications

### Development Dependencies

- **drizzle-kit** (^0.31.7): Database migrations and studio
- **jest** (^29.7.0): Testing framework
- **@testing-library/react** (^16.3.0): React testing utilities
- **eslint** (^9): Linting
- **tsx** (^4.19.2): TypeScript execution

## Testing

The project includes a comprehensive test suite focusing on critical user flows. See [`__tests__/README.md`](./__tests__/README.md) for detailed testing documentation.

### Quick Start

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure

- **`__tests__/actions/`**: Server action tests (authentication, movie purchase)
- **`__tests__/components/`**: Component tests (forms, UI components)
- **`__tests__/lib/`**: Utility and validation tests
- **`__tests__/integration/`**: Integration tests

### Coverage Goals

- Overall coverage: 60%+
- Critical paths (auth, purchase): 80%+

## Environment Variables

Required environment variables are documented in the [Installation](#installation) section. All environment variables are loaded from `.env.local` and accessed through the `config.ts` file.

### Important Variables

- **DATABASE_URL**: PostgreSQL connection string
- **NEXTAUTH_SECRET**: Secret key for NextAuth session encryption
- **UPSTASH_REDIS_REST_URL/TOKEN**: Redis connection for rate limiting
- **QSTASH_URL/TOKEN**: QStash connection for workflow automation
- **IMAGEKIT_***: ImageKit credentials for image hosting
- **RESEND_TOKEN**: Resend API token for email sending

## Database

### Schema Overview

The database consists of three main tables:

1. **users**: User accounts with authentication and role information
2. **movies**: Movie catalog with metadata
3. **purchases**: User movie purchases and library tracking

### Schema Diagram

```mermaid
erDiagram
    users ||--o{ purchases : "has"
    movies ||--o{ purchases : "purchased"
    
    users {
        uuid id PK
        varchar full_name
        text email UK
        text password
        enum status
        enum role
        timestamp last_activity_date
        timestamp created_at
    }
    
    movies {
        uuid id PK
        varchar title
        varchar director
        text genre
        numeric rating
        text description
        varchar cover_color
        text cover_url
        varchar summary
        timestamp created_at
    }
    
    purchases {
        uuid id PK
        uuid user_id FK
        uuid movie_id FK
        numeric price
        varchar currency
        enum purchase_status
        timestamp purchase_date
        timestamp created_at
    }
```

### Migrations

Database migrations are managed with Drizzle Kit:

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio
npm run db:studio
```

## Main Workflows

### User Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant UI
    participant ServerAction
    participant RateLimit
    participant NextAuth
    participant Database
    
    User->>UI: Enter credentials
    UI->>ServerAction: signInWithCredentials()
    ServerAction->>RateLimit: Check rate limit
    RateLimit-->>ServerAction: Success/Failure
    alt Rate limit exceeded
        ServerAction-->>UI: Redirect to /too-fast
    else Rate limit OK
        ServerAction->>NextAuth: signIn()
        NextAuth->>Database: Query user
        Database-->>NextAuth: User data
        NextAuth->>NextAuth: Verify password
        NextAuth-->>ServerAction: Session token
        ServerAction-->>UI: Success
        UI-->>User: Redirect to home
    end
```

### Movie Purchase Flow

```mermaid
sequenceDiagram
    participant User
    participant MovieBuy
    participant ServerAction
    participant Database
    participant UI
    
    User->>MovieBuy: Click "Add to Library"
    MovieBuy->>ServerAction: purchaseMovie()
    ServerAction->>Database: Check movie exists
    Database-->>ServerAction: Movie data
    ServerAction->>Database: Check existing purchase
    Database-->>ServerAction: Purchase status
    alt Movie not found
        ServerAction-->>MovieBuy: Error: Movie not found
    else Already purchased
        ServerAction-->>MovieBuy: Error: Already in library
    else Success
        ServerAction->>Database: Insert purchase
        Database-->>ServerAction: Purchase record
        ServerAction-->>MovieBuy: Success
        MovieBuy->>UI: Refresh page
        UI-->>User: Show updated state
    end
```

### User Onboarding Workflow

```mermaid
sequenceDiagram
    participant User
    participant SignUp
    participant Database
    participant Workflow
    participant EmailService
    
    User->>SignUp: Submit registration
    SignUp->>Database: Check existing user
    alt User exists
        SignUp-->>User: Error: User already exists
    else New user
        SignUp->>Database: Create user
        Database-->>SignUp: User created
        SignUp->>Workflow: Trigger onboarding workflow
        Workflow->>EmailService: Send welcome email
        EmailService-->>User: Welcome email
        SignUp->>SignUp: Auto sign-in
        SignUp-->>User: Redirect to home
        
        Note over Workflow: Wait 3 days
        Workflow->>Database: Check user activity
        alt User inactive
            Workflow->>EmailService: Send re-engagement email
        else User active
            Workflow->>EmailService: Send welcome back email
        end
        
        Note over Workflow: Repeat monthly
    end
```

## Module Flow Diagram

```mermaid
graph LR
    A[User Request] --> B{Authentication}
    B -->|Authenticated| C[Protected Routes]
    B -->|Not Authenticated| D[Auth Pages]
    
    C --> E{User Role}
    E -->|USER| F[User Dashboard]
    E -->|ADMIN| G[Admin Dashboard]
    
    F --> H[Movie Browse]
    F --> I[Movie Search]
    F --> J[Movie Purchase]
    F --> K[User Profile]
    
    G --> L[Movie Management]
    G --> M[User Management]
    G --> N[Analytics]
    
    H --> O[Database Query]
    I --> O
    J --> P[Server Action]
    L --> P
    M --> P
    
    P --> O
    O --> Q[(PostgreSQL)]
    
    P --> R[Rate Limiter]
    R --> S[(Redis)]
    
    P --> T[Workflow Trigger]
    T --> U[QStash]
    U --> V[Email Service]
```

## Contribution Guidelines

### Code Style

- Use TypeScript for all new code
- Follow Next.js App Router conventions
- Use server components by default, client components only when necessary
- Mark server actions with `"use server"` directive
- Use Zod for all input validation

### Naming Conventions

- **Files**: PascalCase for components (`MovieCard.tsx`), camelCase for utilities (`utils.ts`)
- **Components**: PascalCase (`MovieHero`, `AuthForm`)
- **Functions**: camelCase (`purchaseMovie`, `signInWithCredentials`)
- **Constants**: UPPER_SNAKE_CASE (`FIELD_NAMES`, `STATUS_ENUM`)

### Folder Structure

- Keep related files together (components, actions, tests)
- Use route groups for layout organization
- Place shared utilities in `lib/`
- Keep database-related code in `database/`

### Testing

- Write tests for all server actions
- Test critical user flows (authentication, purchases)
- Maintain 60%+ overall coverage, 80%+ for critical paths
- Use React Testing Library for component tests

### Commit Messages

Use conventional commit format:

```
feat: add movie search functionality
fix: resolve authentication rate limit issue
docs: update installation instructions
```
