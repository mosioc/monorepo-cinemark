# Testing Guide - Cinemark Monorepo

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run tests
npm test

# 3. Run tests in watch mode (recommended for development)
npm run test:watch

# 4. Generate coverage report
npm run test:coverage
```

## What Was Generated

### 📦 Complete Test Suite (233+ Test Cases)

#### 1. Component Tests
- **MovieSearch.tsx** (82 tests)
  - Search functionality across title, director, and genre
  - Real-time filtering with case-insensitive matching
  - Empty state handling and edge cases
  - Performance optimization tests
  - Accessibility compliance

- **MovieHeroClient.tsx** (78 tests)
  - Component rendering and display logic
  - Movie cover rendering (main + decorative)
  - Props validation and edge cases
  - Integration with child components
  - CSS styling verification

#### 2. Page Tests
- **app/admin/page.tsx** (45 tests)
  - Database query mocking and data fetching
  - Statistics aggregation and display
  - Currency and date formatting
  - Recent movies/users sections
  - Empty states and error handling

#### 3. Configuration Tests
- **constants/index.ts** (28 tests)
  - Admin sidebar links validation
  - Route and icon path verification
  - Data integrity and type safety
  - Backward compatibility

#### 4. Integration Tests
- **Home page flow** (15+ tests)
  - Complete user journeys
  - Multi-criteria search scenarios
  - Performance with large datasets
  - Accessibility features

### 🔧 Test Infrastructure