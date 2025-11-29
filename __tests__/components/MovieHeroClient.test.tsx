import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import MovieHeroClient from '@/components/MovieHeroClient'

// Mock child components
jest.mock('@/components/MovieCover', () => ({
  __esModule: true,
  default: ({ variant, className, coverColor, coverImage }: any) => (
    <div
      data-testid="movie-cover"
      data-variant={variant}
      data-color={coverColor}
      data-image={coverImage}
      className={className}
    >
      Movie Cover
    </div>
  ),
}))

jest.mock('@/components/MovieBuy', () => ({
  __esModule: true,
  default: ({ movieId, userId }: any) => (
    <div data-testid="movie-buy" data-movie-id={movieId} data-user-id={userId}>
      Buy Button
    </div>
  ),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, ...props }: any) => (
    <img src={src} alt={alt} width={width} height={height} {...props} />
  ),
}))

const mockMovie: Movie & { userId: string } = {
  id: 'movie-123',
  title: 'The Matrix',
  director: 'Wachowski Sisters',
  genre: 'Sci-Fi',
  rating: 8.7,
  description: 'A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.',
  coverColor: '#000000',
  coverUrl: '/matrix-cover.jpg',
  price: 9.99,
  totalPurchases: 1000,
  createdAt: new Date('2024-01-01'),
  userId: 'user-456',
}

describe('MovieHeroClient Component', () => {
  describe('Rendering', () => {
    it('should render the movie title', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toHaveTextContent('The Matrix')
    })

    it('should render the director information', () => {
      render(<MovieHeroClient {...mockMovie} />)
      expect(screen.getByText('By')).toBeInTheDocument()
      expect(screen.getByText('Wachowski Sisters')).toBeInTheDocument()
    })

    it('should render the genre information', () => {
      render(<MovieHeroClient {...mockMovie} />)
      expect(screen.getByText('Category')).toBeInTheDocument()
      expect(screen.getByText('Sci-Fi')).toBeInTheDocument()
    })

    it('should render the rating', () => {
      render(<MovieHeroClient {...mockMovie} />)
      expect(screen.getByText('8.7')).toBeInTheDocument()
    })

    it('should render the star icon for rating', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const starIcon = screen.getByAlt('star')
      expect(starIcon).toBeInTheDocument()
      expect(starIcon).toHaveAttribute('src', '/icons/star.svg')
      expect(starIcon).toHaveAttribute('width', '22')
      expect(starIcon).toHaveAttribute('height', '22')
    })

    it('should render the movie description', () => {
      render(<MovieHeroClient {...mockMovie} />)
      expect(screen.getByText(mockMovie.description)).toBeInTheDocument()
    })

    it('should render the MovieBuy component with correct props', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const buyButton = screen.getByTestId('movie-buy')
      expect(buyButton).toBeInTheDocument()
      expect(buyButton).toHaveAttribute('data-movie-id', 'movie-123')
      expect(buyButton).toHaveAttribute('data-user-id', 'user-456')
    })
  })

  describe('Movie Cover Rendering', () => {
    it('should render main movie cover with correct props', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const covers = screen.getAllByTestId('movie-cover')
      const mainCover = covers.find((cover) => cover.classList.contains('z-10'))
      
      expect(mainCover).toBeInTheDocument()
      expect(mainCover).toHaveAttribute('data-variant', 'wide')
      expect(mainCover).toHaveAttribute('data-color', '#000000')
      expect(mainCover).toHaveAttribute('data-image', '/matrix-cover.jpg')
    })

    it('should render background decorative cover', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const covers = screen.getAllByTestId('movie-cover')
      
      // Should have 2 covers (main + decorative)
      expect(covers).toHaveLength(2)
      
      const decorativeCover = covers.find((cover) => 
        cover.parentElement?.classList.contains('opacity-40')
      )
      expect(decorativeCover).toBeInTheDocument()
    })

    it('should pass same cover properties to both covers', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const covers = screen.getAllByTestId('movie-cover')
      
      covers.forEach((cover) => {
        expect(cover).toHaveAttribute('data-variant', 'wide')
        expect(cover).toHaveAttribute('data-color', '#000000')
        expect(cover).toHaveAttribute('data-image', '/matrix-cover.jpg')
      })
    })
  })

  describe('CSS Classes and Styling', () => {
    it('should apply movie-overview class to main section', () => {
      const { container } = render(<MovieHeroClient {...mockMovie} />)
      const section = container.querySelector('section')
      expect(section).toHaveClass('movie-overview')
    })

    it('should apply movie-info class to info container', () => {
      const { container } = render(<MovieHeroClient {...mockMovie} />)
      const infoDiv = container.querySelector('.movie-info')
      expect(infoDiv).toBeInTheDocument()
    })

    it('should apply movie-description class to description', () => {
      const { container } = render(<MovieHeroClient {...mockMovie} />)
      const description = container.querySelector('.movie-description')
      expect(description).toBeInTheDocument()
      expect(description).toHaveTextContent(mockMovie.description)
    })
  })

  describe('Edge Cases and Data Validation', () => {
    it('should handle empty title', () => {
      const movieWithEmptyTitle = { ...mockMovie, title: '' }
      render(<MovieHeroClient {...movieWithEmptyTitle} />)
      const title = screen.getByRole('heading', { level: 1 })
      expect(title).toBeInTheDocument()
    })

    it('should handle empty director', () => {
      const movieWithEmptyDirector = { ...mockMovie, director: '' }
      render(<MovieHeroClient {...movieWithEmptyDirector} />)
      expect(screen.getByText('By')).toBeInTheDocument()
    })

    it('should handle empty genre', () => {
      const movieWithEmptyGenre = { ...mockMovie, genre: '' }
      render(<MovieHeroClient {...movieWithEmptyGenre} />)
      expect(screen.getByText('Category')).toBeInTheDocument()
    })

    it('should handle zero rating', () => {
      const movieWithZeroRating = { ...mockMovie, rating: 0 }
      render(<MovieHeroClient {...movieWithZeroRating} />)
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('should handle very long description', () => {
      const longDescription = 'A'.repeat(1000)
      const movieWithLongDesc = { ...mockMovie, description: longDescription }
      render(<MovieHeroClient {...movieWithLongDesc} />)
      expect(screen.getByText(longDescription)).toBeInTheDocument()
    })

    it('should handle special characters in title', () => {
      const titleWithSpecialChars = 'The Matrix: Reloaded & Revolutions'
      const movie = { ...mockMovie, title: titleWithSpecialChars }
      render(<MovieHeroClient {...movie} />)
      expect(screen.getByText(titleWithSpecialChars)).toBeInTheDocument()
    })

    it('should handle unicode characters', () => {
      const movie = {
        ...mockMovie,
        title: 'El Laberinto del Fauno',
        director: 'Guillermo del Toro',
        description: 'Una película española con acentos y ñ',
      }
      render(<MovieHeroClient {...movie} />)
      expect(screen.getByText('El Laberinto del Fauno')).toBeInTheDocument()
      expect(screen.getByText('Guillermo del Toro')).toBeInTheDocument()
    })

    it('should handle decimal ratings', () => {
      const movie = { ...mockMovie, rating: 9.123456 }
      render(<MovieHeroClient {...movie} />)
      expect(screen.getByText('9.123456')).toBeInTheDocument()
    })

    it('should handle different cover colors', () => {
      const movie = { ...mockMovie, coverColor: '#FF5733' }
      render(<MovieHeroClient {...movie} />)
      const covers = screen.getAllByTestId('movie-cover')
      covers.forEach((cover) => {
        expect(cover).toHaveAttribute('data-color', '#FF5733')
      })
    })

    it('should handle different cover URLs', () => {
      const movie = { ...mockMovie, coverUrl: 'https://example.com/cover.jpg' }
      render(<MovieHeroClient {...movie} />)
      const covers = screen.getAllByTestId('movie-cover')
      covers.forEach((cover) => {
        expect(cover).toHaveAttribute('data-image', 'https://example.com/cover.jpg')
      })
    })
  })

  describe('Component Structure', () => {
    it('should have proper semantic HTML structure', () => {
      const { container } = render(<MovieHeroClient {...mockMovie} />)
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
      expect(section?.tagName).toBe('SECTION')
    })

    it('should render movie info before buy button', () => {
      const { container } = render(<MovieHeroClient {...mockMovie} />)
      const buyButton = screen.getByTestId('movie-buy')
      const description = screen.getByText(mockMovie.description)
      
      // Compare positions in DOM
      const buyButtonPosition = Array.from(container.querySelectorAll('*')).indexOf(buyButton)
      const descriptionPosition = Array.from(container.querySelectorAll('*')).indexOf(description)
      
      expect(descriptionPosition).toBeLessThan(buyButtonPosition)
    })

    it('should render text content before cover images', () => {
      const { container } = render(<MovieHeroClient {...mockMovie} />)
      const allElements = Array.from(container.querySelectorAll('*'))
      
      const title = screen.getByRole('heading', { level: 1 })
      const covers = screen.getAllByTestId('movie-cover')
      
      const titlePosition = allElements.indexOf(title)
      const firstCoverPosition = allElements.indexOf(covers[0])
      
      expect(titlePosition).toBeLessThan(firstCoverPosition)
    })
  })

  describe('Props Passing', () => {
    it('should handle all required props', () => {
      const requiredProps = {
        id: 'test-id',
        title: 'Test Title',
        director: 'Test Director',
        genre: 'Test Genre',
        rating: 5.0,
        description: 'Test Description',
        coverColor: '#FFFFFF',
        coverUrl: '/test.jpg',
        userId: 'test-user',
        price: 10.0,
        totalPurchases: 0,
        createdAt: new Date(),
      }
      
      render(<MovieHeroClient {...requiredProps} />)
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Director')).toBeInTheDocument()
      expect(screen.getByText('Test Genre')).toBeInTheDocument()
      expect(screen.getByText('5')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
    })
  })

  describe('Integration with Child Components', () => {
    it('should pass movieId and userId to MovieBuy', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const buyButton = screen.getByTestId('movie-buy')
      expect(buyButton.dataset.movieId).toBe(mockMovie.id)
      expect(buyButton.dataset.userId).toBe(mockMovie.userId)
    })

    it('should pass cover properties to MovieCover', () => {
      render(<MovieHeroClient {...mockMovie} />)
      const covers = screen.getAllByTestId('movie-cover')
      
      covers.forEach((cover) => {
        expect(cover.dataset.color).toBe(mockMovie.coverColor)
        expect(cover.dataset.image).toBe(mockMovie.coverUrl)
        expect(cover.dataset.variant).toBe('wide')
      })
    })
  })
})