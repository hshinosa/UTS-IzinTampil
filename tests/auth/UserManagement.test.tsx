import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserManagement from '../../app/components/auth/UserManagement';

// Mock the useAuth hook
const mockUser = {
  id: '1',
  name: 'Admin User',
  email: 'admin@example.com',
  role: 'admin' as const,
  createdAt: '2024-01-01',
  lastLogin: new Date().toISOString()
};

jest.mock('../../app/components/auth/UserAuth', () => ({
  useAuth: () => ({
    user: mockUser
  })
}));

describe('UserManagement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders user management page for admin users', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Manajemen Pengguna')).toBeInTheDocument();
      expect(screen.getByText('Kelola pengguna dan izin akses sistem')).toBeInTheDocument();
    });
  });

  it('displays user statistics cards', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Total Pengguna')).toBeInTheDocument();
      expect(screen.getByText('Admin')).toBeInTheDocument();
      expect(screen.getByText('User')).toBeInTheDocument();
    });
  });

  it('shows search and filter controls', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Cari pengguna...')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument(); // Role filter
      expect(screen.getByText('Tambah Pengguna')).toBeInTheDocument();
    });
  });

  it('displays users table', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('admin@example.com')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
      expect(screen.getByText('user@example.com')).toBeInTheDocument();
    });
  });

  it('shows role badges correctly', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      const adminBadges = screen.getAllByText('admin');
      const userBadges = screen.getAllByText('user');
      
      expect(adminBadges.length).toBeGreaterThan(0);
      expect(userBadges.length).toBeGreaterThan(0);
    });
  });

  it('filters users by search term', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Cari pengguna...');
    fireEvent.change(searchInput, { target: { value: 'jane' } });

    await waitFor(() => {
      expect(screen.queryByText('Admin User')).not.toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('filters users by role', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.getByText('Regular User')).toBeInTheDocument();
    });

    const roleFilter = screen.getByRole('combobox');
    fireEvent.change(roleFilter, { target: { value: 'admin' } });

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
      expect(screen.queryByText('Regular User')).not.toBeInTheDocument();
    });
  });

  it('shows loading state initially', () => {
    render(<UserManagement />);

    expect(screen.getByText('Memuat data pengguna...')).toBeInTheDocument();
  });

  it('displays access denied for non-admin users', () => {
    jest.mock('../../app/components/auth/UserAuth', () => ({
      useAuth: () => ({
        user: {
          ...mockUser,
          role: 'user' as const
        }
      })
    }));

    render(<UserManagement />);

    expect(screen.getByText('Akses Ditolak')).toBeInTheDocument();
    expect(screen.getByText('Anda tidak memiliki izin untuk mengakses halaman ini')).toBeInTheDocument();
  });

  it('formats dates correctly', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      // Check that dates are formatted in Indonesian locale
      expect(screen.getByText(/1 Januari 2024/)).toBeInTheDocument();
    });
  });

  it('has edit and delete buttons for users', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Hapus');
      
      expect(editButtons.length).toBeGreaterThan(0);
      expect(deleteButtons.length).toBeGreaterThan(0);
    });
  });

  it('prevents deletion of current user', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      // Current user should not have delete button
      const userRows = screen.getAllByText('Admin User');
      const userRow = userRows.find(row => 
        row.closest('tr')?.querySelector('td')?.textContent?.includes('admin@example.com')
      );
      
      if (userRow) {
        const deleteButton = userRow.closest('tr')?.querySelector('button:contains("Hapus")');
        expect(deleteButton).not.toBeInTheDocument();
      }
    });
  });

  it('shows no users message when filtered results are empty', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Admin User')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Cari pengguna...');
    fireEvent.change(searchInput, { target: { value: 'nonexistentuser' } });

    await waitFor(() => {
      expect(screen.getByText('Tidak ada pengguna yang ditemukan')).toBeInTheDocument();
    });
  });

  it('has proper table headers', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText('Pengguna')).toBeInTheDocument();
      expect(screen.getByText('Role')).toBeInTheDocument();
      expect(screen.getByText('Bergabung')).toBeInTheDocument();
      expect(screen.getByText('Terakhir Login')).toBeInTheDocument();
    });
  });

  it('displays user avatars with initials', async () => {
    render(<UserManagement />);

    await waitFor(() => {
      // Check that user avatars show initials
      const adminAvatar = screen.getByText('A'); // Admin User initial
      const userAvatar = screen.getByText('R'); // Regular User initial
      
      expect(adminAvatar).toBeInTheDocument();
      expect(userAvatar).toBeInTheDocument();
    });
  });
});