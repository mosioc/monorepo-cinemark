import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieCard from '@/components/MovieCard';

// mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// mock MovieCover component
jest.mock('@/components/MovieCover', () => ({
  __esModule: true,
  default: ({ coverColor, coverImage }: any) => (
    <div data-testid="movie-cover" style={{ backgroundColor: coverColor }}>
      <img src={coverImage} alt="cover" />
    </div>
  ),
}));

describe('MovieCard Component', () => {
  const mockMovie: Movie = {
    id: 'movie-123',
    title: 'Test Movie',
    genre: 'Action',
    coverColor: '#FF5733',
    coverUrl: 'https://example.com/cover.jpg',
    isPurchased: false,
  };

  it('should render movie card correctly', () => {
    render(<MovieCard {...mockMovie} />);

    expect(screen.getByText('Test Movie')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByTestId('movie-cover')).toBeInTheDocument();
  });

  it('should render link to movie detail page', () => {
    render(<MovieCard {...mockMovie} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/movies/movie-123');
  });

  it('should show purchased state when isPurchased is true', () => {
    render(<MovieCard {...mockMovie} isPurchased={true} />);

    expect(screen.getByText('11 days left to return')).toBeInTheDocument();
    expect(screen.getByText('Download receipt')).toBeInTheDocument();
  });

  it('should not show purchased elements when isPurchased is false', () => {
    render(<MovieCard {...mockMovie} isPurchased={false} />);

    expect(screen.queryByText('11 days left to return')).not.toBeInTheDocument();
    expect(screen.queryByText('Download receipt')).not.toBeInTheDocument();
  });
});

