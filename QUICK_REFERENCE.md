# Test Suite Quick Reference

> 📖 **Full Documentation**: See [`__tests__/README.md`](./__tests__/README.md) for comprehensive testing guide

## Quick Commands

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode (auto-rerun)
npm run test:coverage      # Generate coverage report
npm test -- AuthForm       # Run specific test file
```

## Test Suite Overview

- **Test Files**: 13+ test suites
- **Test Cases**: 80+ tests
- **Coverage Target**: 60%+ overall, 80%+ for critical paths
- **Framework**: Jest + React Testing Library

## Critical Test Files

### Server Actions
- `__tests__/actions/auth.test.ts` - Authentication flows
- `__tests__/actions/movie.test.ts` - Movie purchase flow

### Components
- `__tests__/components/AuthForm.test.tsx` - Auth form
- `__tests__/components/MovieBuy.test.tsx` - Purchase button
- `__tests__/components/MovieSearch.test.tsx` - Search functionality
- `__tests__/components/MovieCard.test.tsx` - Movie card
- `__tests__/components/Header.test.tsx` - Navigation

### Utilities
- `__tests__/lib/validations.test.ts` - Zod schemas
- `__tests__/lib/utils.test.ts` - Utility functions

## What's Tested

✅ Authentication flows (sign up, sign in)  
✅ Movie purchase flow  
✅ Form validation  
✅ Critical components  
✅ Server actions  

## Coverage Goals

- **Overall**: 60%+
- **Critical Paths**: 80%+
- **Authentication**: 80%+
- **Purchase Flow**: 80%+

## Quick Tips

- Use `npm run test:watch` during development
- Check `__tests__/README.md` for detailed patterns
- Mock external dependencies (database, APIs)
- Focus on user behavior, not implementation

---

**Last Updated**: Based on streamlined test plan  
**Full Guide**: [`__tests__/README.md`](./__tests__/README.md)
