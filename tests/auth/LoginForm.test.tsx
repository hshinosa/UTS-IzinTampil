import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from '../../app/components/auth/LoginForm';

// Mock the useAuth hook
const mockLogin = jest.fn();
jest.mock('../../app/components/auth/UserAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: false,
    error: null
  })
}));

describe('LoginForm Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(<LoginForm />);

    expect(screen.getByText('Masuk ke Akun Anda')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument();
  });

  it('shows registration link', () => {
    render(<LoginForm />);

    const registerLink = screen.getByText('daftar akun baru');
    expect(registerLink).toBeInTheDocument();
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('toggles password visibility', () => {
    render(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText('Password');
    const toggleButton = screen.getByRole('button');

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to show password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to hide password
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('submits form with correct data', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText('Email address');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Masuk' });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('prevents form submission with empty fields', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'Masuk' });
    fireEvent.click(submitButton);

    // Login should not be called with empty fields
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('displays error message when login fails', () => {
    jest.mock('../../app/components/auth/UserAuth', () => ({
      useAuth: () => ({
        login: mockLogin,
        isLoading: false,
        error: 'Email atau password salah'
      })
    }));

    render(<LoginForm />);

    expect(screen.getByText('Email atau password salah')).toBeInTheDocument();
  });

  it('shows loading state during login', () => {
    jest.mock('../../app/components/auth/UserAuth', () => ({
      useAuth: () => ({
        login: mockLogin,
        isLoading: true,
        error: null
      })
    }));

    render(<LoginForm />);

    expect(screen.getByText('Memproses...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeDisabled();
  });

  it('displays demo account information', () => {
    render(<LoginForm />);

    expect(screen.getByText('Akun Demo')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('User')).toBeInTheDocument();
    expect(screen.getByText('admin@example.com')).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByText('admin123')).toBeInTheDocument();
    expect(screen.getByText('user123')).toBeInTheDocument();
  });

  it('has remember me checkbox', () => {
    render(<LoginForm />);

    const rememberCheckbox = screen.getByLabelText('Ingat saya');
    expect(rememberCheckbox).toBeInTheDocument();
    expect(rememberCheckbox).not.toBeChecked();
  });

  it('has forgot password link', () => {
    render(<LoginForm />);

    const forgotLink = screen.getByText('Lupa password?');
    expect(forgotLink).toBeInTheDocument();
  });

  it('form has proper accessibility attributes', () => {
    render(<LoginForm />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');

    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('autoComplete', 'email');
    expect(emailInput).toHaveAttribute('required');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(passwordInput).toHaveAttribute('autoComplete', 'current-password');
    expect(passwordInput).toHaveAttribute('required');
  });
});