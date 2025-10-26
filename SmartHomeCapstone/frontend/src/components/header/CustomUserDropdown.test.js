import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CustomUserDropdown } from './CustomUserDropdown';
import { useClerk, useUser as useClerkUser } from '@clerk/clerk-react';
import { useUser } from '../../context/UserContext';

// Mock dependencies
jest.mock('@clerk/clerk-react');
jest.mock('../../context/UserContext');

describe('CustomUserDropdown Component', () => {
  const mockSignOut = jest.fn();
  const mockOpenUserProfile = jest.fn();

  const mockClerkUser = {
    id: 'user_123',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    username: 'johndoe',
    imageUrl: 'https://example.com/avatar.jpg'
  };

  const mockBackendUser = {
    userId: 1,
    clerkId: 'user_123',
    email: 'test@example.com',
    fullName: 'John Doe',
    username: 'johndoe'
  };

  beforeEach(() => {
    jest.clearAllMocks();

    useClerk.mockReturnValue({
      signOut: mockSignOut,
      openUserProfile: mockOpenUserProfile
    });

    useClerkUser.mockReturnValue({
      user: mockClerkUser,
      isLoaded: true
    });

    useUser.mockReturnValue({
      user: mockClerkUser,
      backendUser: mockBackendUser,
      isLoading: false,
      error: null
    });
  });

  describe('Rendering', () => {
    it('renders user avatar button with user info', () => {
      render(<CustomUserDropdown />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('displays user profile image when available', () => {
      render(<CustomUserDropdown />);

      const avatar = screen.getByAltText('John Doe');
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    });

    it('displays initials when no profile image', () => {
      useClerkUser.mockReturnValue({
        user: { ...mockClerkUser, imageUrl: null },
        isLoaded: true
      });

      render(<CustomUserDropdown />);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('displays dropdown arrow', () => {
      render(<CustomUserDropdown />);

      const arrow = screen.getByRole('button').querySelector('svg');
      expect(arrow).toBeInTheDocument();
    });

    it('dropdown menu is not visible initially', () => {
      render(<CustomUserDropdown />);

      expect(screen.queryByText('Profile Settings')).not.toBeInTheDocument();
    });
  });

  describe('Display Name Logic', () => {
    it('displays backend fullName when available', () => {
      render(<CustomUserDropdown />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays clerk fullName when backend fullName is not available', () => {
      useUser.mockReturnValue({
        user: mockClerkUser,
        backendUser: { ...mockBackendUser, fullName: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('constructs name from firstName and lastName', () => {
      useUser.mockReturnValue({
        user: { ...mockClerkUser, fullName: null },
        backendUser: { ...mockBackendUser, fullName: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    it('displays only firstName when lastName is missing', () => {
      useUser.mockReturnValue({
        user: { ...mockClerkUser, fullName: null, lastName: null },
        backendUser: { ...mockBackendUser, fullName: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('displays backend username as fallback', () => {
      useUser.mockReturnValue({
        user: { ...mockClerkUser, fullName: null, firstName: null, lastName: null },
        backendUser: { ...mockBackendUser, fullName: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('johndoe')).toBeInTheDocument();
    });

    it('displays email prefix as ultimate fallback', () => {
      useUser.mockReturnValue({
        user: { 
          ...mockClerkUser, 
          fullName: null, 
          firstName: null, 
          lastName: null,
          username: null
        },
        backendUser: { ...mockBackendUser, fullName: null, username: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('displays "User" when no name information available', () => {
      useUser.mockReturnValue({
        user: { 
          id: 'user_123',
          fullName: null, 
          firstName: null, 
          lastName: null,
          username: null,
          emailAddresses: []
        },
        backendUser: { ...mockBackendUser, fullName: null, username: null, email: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('User')).toBeInTheDocument();
    });

    it('displays "Loading..." when user data is loading', () => {
      useUser.mockReturnValue({
        user: mockClerkUser,
        backendUser: mockBackendUser,
        isLoading: true,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });
  });

  describe('Initials Generation', () => {
    it('generates initials from two-word name', () => {
      useClerkUser.mockReturnValue({
        user: { ...mockClerkUser, imageUrl: null },
        isLoaded: true
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('generates initials from three-word name', () => {
      useClerkUser.mockReturnValue({
        user: { ...mockClerkUser, fullName: 'John Michael Doe', imageUrl: null },
        isLoaded: true
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('JM')).toBeInTheDocument();
    });

    it('generates single initial from single-word name', () => {
      useUser.mockReturnValue({
        user: { ...mockClerkUser, fullName: null, firstName: 'John', lastName: null, imageUrl: null },
        backendUser: { ...mockBackendUser, fullName: null },
        isLoading: false,
        error: null
      });
      useClerkUser.mockReturnValue({
        user: { ...mockClerkUser, fullName: null, firstName: 'John', lastName: null, imageUrl: null },
        isLoaded: true
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('J')).toBeInTheDocument();
    });
  });

  describe('Dropdown Toggle', () => {
    it('opens dropdown when button is clicked', () => {
      render(<CustomUserDropdown />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(screen.getByText('Help & Support')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('closes dropdown when button is clicked again', () => {
      render(<CustomUserDropdown />);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('rotates arrow when dropdown is open', () => {
      render(<CustomUserDropdown />);

      const button = screen.getByRole('button');
      const arrow = button.querySelector('svg');
      
      expect(arrow).not.toHaveClass('rotated');

      fireEvent.click(button);
      expect(arrow).toHaveClass('rotated');
    });

    it('sets aria-expanded attribute correctly', () => {
      render(<CustomUserDropdown />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-expanded', 'false');

      fireEvent.click(button);
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Dropdown Menu Items', () => {
    beforeEach(() => {
      render(<CustomUserDropdown />);
      fireEvent.click(screen.getByRole('button'));
    });

    it('displays user info in dropdown header', () => {
      expect(screen.getAllByText('John Doe')).toHaveLength(2); // In button and header
      expect(screen.getAllByText('test@example.com')).toHaveLength(2);
    });

    it('displays large avatar in dropdown header', () => {
      const avatars = screen.getAllByAltText('John Doe');
      expect(avatars.length).toBeGreaterThan(1); // Button avatar + header avatar
    });

    it('displays all menu items', () => {
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Profile Settings')).toBeInTheDocument();
      expect(screen.getByText('Help & Support')).toBeInTheDocument();
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });

    it('displays menu item icons', () => {
      expect(screen.getByText('🏠')).toBeInTheDocument();
      expect(screen.getByText('👤')).toBeInTheDocument();
      expect(screen.getByText('❓')).toBeInTheDocument();
      expect(screen.getByText('🚪')).toBeInTheDocument();
    });
  });

  describe('Menu Item Actions', () => {
    beforeEach(() => {
      // Mock window.location
      delete window.location;
      window.location = { href: '' };
    });

    it('navigates to home when Dashboard is clicked', () => {
      render(<CustomUserDropdown />);
      fireEvent.click(screen.getByRole('button'));

      const dashboardButton = screen.getByText('Dashboard').closest('button');
      fireEvent.click(dashboardButton);

      expect(window.location.href).toBe('/');
    });

    it('opens user profile when Profile Settings is clicked', () => {
      render(<CustomUserDropdown />);
      fireEvent.click(screen.getByRole('button'));

      const profileButton = screen.getByText('Profile Settings').closest('button');
      fireEvent.click(profileButton);

      expect(mockOpenUserProfile).toHaveBeenCalled();
    });

    it('navigates to help page when Help & Support is clicked', () => {
      render(<CustomUserDropdown />);
      fireEvent.click(screen.getByRole('button'));

      const helpButton = screen.getByText('Help & Support').closest('button');
      fireEvent.click(helpButton);

      expect(window.location.href).toBe('/help');
    });

    it('calls signOut when Sign Out is clicked', async () => {
      mockSignOut.mockResolvedValue();

      render(<CustomUserDropdown />);
      fireEvent.click(screen.getByRole('button'));

      const signOutButton = screen.getByText('Sign Out').closest('button');
      fireEvent.click(signOutButton);

      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it('closes dropdown after menu item is clicked', () => {
      render(<CustomUserDropdown />);
      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dashboardButton = screen.getByText('Dashboard').closest('button');
      fireEvent.click(dashboardButton);

      // Dropdown should close
      expect(screen.queryByText('Profile Settings')).not.toBeInTheDocument();
    });
  });

  describe('Click Outside Behavior', () => {
    it('closes dropdown when clicking outside', () => {
      const { container } = render(<CustomUserDropdown />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      fireEvent.mouseDown(container);
      
      expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('does not close dropdown when clicking inside', () => {
      render(<CustomUserDropdown />);
      
      fireEvent.click(screen.getByRole('button'));
      expect(screen.getByText('Dashboard')).toBeInTheDocument();

      const dropdown = screen.getByText('Dashboard').closest('.dropdown-menu');
      fireEvent.mouseDown(dropdown);
      
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
  });

  describe('Email Display', () => {
    it('displays backend email when available', () => {
      render(<CustomUserDropdown />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });

    it('displays clerk email when backend email is not available', () => {
      useUser.mockReturnValue({
        user: mockClerkUser,
        backendUser: { ...mockBackendUser, email: null },
        isLoading: false,
        error: null
      });

      render(<CustomUserDropdown />);
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  describe('Cleanup', () => {
    it('removes event listener on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(<CustomUserDropdown />);
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
    });
  });
});