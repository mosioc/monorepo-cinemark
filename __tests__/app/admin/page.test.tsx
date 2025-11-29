import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock the database and dependencies
const mockDb = {
  select: jest.fn(),
}

jest.mock('@/database/drizzle', () => ({
  db: mockDb,
}))

jest.mock('@/database/schema', () => ({
  movies: { id: 'id', title: 'title', createdAt: 'createdAt' },
  users: { id: 'id', fullName: 'fullName', email: 'email', createdAt: 'createdAt' },
  purchases: { price: 'price', purchaseStatus: 'purchaseStatus' },
}))

jest.mock('drizzle-orm', () => ({
  count: jest.fn(() => 'count-fn'),
  sql: jest.fn((strings) => `sql-${strings}`),
  desc: jest.fn((field) => `desc-${field}`),
  eq: jest.fn((field, value) => `eq-${field}-${value}`),
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, className }: any) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

describe('Admin Dashboard Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Data Fetching and Display', () => {
    it('should fetch and display statistics correctly', async () => {
      // Setup mock responses
      const mockFrom = jest.fn()
      const mockWhere = jest.fn()
      const mockOrderBy = jest.fn()
      const mockLimit = jest.fn()

      mockFrom.mockReturnValue({
        where: mockWhere,
        orderBy: mockOrderBy,
        limit: mockLimit,
      })

      mockWhere.mockReturnValue({
        orderBy: mockOrderBy,
        limit: mockLimit,
      })

      mockOrderBy.mockReturnValue({
        limit: mockLimit,
      })

      mockLimit.mockResolvedValue([])

      mockDb.select.mockReturnValue({
        from: mockFrom,
      })

      // Mock Promise.all results
      const mockStats = [
        [{ count: 10 }], // movies count
        [{ count: 25 }], // users count
        [{ count: 50 }], // purchases count
        [{ total: 1250.75 }], // revenue
        [], // recent movies
        [], // recent users
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any

      // Import the page component after mocks are set
      const Page = (await import('@/app/admin/page')).default
      
      const { container } = render(await Page())

      expect(container).toBeInTheDocument()
    })
  })

  describe('Statistics Display', () => {
    it('should display total movies count', async () => {
      const mockStats = [
        [{ count: 15 }],
        [{ count: 30 }],
        [{ count: 100 }],
        [{ total: 2500 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('Total Movies')).toBeInTheDocument()
      expect(screen.getByText('15')).toBeInTheDocument()
    })

    it('should display total users count', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 42 }],
        [{ count: 100 }],
        [{ total: 2500 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('Total Users')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('should display total purchases count', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 150 }],
        [{ total: 2500 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('Total Purchases')).toBeInTheDocument()
      expect(screen.getByText('150')).toBeInTheDocument()
    })

    it('should format and display revenue correctly', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1234.56 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('Total Revenue')).toBeInTheDocument()
      expect(screen.getByText('$1,234.56')).toBeInTheDocument()
    })

    it('should handle zero values gracefully', async () => {
      const mockStats = [
        [{ count: 0 }],
        [{ count: 0 }],
        [{ count: 0 }],
        [{ total: 0 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getAllByText('0')).toHaveLength(3) // movies, users, purchases
      expect(screen.getByText('$0.00')).toBeInTheDocument()
    })

    it('should handle undefined counts', async () => {
      const mockStats = [
        [],
        [],
        [],
        [],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getAllByText('0')).toHaveLength(3)
      expect(screen.getByText('$0.00')).toBeInTheDocument()
    })
  })

  describe('Recent Movies Section', () => {
    it('should display recent movies list', async () => {
      const recentMovies = [
        {
          id: '1',
          title: 'The Matrix',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          title: 'Inception',
          createdAt: new Date('2024-01-10'),
        },
      ]

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        recentMovies,
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('Recent Movies')).toBeInTheDocument()
      expect(screen.getByText('The Matrix')).toBeInTheDocument()
      expect(screen.getByText('Inception')).toBeInTheDocument()
    })

    it('should display "View all" link for movies', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [{ id: '1', title: 'Movie 1', createdAt: new Date() }],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      const viewAllLinks = screen.getAllByText('View all')
      const movieViewAll = viewAllLinks.find(
        (link) => link.getAttribute('href') === '/admin/movies'
      )
      expect(movieViewAll).toBeInTheDocument()
    })

    it('should show "No movies yet" when empty', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('No movies yet')).toBeInTheDocument()
    })

    it('should format movie creation dates correctly', async () => {
      const recentMovies = [
        {
          id: '1',
          title: 'Test Movie',
          createdAt: new Date('2024-03-15'),
        },
      ]

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        recentMovies,
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      // Date should be formatted as "Mar 15, 2024"
      expect(screen.getByText(/Mar 15, 2024/)).toBeInTheDocument()
    })

    it('should handle null creation date', async () => {
      const recentMovies = [
        {
          id: '1',
          title: 'Test Movie',
          createdAt: null,
        },
      ]

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        recentMovies,
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('N/A')).toBeInTheDocument()
    })
  })

  describe('Recent Users Section', () => {
    it('should display recent users list', async () => {
      const recentUsers = [
        {
          id: '1',
          fullName: 'John Doe',
          email: 'john@example.com',
          createdAt: new Date('2024-01-20'),
        },
        {
          id: '2',
          fullName: 'Jane Smith',
          email: 'jane@example.com',
          createdAt: new Date('2024-01-18'),
        },
      ]

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        recentUsers,
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('Recent Users')).toBeInTheDocument()
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('john@example.com')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
    })

    it('should display "View all" link for users', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        [{ id: '1', fullName: 'User 1', email: 'user@test.com', createdAt: new Date() }],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      const viewAllLinks = screen.getAllByText('View all')
      const userViewAll = viewAllLinks.find(
        (link) => link.getAttribute('href') === '/admin/users'
      )
      expect(userViewAll).toBeInTheDocument()
    })

    it('should show "No users yet" when empty', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('No users yet')).toBeInTheDocument()
    })

    it('should format user creation dates correctly', async () => {
      const recentUsers = [
        {
          id: '1',
          fullName: 'Test User',
          email: 'test@example.com',
          createdAt: new Date('2024-02-28'),
        },
      ]

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        recentUsers,
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText(/Feb 28, 2024/)).toBeInTheDocument()
    })
  })

  describe('Layout and Structure', () => {
    it('should render statistics in a grid layout', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      const { container } = render(await Page())

      const statsGrid = container.querySelector('.grid')
      expect(statsGrid).toBeInTheDocument()
    })

    it('should have proper CSS classes for styling', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      const { container } = render(await Page())

      const stats = container.querySelectorAll('.stat')
      expect(stats.length).toBeGreaterThan(0)
    })

    it('should render two-column grid for movies and users sections', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [{ id: '1', title: 'Movie', createdAt: new Date() }],
        [{ id: '1', fullName: 'User', email: 'user@test.com', createdAt: new Date() }],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      const { container } = render(await Page())

      const sections = container.querySelectorAll('section')
      expect(sections).toHaveLength(2) // Recent Movies and Recent Users
    })
  })

  describe('Edge Cases', () => {
    it('should handle very large numbers', async () => {
      const mockStats = [
        [{ count: 999999 }],
        [{ count: 888888 }],
        [{ count: 777777 }],
        [{ total: 9999999.99 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText('999999')).toBeInTheDocument()
      expect(screen.getByText('888888')).toBeInTheDocument()
      expect(screen.getByText('777777')).toBeInTheDocument()
      expect(screen.getByText('$9,999,999.99')).toBeInTheDocument()
    })

    it('should handle decimal revenue amounts', async () => {
      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1234.567 }],
        [],
        [],
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      // Should round to 2 decimal places
      expect(screen.getByText('$1,234.57')).toBeInTheDocument()
    })

    it('should handle special characters in user names', async () => {
      const recentUsers = [
        {
          id: '1',
          fullName: "O'Brien-Smith",
          email: 'obrien@example.com',
          createdAt: new Date('2024-01-01'),
        },
      ]

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        [],
        recentUsers,
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      expect(screen.getByText("O'Brien-Smith")).toBeInTheDocument()
    })

    it('should handle maximum list items (5 movies and 5 users)', async () => {
      const recentMovies = Array.from({ length: 5 }, (_, i) => ({
        id: `movie-${i}`,
        title: `Movie ${i + 1}`,
        createdAt: new Date(),
      }))

      const recentUsers = Array.from({ length: 5 }, (_, i) => ({
        id: `user-${i}`,
        fullName: `User ${i + 1}`,
        email: `user${i}@example.com`,
        createdAt: new Date(),
      }))

      const mockStats = [
        [{ count: 10 }],
        [{ count: 25 }],
        [{ count: 50 }],
        [{ total: 1000 }],
        recentMovies,
        recentUsers,
      ]

      global.Promise.all = jest.fn().mockResolvedValue(mockStats) as any
      
      const Page = (await import('@/app/admin/page')).default
      render(await Page())

      // Check all movies are displayed
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`Movie ${i}`)).toBeInTheDocument()
      }

      // Check all users are displayed
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(`User ${i}`)).toBeInTheDocument()
      }
    })
  })
})