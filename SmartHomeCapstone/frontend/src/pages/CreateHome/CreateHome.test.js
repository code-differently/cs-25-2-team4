import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateHome from './CreateHome';
import { useUser } from '../../context/UserContext';
import { useHomes } from '../../hooks/useHomes';

// Mock dependencies
jest.mock('../../context/UserContext');
jest.mock('../../hooks/useHomes');

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
      render(<CreateHome />);

      expect(screen.getByText('Create Your First Smart Home')).toBeInTheDocument();
      expect(screen.getByText("Let's set up your smart home to get started!")).toBeInTheDocument();
      expect(screen.getByLabelText(/home name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/home type/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create smart home/i })).toBeInTheDocument();
    });

    it('renders home type dropdown with correct options', () => {
      render(<CreateHome />);

      const select = screen.getByLabelText(/home type/i);
      expect(select).toBeInTheDocument();
      
      const options = Array.from(select.options).map(opt => opt.value);
      expect(options).toEqual(['', 'Single Family', 'Apartment', 'Townhouse', 'Condo', 'Other']);
    });

    it('renders with empty initial values', () => {
      render(<CreateHome />);

      expect(screen.getByPlaceholderText(/my family home/i)).toHaveValue('');
      expect(screen.getByPlaceholderText(/123 main street/i)).toHaveValue('');
      expect(screen.getByLabelText(/home type/i)).toHaveValue('');
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting with empty fields', async () => {
      render(<CreateHome />);

      const submitButton = screen.getByRole('button', { name: /create smart home/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });

      expect(mockCreateHome).not.toHaveBeenCalled();
    });

    it('shows error when name is missing', async () => {
      render(<CreateHome />);

      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByLabelText(/home type/i), {
        target: { value: 'Single Family' }
      });

      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      await waitFor(() => {
        expect(screen.getByText(/please fill in all fields/i)).toBeInTheDocument();
      });
    });

    it('shows error when user is not authenticated', async () => {
      useUser.mockReturnValue({
        backendUser: null,
        isLoading: false,
        error: null
      });

      render(<CreateHome />);

      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'My Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByLabelText(/home type/i), {
        target: { value: 'Single Family' }
      });

      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      await waitFor(() => {
        expect(screen.getByText(/user authentication required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('successfully creates home with valid data', async () => {
      const newHome = {
        homeId: 1,
        name: 'My Dream Home',
        address: '789 Paradise Lane',
        type: 'Single Family',
        clerkId: 'user_123'
      };

      mockCreateHome.mockResolvedValue(newHome);

      render(<CreateHome onHomeCreated={mockOnHomeCreated} />);

      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'My Dream Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '789 Paradise Lane' }
      });
      fireEvent.change(screen.getByLabelText(/home type/i), {
        target: { value: 'Single Family' }
      });

      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

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
      mockCreateHome.mockResolvedValue({ homeId: 1 });

      render(<CreateHome />);

      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: '  Spaced Name  ' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '  123 Main St  ' }
      });
      fireEvent.change(screen.getByLabelText(/home type/i), {
        target: { value: 'Apartment' }
      });

      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      await waitFor(() => {
        expect(mockCreateHome).toHaveBeenCalledWith({
          name: 'Spaced Name',
          address: '123 Main St',
          clerkId: 'user_123'
        });
      });
    });

    it('handles API errors gracefully', async () => {
      mockCreateHome.mockRejectedValue(new Error('Network error'));

      render(<CreateHome />);

      fireEvent.change(screen.getByPlaceholderText(/my family home/i), {
        target: { value: 'Test Home' }
      });
      fireEvent.change(screen.getByPlaceholderText(/123 main street/i), {
        target: { value: '123 Test St' }
      });
      fireEvent.change(screen.getByLabelText(/home type/i), {
        target: { value: 'Other' }
      });

      fireEvent.click(screen.getByRole('button', { name: /create smart home/i }));

      await waitFor(() => {
        expect(screen.getByText(/network error/i)).toBeInTheDocument();
      });
    });
  });
});