import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../../app/components/auth/UserAuth';

// Test component to access auth context
function TestComponent() {
  const { user, login, register, logout, isLoading, error } = useAuth();
  
  return (
    <div>
      <div data-testid="user-info">
        {user ? `Logged in as ${user.name}` : 'Not logged in'}
      </div>
      <div data-testid="loading-info">
        {isLoading ? 'Loading...' : 'Not loading'}
      </div>
      <div data-testid="error-info">
        {error || 'No error'}
      </div>
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={() => register('Test User', 'test@example.com', 'password')}>
        Register
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  );
}

describe('UserAuth Context', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides auth context with default values', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
    expect(screen.getByTestId('loading-info')).toHaveTextContent('Not loading');
    expect(screen.getByTestId('error-info')).toHaveTextContent('No error');
  });

  it('handles login successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    expect(screen.getByTestId('loading-info')).toHaveTextContent('Loading...');

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as Regular User');
      expect(screen.getByTestId('loading-info')).toHaveTextContent('Not loading');
    }, { timeout: 2000 });
  });

  it('handles login failure', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('Email atau password salah');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
    }, { timeout: 2000 });
  });

  it('handles registration successfully', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    expect(screen.getByTestId('loading-info')).toHaveTextContent('Loading...');

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as Test User');
      expect(screen.getByTestId('loading-info')).toHaveTextContent('Not loading');
    }, { timeout: 2000 });
  });

  it('handles registration with existing email', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const registerButton = screen.getByText('Register');
    fireEvent.click(registerButton);

    await waitFor(() => {
      expect(screen.getByTestId('error-info')).toHaveTextContent('Email sudah terdaftar');
      expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
    }, { timeout: 2000 });
  });

  it('handles logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // First login
    const loginButton = screen.getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as Regular User');
    }, { timeout: 2000 });

    // Then logout
    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logout);

    expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
  });

  it('persists user session in localStorage', () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user' as const,
      createdAt: '2024-01-01'
    };

    localStorage.setItem('auth-user', JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-info')).toHaveTextContent('Logged in as Test User');
  });

  it('handles corrupted localStorage data', () => {
    localStorage.setItem('auth-user', 'invalid-json');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user-info')).toHaveTextContent('Not logged in');
    expect(localStorage.getItem('auth-user')).toBeNull();
  });
});