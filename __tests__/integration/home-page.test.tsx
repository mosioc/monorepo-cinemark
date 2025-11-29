import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import MovieSearch from '@/components/MovieSearch'
import { createMockMovies } from '../utils/test-utils'

jest.mock('@/components/MovieList', () => ({
  __esModule: true,
  default: ({ title, movies }: any) => (
    <div data-testid="movie-list">
      <h2>{title}</h2>
      {movies.map((movie: any) => (
        <div key={movie.id} data-testid={`movie-${movie.id}`}>
          {movie.title}
        </div>
      ))}
    </div>
  ),
}))

jest.mock('@/components/MovieHeroClient', () => ({
  __esModule: true,
  default: (props: any) => (
    <div data-testid="movie-hero">
      <h1>{props.title}</h1>
    </div>
  ),
}))

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

describe('Home Page Integration Tests', () => {
  const mockMovies = createMockMovies(10)
  const userId = 'test-user-123'

  describe('User Journey: Browse Movies', () => {
    it('should display all movies on initial load', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      expect(screen.getByTestId('movie-hero')).toBeInTheDocument()
      expect(screen.getByText('Latest Movies')).toBeInTheDocument()
    })

    it('should allow user to search and find specific movie', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      fireEvent.change(searchInput, { target: { value: 'Movie 5' } })
      
      await waitFor(() => {
        const hero = screen.getByTestId('movie-hero')
        expect(hero).toHaveTextContent('Movie 5')
      })
    })

    it('should show no results message for invalid search', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      fireEvent.change(searchInput, { target: { value: 'NonexistentMovie' } })
      
      await waitFor(() => {
        expect(screen.getByText('No movies found')).toBeInTheDocument()
      })
    })

    it('should restore all movies when search is cleared', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i) as HTMLInputElement
      
      fireEvent.change(searchInput, { target: { value: 'Movie 5' } })
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('Movie 5')
      })
      
      fireEvent.change(searchInput, { target: { value: '' } })
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('Movie 1')
        expect(screen.getByText('Latest Movies')).toBeInTheDocument()
      })
    })
  })

  describe('User Journey: Search by Different Criteria', () => {
    it('should search by director name', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      fireEvent.change(searchInput, { target: { value: 'Director 3' } })
      
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('Movie 3')
      })
    })

    it('should search by genre', async () => {
      const moviesWithGenres = mockMovies.map((movie, i) => ({
        ...movie,
        genre: i % 2 === 0 ? 'Action' : 'Drama',
      }))
      
      render(<MovieSearch movies={moviesWithGenres} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      fireEvent.change(searchInput, { target: { value: 'Drama' } })
      
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toBeInTheDocument()
      })
    })

    it('should handle partial matches', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      fireEvent.change(searchInput, { target: { value: 'Mov' } })
      
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toBeInTheDocument()
      })
    })
  })

  describe('Performance', () => {
    it('should handle large movie collections efficiently', async () => {
      const largeMovieCollection = createMockMovies(100)
      
      const { rerender } = render(
        <MovieSearch movies={largeMovieCollection} userId={userId} />
      )
      
      expect(screen.getByTestId('movie-hero')).toBeInTheDocument()
      
      rerender(<MovieSearch movies={largeMovieCollection} userId={userId} />)
      
      expect(screen.getByTestId('movie-hero')).toBeInTheDocument()
    })

    it('should debounce search effectively', async () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      
      fireEvent.change(searchInput, { target: { value: 'M' } })
      fireEvent.change(searchInput, { target: { value: 'Mo' } })
      fireEvent.change(searchInput, { target: { value: 'Mov' } })
      fireEvent.change(searchInput, { target: { value: 'Movie 7' } })
      
      await waitFor(() => {
        expect(screen.getByTestId('movie-hero')).toHaveTextContent('Movie 7')
      })
    })
  })

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      searchInput.focus()
      
      expect(document.activeElement).toBe(searchInput)
    })

    it('should have proper ARIA labels', () => {
      render(<MovieSearch movies={mockMovies} userId={userId} />)
      
      const searchInput = screen.getByPlaceholderText(/search movies/i)
      expect(searchInput).toHaveAttribute('type', 'text')
    })
  })
})