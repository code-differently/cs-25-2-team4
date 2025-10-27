/* eslint-disable import/first */
/**
 * ----------------------------------------------------------------------
 * CreateHome Component Tests
 * ----------------------------------------------------------------------
 * All dependencies properly mocked
 */

import React from 'react';

/** Mock axios to prevent ES module import errors */
jest.mock('axios');

/** Mock all service files that import axios */
jest.mock('../../services/userService', () => ({
  userService: {
    getUserByClerkId: jest.fn(),
    syncUser: jest.fn(),
    updateUser: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

jest.mock('../../services/roomService', () => ({
  roomService: {
    getRoomsByHome: jest.fn(),
    createRoom: jest.fn(),
    deleteRoom: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

jest.mock('../../services/deviceService', () => ({
  deviceService: {
    getAllDevices: jest.fn(),
    createDevice: jest.fn(),
    deleteDevice: jest.fn(),
    turnDeviceOn: jest.fn(),
    turnDeviceOff: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

/** Mock all hooks that might import services */
jest.mock('../../hooks/useUserSync', () => ({
  useUserSync: jest.fn(() => ({
    user: null,
    backendUser: null,
    isLoading: false,
    error: null,
    updateBackendUser: jest.fn(),
    isAuthenticated: false,
  })),
}));

jest.mock('../../hooks/useDevices', () => ({
  useDevices: jest.fn(() => ({
    devices: [],
    loading: false,
    error: null,
    refreshDevices: jest.fn(),
    addDevice: jest.fn(),
    deleteDevice: jest.fn(),
    toggleDevice: jest.fn(),
    setDevices: jest.fn(),
  })),
}));

jest.mock('../../hooks/useRooms', () => ({
  useRooms: jest.fn(() => ({
    rooms: [{ name: "All", active: true }],
    loading: false,
    error: null,
    refreshRooms: jest.fn(),
  })),
}));

/** Mock UserContext */
jest.mock('../../context/UserContext', () => ({
  UserProvider: ({ children }) => children,
  useUser: jest.fn(),
}));

/** Mock useHomes hook */
jest.mock('../../hooks/useHomes', () => ({
  useHomes: jest.fn(),
  homeService: {
    getHomesByClerkId: jest.fn(),
    createHome: jest.fn(),
    getHomeById: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

/**
 * ----------------------------------------------------------------------
 * IMPORTS UNDER TEST
 * ----------------------------------------------------------------------
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateHome from './CreateHome';
import { useUser } from '../../context/UserContext';
import { useHomes } from '../../hooks/useHomes';

describe('CreateHome Component', () => {
  const mockBackendUser = {
    clerkId: 'user_123',
    email: 'test@example.com',
    fullName: 'Test User'
  };

  const mockCreateHome = jest.fn();
  const mockOnHomeCreated = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useUser.mockReturnValue({
      backendUser: mockBackendUser,
      isLoading: false,
      error: null
    });

    useHomes.mockReturnValue({
      createHome: mockCreateHome,
      loading: false,
      error: null
    });
  });

  describe('Rendering', () => {
    it('renders the form with all required fields', () => {
      // Act
      render(<CreateHome />);

      // Assert
      expect(screen.getByText('Create Your First Smart Home')).toBeInTheDocument();
      expect(screen.getByText("Let's set up your smart home to get started!")).toBeInTheDocument();
      expect(screen.getByText('Home Name')).toBeInTheDocument();
      expect(screen.getByText('Address')).toBeInTheDocument();
      expect(screen.getByText('Home Type')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create smart home/i })).toBeInTheDocument();
    });

    it('renders home type dropdown with correct options', () => {
      // Act
      render(<CreateHome />);

      // Assert
      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();
      
      const options = Array.from(select.options).map(opt => opt.value);
      expect(options).toEqual(['', 'Single Family', 'Apartment', 'Townhouse', 'Condo', 'Other']);
    });

    it('renders with empty initial values', () => {
      // Act
      render(<CreateHome />);

      // Assert
      expect(screen.getByPlaceholderText(/my family home/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/123 main street/i)).toHaveValue('');
      expect(screen.getByRole('combobox')).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting with empty fields', async () => {
      // Arrange
      render(<CreateHome />);
      const submitButton = screen.getByRole('button', { name: /create smart home/i });

      // Act
      fireEvent.click(submitButton);

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
      expect(mockCreateHome).not.toHaveBeenCalled();
    });

    it('shows error when name is missing', async () => {
      // Arrange
      render(<CreateHome />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Single Family' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });

    it('shows error when user is not authenticated', async () => {
      // Arrange
      useUser.mockReturnValue({
        backendUser: null,
        isLoading: false,
        error: null
      });
      render(<CreateHome />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'My Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Single Family' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/user authentication required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('successfully creates home with valid data', async () => {
      // Arrange
      const newHome = {
        homeId: 1,
        name: 'My Dream Home',
        address: '789 Paradise Lane',
        type: 'Single Family',
        clerkId: 'user_123'
      };
      mockCreateHome.mockResolvedValue(newHome);
      render(<CreateHome onHomeCreated={mockOnHomeCreated} />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'My Dream Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '789 Paradise Lane' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Single Family' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      // Assert
      await waitFor(() => {
        expect(mockCreateHome).toHaveBeenCalledWith({
          name: 'My Dream Home',
          address: '789 Paradise Lane',
          clerkId: 'user_123'
        });
      });
      expect(mockOnHomeCreated).toHaveBeenCalledWith(newHome);
    });

    it('trims whitespace from inputs before submission', async () => {
      // Arrange
      mockCreateHome.mockResolvedValue({ homeId: 1 });
      render(<CreateHome />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: '  Spaced Name  ' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '  123 Main St  ' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Apartment' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      // Assert
      await waitFor(() => {
        expect(mockCreateHome).toHaveBeenCalledWith({
          name: 'Spaced Name',
          address: '123 Main St',
          clerkId: 'user_123'
        });
      });
    });

    it('handles API errors gracefully', async () => {
      // Arrange
      mockCreateHome.mockRejectedValue(new Error('Network error'));
      render(<CreateHome />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'Test Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Test St' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Other' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('disables submit button while loading', async () => {
      // Arrange
      mockCreateHome.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ homeId: 1 }), 100)));
      render(<CreateHome />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'Test Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Test St' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Condo' }
      });
      
      const submitButton = screen.getByRole('button', { name: /create smart home/i });
      fireEvent.click(submitButton);

      // Assert
      expect(submitButton).toBeDisabled();

      await waitFor(() => {
        expect(mockCreateHome).toHaveBeenCalled();
      });
    });

    it('shows loading text on submit button during submission', async () => {
      // Arrange
      mockCreateHome.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve({ homeId: 1 }), 100)));
      render(<CreateHome />);

      // Act
      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'Test Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Test St' }
      });
      fireEvent.change(screen.getByRole('combobox'), {
        target: { value: 'Townhouse' }
      });
      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      // Assert
      expect(screen.getByRole('button', { name: /creating home/i })).toBeInTheDocument();

      await waitFor(() => {
        expect(mockCreateHome).toHaveBeenCalled();
      });
    });
  });
});