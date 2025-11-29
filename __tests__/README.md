# Testing Guide - Cinemark Monorepo

Comprehensive testing documentation for the Cinemark application test suite.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run all tests
npm test

# 3. Run tests in watch mode (recommended for development)
npm run test:watch

# 4. Generate coverage report
npm run test:coverage

# 5. Run specific test file
npm test -- MovieSearch.test.tsx

# 6. Run tests matching a pattern
npm test -- --testPathPattern=components
```

## Test Suite Overview

### Current Test Coverage

The test suite follows a **streamlined, cost-effective approach** focusing on critical user flows that provide maximum business value.

**Test Statistics:**
- **Test Files**: 13+ test suites
- **Test Cases**: 80+ tests covering critical paths
- **Coverage Target**: 60%+ overall (80%+ for critical paths)
- **Framework**: Jest 29.7.0 + React Testing Library 16.3.0

### Test Structure

```
__tests__/
├── actions/                    # Server action tests
│   ├── auth.test.ts           # Authentication flows (sign up, sign in)
│   └── movie.test.ts          # Movie purchase flow
├── components/                # Component tests
│   ├── AuthForm.test.tsx      # Authentication form
│   ├── MovieBuy.test.tsx      # Purchase button component
│   ├── MovieCard.test.tsx     # Movie card display
│   ├── MovieHero.test.tsx     # Movie hero (server component)
│   ├── MovieHeroClient.test.tsx # Movie hero client
│   ├── MovieSearch.test.tsx   # Search functionality
│   └── Header.test.tsx        # Navigation header
├── lib/                       # Utility tests
│   ├── validations.test.ts    # Zod schema validation
│   └── utils.test.ts         # Utility functions
├── app/                       # Page tests
│   └── admin/
│       └── page.test.tsx      # Admin dashboard
├── constants/                 # Constants tests
│   └── index.test.ts         # App constants
├── integration/              # Integration tests
│   └── home-page.test.tsx    # Home page user flows
├── mocks/                     # Shared mocks
│   └── index.ts              # Mock utilities
└── utils/                     # Test utilities
    └── test-utils.tsx        # Helper functions
```

## Test Categories

### 1. Critical Path Tests (MUST HAVE)

#### Authentication Flow
- **Files**: `lib/actions/auth.ts`, `components/AuthForm.tsx`
- **Coverage**:
  - ✅ Sign up: success path, duplicate user, rate limiting
  - ✅ Sign in: success path, error handling, rate limiting
  - ✅ Form validation: Zod schema validation
  - ✅ Form submission: success and error states

#### Movie Purchase Flow
- **Files**: `lib/actions/movie.ts`, `components/MovieBuy.tsx`
- **Coverage**:
  - ✅ Purchase success
  - ✅ Duplicate purchase prevention
  - ✅ Movie not found handling
  - ✅ Loading/success/error states
  - ✅ Router refresh after purchase

### 2. Component Tests (SHOULD HAVE)

#### Core Components
- **MovieSearch.tsx**: Search functionality, filtering, empty states
- **MovieCard.tsx**: Render test, purchased state display
- **MovieHero.tsx**: Server component import verification
- **Header.tsx**: Navigation and logout functionality

### 3. Utility Tests (NICE TO HAVE)

- **lib/validations.ts**: Zod schema validation (signUp, signIn, createMovie)
- **lib/utils.ts**: `cn()` class name utility function
- **constants/index.ts**: Constants validation

## Testing Stack

### Core Dependencies
```json
{
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "@types/jest": "^29.5.11"
}
```

### Mocked Dependencies
- `next/navigation` - Router, pathname, search params (in `jest.setup.js`)
- `next/image` - Image component (in `jest.setup.js`)
- `next-auth` - Authentication (in `jest.setup.js`)
- `@/auth` - Auth utilities (in `jest.setup.js`)
- Database (Drizzle ORM) - Mocked in individual test files
- Redis (Upstash) - Mocked for rate limiting tests
- Workflow (Upstash) - Mocked for email sending tests

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on file changes)
npm run test:watch

# Coverage report
npm run test:coverage

# Verbose output
npm test -- --verbose

# Run specific test file
npm test -- AuthForm.test.tsx

# Run tests matching pattern
npm test -- --testPathPattern=actions
npm test -- --testPathPattern=components
```

### Debugging Tests

```bash
# Run with Node debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Detect open handles (memory leaks)
npm test -- --detectOpenHandles

# Clear Jest cache
npm test -- --clearCache

# Run only failed tests
npm test -- --onlyFailures
```

## Coverage Goals

| Metric | Target | Critical Paths |
|--------|--------|----------------|
| Statements | > 60% | > 80% |
| Branches | > 60% | > 75% |
| Functions | > 60% | > 80% |
| Lines | > 60% | > 80% |

**Focus Areas:**
- Authentication flows: 80%+
- Movie purchase flow: 80%+
- Form validation: 80%+
- Critical components: 70%+

## Test Design Principles

1. **User-Centric**: Test what users see and do, not implementation details
2. **Cost-Effective**: Focus on critical paths that provide business value
3. **Isolation**: Mock external dependencies (database, APIs, services)
4. **Maintainable**: Clear naming, organized structure, reusable utilities
5. **Fast**: Optimized for quick feedback (< 30 seconds for full suite)
6. **Reliable**: Deterministic and stable tests

## Key Testing Patterns

### Component Testing
```typescript
import { render, screen } from '@testing-library/react';
import Component from '@/components/Component';

describe('Component', () => {
  it('should render correctly', () => {
    render(<Component {...props} />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### User Interaction Testing
```typescript
import { fireEvent, waitFor } from '@testing-library/react';

it('should handle user input', async () => {
  render(<Component />);
  const input = screen.getByRole('textbox');
  fireEvent.change(input, { target: { value: 'test' } });
  
  await waitFor(() => {
    expect(screen.getByText('Result')).toBeInTheDocument();
  });
});
```

### Server Action Testing
```typescript
import { signUp } from '@/lib/actions/auth';

jest.mock('@/database/drizzle');
jest.mock('@/lib/ratelimit');

describe('signUp', () => {
  it('should create user successfully', async () => {
    // mock database responses
    const result = await signUp({
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
    });
    
    expect(result.success).toBe(true);
  });
});
```

### Form Validation Testing
```typescript
import { signUpSchema } from '@/lib/validations';

it('should validate correct data', () => {
  const validData = {
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };
  
  const result = signUpSchema.safeParse(validData);
  expect(result.success).toBe(true);
});
```

## Test Utilities

### Mock Data Factories
Located in `__tests__/utils/test-utils.tsx`:

```typescript
import { createMockMovie, createMockMovies } from '@/__tests__/utils/test-utils';

// Create single mock movie
const movie = createMockMovie({ title: 'Custom Title' });

// Create multiple movies
const movies = createMockMovies(10);
```

### Shared Mocks
Located in `__tests__/mocks/index.ts`:

```typescript
import { mockDb, mockRatelimit, mockAuth } from '@/__tests__/mocks';
```

## What's Tested vs. What's Skipped

### ✅ Tested (Critical Paths)
- Authentication flows (sign up, sign in)
- Movie purchase flow
- Form validation (Zod schemas)
- Critical components (AuthForm, MovieBuy, MovieSearch)
- Server actions (auth, movie purchase)
- Utility functions (validations, utils)

### ❌ Skipped (Low Priority)
- UI component library tests (button, input, label, etc.)
- Admin pages/components (low user traffic)
- Detailed API route tests (simple validation only)
- Complex integration scenarios
- E2E tests (future phase)
- Page-level tests (covered by component tests)

## Adding New Tests

### 1. Create Test File
Follow naming convention: `*.test.tsx` or `*.test.ts`

**Location:**
- Components: `__tests__/components/`
- Server Actions: `__tests__/actions/`
- Utilities: `__tests__/lib/`
- Pages: `__tests__/app/`

### 2. Use Existing Patterns
- Follow Arrange-Act-Assert structure
- Use shared mocks from `__tests__/mocks/`
- Use test utilities from `__tests__/utils/`
- Mock external dependencies

### 3. Example Template
```typescript
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Component from '@/components/Component';

// Mock dependencies
jest.mock('@/lib/actions/action');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe('Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<Component {...props} />);
    expect(screen.getByText('Expected')).toBeInTheDocument();
  });
});
```

## Troubleshooting

### Common Issues

**Tests timing out:**
```typescript
jest.setTimeout(10000); // Increase timeout in test file
```

**Module not found:**
```bash
npm install
npm test -- --clearCache
```

**Async component errors:**
- Server components (async) are hard to test directly
- Use import verification or mock the component
- See `MovieHero.test.tsx` for example

**Mock not working:**
- Ensure mocks are defined before imports
- Check mock path matches actual import path
- Verify mock structure matches actual module

**Database mocking issues:**
- Use chained mocks for Drizzle ORM queries
- See `__tests__/actions/auth.test.ts` for examples

## Continuous Integration

Tests are designed for CI/CD:
- ✅ Fast execution (< 30 seconds)
- ✅ No external dependencies required
- ✅ Deterministic results
- ✅ Clear error messages

### CI Configuration Example
```yaml
# .github/workflows/test.yml
- name: Run tests
  run: npm test -- --coverage --ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## Maintenance

### Updating Tests
1. Run tests to identify failures: `npm test`
2. Update mocks if external APIs changed
3. Adjust assertions for new behavior
4. Maintain backward compatibility where possible

### Keeping Tests Updated
- Review tests when adding new features
- Update mocks when dependencies change
- Refactor tests when patterns improve
- Remove obsolete tests

## Best Practices

1. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Avoid testing internal state
   - Test user interactions

2. **Keep Tests Simple**
   - One assertion per test when possible
   - Clear, descriptive test names
   - Avoid complex setup

3. **Mock External Dependencies**
   - Database calls
   - API requests
   - External services (Redis, workflows)
   - Next.js specific modules

4. **Use Testing Library Queries**
   - Prefer `getByRole`, `getByLabelText`
   - Avoid `getByTestId` unless necessary
   - Test accessibility

5. **Clean Up After Tests**
   - Use `beforeEach`/`afterEach` for cleanup
   - Reset mocks between tests
   - Clear timers if using fake timers

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Next.js Testing](https://nextjs.org/docs/app/building-your-application/testing)

## Support

For questions or issues:
- Review test file comments for implementation details
- Check existing tests for patterns
- Refer to documentation links above

---

**Last Updated**: Based on streamlined test plan  
**Test Framework**: Jest 29.7.0 + React Testing Library 16.3.0  
**Coverage**: 80+ tests focusing on critical user flows
