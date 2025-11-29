import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '@/components/Header';

// mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => <img src={src} alt={alt} {...props} />,
}));

// mock auth
jest.mock('@/auth', () => ({
  signOut: jest.fn(),
}));

describe('Header Component', () => {
  it('should render header with logo', () => {
    render(<Header />);

    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/icons/logo.svg');
  });

  it('should have link to home page', () => {
    render(<Header />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('should render logout button', () => {
    render(<Header />);

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });
});

