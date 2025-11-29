import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MovieBuy from '@/components/MovieBuy';
import { purchaseMovie } from '@/lib/actions/movie';

// mock next/navigation
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh: mockRefresh,
    push: jest.fn(),
  }),
}));

// mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// mock server action
jest.mock('@/lib/actions/movie', () => ({
  purchaseMovie: jest.fn(),
}));

describe('MovieBuy Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const defaultProps = {
    userId: 'user-123',
    movieId: 'movie-456',
  };

  it('should render initial state', () => {
    render(<MovieBuy {...defaultProps} />);

    expect(screen.getByText('Add Movie to My Library')).toBeInTheDocument();
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should show loading state during purchase', async () => {
    (purchaseMovie as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<MovieBuy {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Adding ...')).toBeInTheDocument();
    expect(button).toBeDisabled();
  });

  it('should show success state after successful purchase', async () => {
    (purchaseMovie as jest.Mock).mockResolvedValue({ success: true });

    render(<MovieBuy {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Added to Library!')).toBeInTheDocument();
      expect(screen.getByText('Movie added successfully!')).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    // wait for timeout and refresh
    jest.advanceTimersByTime(1500);

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalled();
    });
  });

  it('should show error message on failed purchase', async () => {
    (purchaseMovie as jest.Mock).mockResolvedValue({
      success: false,
      error: 'Movie not found',
    });

    render(<MovieBuy {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Movie not found')).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });
  });

  it('should handle purchase errors', async () => {
    (purchaseMovie as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<MovieBuy {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('An error occurred while adding the movie')).toBeInTheDocument();
    });
  });

  it('should not allow multiple clicks during purchase', async () => {
    (purchaseMovie as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ success: true }), 100))
    );

    render(<MovieBuy {...defaultProps} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.click(button); // second click should be ignored

    expect(purchaseMovie).toHaveBeenCalledTimes(1);
  });
});

