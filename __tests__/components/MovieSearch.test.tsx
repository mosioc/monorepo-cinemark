import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MovieSearch from '@/components/MovieSearch'

// Mock the child components
jest.mock('@/components/MovieList', () => ({
  __esModule: true,
  default: ({ title, movies, containerClassName }: any) => (
    <div data-testid="movie-list" className={containerClassName}>
      <h2>{title}</h2>
      <div data-testid="movie-count">{movies.length}</div>
    </div>
  ),
}))

jest.mock('@/components/MovieHeroClient', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="movie-hero">
      <h1>{props.title}</h1>
      <p>{props.director}</p>
      <p>{props.userId}</p>
    </div>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: ({ value, onChange, placeholder, className, ...props }: any) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      {...props}
    />
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}))

const mockMovies: Movie[] = [
  {
    id: '1',
    title: 'The Matrix',
    director: 'Wachowski Sisters',
    genre: 'Sci-Fi',
    rating: 8.7,
    description: 'A computer hacker learns about the true nature of reality.',
    coverColor: '#000000',
    coverUrl: '/matrix.jpg',
    price: 9.99,
    totalPurchases: 100,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Inception',
    director: 'Christopher Nolan',
    genre: 'Thriller',
    rating: 8.8,
    description: 'A thief who steals corporate secrets through dream-sharing technology.',
    coverColor: '#1a1a1a',
    coverUrl: '/inception.jpg',
    price: 12.99,
    totalPurchases: 150,
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'Interstellar',
    director: 'Christopher Nolan',
    genre: 'Sci-Fi',
    rating: 8.6,
    description: 'A team of explorers travel through a wormhole in space.',
    coverColor: '#2a2a2a',
    coverUrl: '/interstellar.jpg',
    price: 11.99,
    totalPurchases: 120,
    createdAt: new Date('2024-01-03'),
  },
]

describe('MovieSearch Component', () => {
  const userId = 'test-user-123'

  describe('Initial Render', () => {
    it('should render the search input', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      expect(searchInput).toBeInTheDocument()
    })

    it('should render the search icon', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchIcon = screen.getByAlt('search')
      expect(searchIcon).toBeInTheDocument()
      expect(searchIcon).toHaveAttribute('src', '/icons/search-fill.svg')
    })

    it('should display hero movie and other movies when no search query', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      // Hero movie should be displayed
      const heroMovie = screen.getByTestId('movie-hero')
      expect(heroMovie).toBeInTheDocument()
      expect(heroMovie).toHaveTextContent('The Matrix')
      
      // Other movies should be displayed in MovieList
      const movieList = screen.getByTestId('movie-list')
      expect(movieList).toBeInTheDocument()
      expect(screen.getByText('Latest Movies')).toBeInTheDocument()
    })

    it('should pass correct userId to MovieHeroClient', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const heroMovie = screen.getByTestId('movie-hero')
      expect(heroMovie).toHaveTextContent(userId)
    })
  })

  describe('Search Functionality', () => {
    it('should filter movies by title', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'inception' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('Inception')
      })
    })

    it('should filter movies by director', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'wachowski' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('The Matrix')
        expect(heroMovie).toHaveTextContent('Wachowski Sisters')
      })
    })

    it('should filter movies by genre', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'thriller' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('Inception')
      })
    })

    it('should be case-insensitive', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'MATRIX' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('The Matrix')
      })
    })

    it('should trim whitespace from search query', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: '  matrix  ' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('The Matrix')
      })
    })

    it('should update search results in real-time', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      // First search
      fireEvent.change(searchInput, { target: { value: 'matrix' } })
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('The Matrix')
      })
      
      // Second search
      fireEvent.change(searchInput, { target: { value: 'inception' } })
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('Inception')
      })
    })
  })

  describe('Search Results Display', () => {
    it('should show "Search Results" title when searching', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'nolan' } })
      
      await waitFor(() => {
        expect(screen.getByText('Search Results')).toBeInTheDocument()
      })
    })

    it('should show "Latest Movies" title when not searching', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      expect(screen.getByText('Latest Movies')).toBeInTheDocument()
    })

    it('should display remaining movies after hero in search results', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'nolan' } })
      
      await waitFor(() => {
        const movieCount = screen.getByTestId('movie-count')
        // Nolan has 2 movies, hero shows 1, list shows the remaining 1
        expect(movieCount).toHaveTextContent('1')
      })
    })
  })

  describe('No Results Handling', () => {
    it('should show "No movies found" message when search yields no results', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'nonexistent movie' } })
      
      await waitFor(() => {
        expect(screen.getByText('No movies found')).toBeInTheDocument()
        expect(screen.getByText('Try searching with different keywords')).toBeInTheDocument()
      })
    })

    it('should not show hero or movie list when no results', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'xyz123' } })
      
      await waitFor(() => {
        expect(screen.queryByTestId('movie-hero')).not.toBeInTheDocument()
        expect(screen.queryByTestId('movie-list')).not.toBeInTheDocument()
      })
    })

    it('should not show no results message when not searching', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      expect(screen.queryByText('No movies found')).not.toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty movies array', () => {
      render(<MovieSearch movies={[]} userId={userId} />)
      expect(screen.queryByTestId('movie-hero')).not.toBeInTheDocument()
      expect(screen.queryByTestId('movie-list')).not.toBeInTheDocument()
    })

    it('should handle single movie in array', () => {
      render(<MovieSearch movies={[mockMovies[0]]} userId={userId} />)
      
      const heroMovie = screen.getByTestId('movie-hero')
      expect(heroMovie).toBeInTheDocument()
      expect(heroMovie).toHaveTextContent('The Matrix')
      
      // No other movies to display
      expect(screen.queryByTestId('movie-list')).not.toBeInTheDocument()
    })

    it('should handle empty search query (only whitespace)', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: '   ' } })
      
      // Should show all movies as if no search
      expect(screen.getByTestId('movie-hero')).toHaveTextContent('The Matrix')
      expect(screen.getByText('Latest Movies')).toBeInTheDocument()
    })

    it('should handle special characters in search', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'sci-fi' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('The Matrix')
      })
    })

    it('should handle partial word matches', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'inter' } })
      
      await waitFor(() => {
        const heroMovie = screen.getByTestId('movie-hero')
        expect(heroMovie).toHaveTextContent('Interstellar')
      })
    })

    it('should clear search when input is cleared', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i) as HTMLInputElement
      
      // Enter search
      fireEvent.change(searchInput, { target: { value: 'inception' } })
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('Inception')
      })
      
      // Clear search
      fireEvent.change(searchInput, { target: { value: '' } })
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('The Matrix')
        expect(screen.getByText('Latest Movies')).toBeInTheDocument()
      })
    })
  })

  describe('Performance and Memoization', () => {
    it('should not re-filter when search query has not changed', () => {
      const { rerender } = render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      fireEvent.change(searchInput, { target: { value: 'matrix' } })
      
      // Force re-render without changing search
      rerender(<MovieSearch movies={mockMovies} userId={userId} />)
      
      // Should still show Matrix as hero
      expect(screen.getByTestId('movie-hero')).toHaveTextContent('The Matrix')
    })

    it('should handle rapid consecutive searches', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      // Rapid fire searches
      fireEvent.change(searchInput, { target: { value: 'm' } })
      fireEvent.change(searchInput, { target: { value: 'ma' } })
      fireEvent.change(searchInput, { target: { value: 'mat' } })
      fireEvent.change(searchInput, { target: { value: 'matr' } })
      fireEvent.change(searchInput, { target: { value: 'matrix' } })
      
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('The Matrix')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper input attributes', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      expect(searchInput).toHaveAttribute('type', 'text')
      expect(searchInput).toHaveAttribute('placeholder')
    })

    it('should maintain focus on search input after typing', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      const searchInput = screen.getByPlaceholderText(/search movies by title, director, or genre/i)
      
      searchInput.focus()
      fireEvent.change(searchInput, { target: { value: 'matrix' } })
      
      expect(searchInput).toHaveFocus()
    })
  })
})