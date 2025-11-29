import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from '@/components/AuthForm';
import { signInSchema, signUpSchema } from '@/lib/validations';

// mock next/navigation
const mockPush = jest.fn();
const mockRefresh = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// mock window.alert
global.alert = jest.fn();

describe('AuthForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Sign In Form', () => {
    const mockOnSubmit = jest.fn();

    it('should render sign in form correctly', () => {
      render(
        <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Welcome back to Cinemark')).toBeInTheDocument();
      expect(screen.getByText('Access movies!')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('should show validation errors for invalid input', async () => {
      render(
        <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      const submitButton = screen.getByRole('button', { name: /sign in/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).not.toHaveBeenCalled();
      });
    });

    it('should submit form with valid data', async () => {
      mockOnSubmit.mockResolvedValue({ success: true });

      render(
        <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should show error alert on failed submission', async () => {
      mockOnSubmit.mockResolvedValue({ success: false, error: 'Invalid credentials' });

      render(
        <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign in/i });

      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(global.alert).toHaveBeenCalledWith('Invalid credentials');
        expect(mockPush).not.toHaveBeenCalled();
      });
    });

    it('should have link to sign up page', () => {
      render(
        <AuthForm
          type="SIGN_IN"
          schema={signInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      const link = screen.getByRole('link', { name: /create an account/i });
      expect(link).toHaveAttribute('href', '/sign-up');
    });
  });

  describe('Sign Up Form', () => {
    const mockOnSubmit = jest.fn();

    it('should render sign up form correctly', () => {
      render(
        <AuthForm
          type="SIGN_UP"
          schema={signUpSchema}
          defaultValues={{ fullName: '', email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      expect(screen.getByText('Create your cinema account')).toBeInTheDocument();
      expect(screen.getByText('Please complete all fields.')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('should submit form with valid data', async () => {
      mockOnSubmit.mockResolvedValue({ success: true });

      render(
        <AuthForm
          type="SIGN_UP"
          schema={signUpSchema}
          defaultValues={{ fullName: '', email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      const fullNameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const passwordInput = screen.getByLabelText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up/i });

      fireEvent.change(fullNameInput, { target: { value: 'John Doe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          fullName: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });
        expect(mockPush).toHaveBeenCalledWith('/');
      });
    });

    it('should have link to sign in page', () => {
      render(
        <AuthForm
          type="SIGN_UP"
          schema={signUpSchema}
          defaultValues={{ fullName: '', email: '', password: '' }}
          onSubmit={mockOnSubmit}
        />
      );

      const link = screen.getByRole('link', { name: /sign in/i });
      expect(link).toHaveAttribute('href', '/sign-in');
    });
  });
});

