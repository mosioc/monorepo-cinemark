// simple test for MovieHero - it's an async server component
// we just verify the file exists and can be imported
// full testing would require server component testing setup

// mock all dependencies to avoid import errors
jest.mock('@/database/drizzle', () => ({
  db: {
    select: jest.fn(),
  },
}));

jest.mock('@/components/MovieCover', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('@/components/MovieBuy', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('next/image', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('MovieHero Component', () => {
  it('should be importable', async () => {
    // dynamic import to avoid issues with server components
    const module = await import('@/components/MovieHero');
    expect(module.default).toBeDefined();
  });
});

