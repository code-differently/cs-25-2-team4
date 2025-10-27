import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import { useSignIn } from '@clerk/clerk-react';

// Mock Clerk
jest.mock('@clerk/clerk-react');

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Login Component', () => {
  const mockSignIn = {
    create: jest.fn(),
    authenticateWithRedirect: jest.fn(),
  };
  const mockSetActive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    useSignIn.mockReturnValue({
      signIn: mockSignIn,
      setActive: mockSetActive,
      isLoaded: true,
    });
  });

  describe('Rendering', () => {
    it('renders the login form with all elements', () => {
      renderWithRouter(<Login />);

      expect(screen.getByText('Sign in to My Application')).toBeInTheDocument();
      expect(screen.getByText('Welcome back! Please sign in to continue')).toBeInTheDocument();
      expect(screen.getByLabelText(/email address or username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('renders OAuth buttons', () => {
      renderWithRouter(<Login />);

      expect(screen.getByRole('button', { name: /apple/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    it('renders link to register page', () => {
      renderWithRouter(<Login />);

      const signUpLink = screen.getByRole('link', { name: /sign up/i });
      expect(signUpLink).toBeInTheDocument();
      expect(signUpLink).toHaveAttribute('href', '/register');
    });

    it('renders "or" divider between OAuth and email login', () => {
      renderWithRouter(<Login />);
      expect(screen.getByText('or')).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('updates email input value', () => {
      renderWithRouter(<Login />);

      const emailInput = screen.getByPlaceholderText(/enter email or username/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password input value', () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      expect(passwordInput).toHaveValue('password123');
    });

    it('password input has type password', () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting with empty email', async () => {
      renderWithRouter(<Login />);

      const passwordInput = screen.getByPlaceholderText(/enter your password/i);
      fireEvent.change(passwordInput, { target: { value: 'password123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
      });

      expect(mockSignIn.create).not.toHaveBeenCalled();
    });

    it('shows error when submitting with empty password', async () => {
      renderWithRouter(<Login />);

      const emailInput = screen.getByPlaceholderText(/enter email or username/i);
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
      });

      expect(mockSignIn.create).not.toHaveBeenCalled();
    });

    it('shows error when both fields are empty', async () => {
      renderWithRouter(<Login />);

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter email and password/i)).toBeInTheDocument();
      });

      expect(mockSignIn.create).not.toHaveBeenCalled();
    });
  });

  describe('Email/Password Login', () => {
    it('successfully logs in with valid credentials', async () => {
      mockSignIn.create.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'session_123'
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignIn.create).toHaveBeenCalledWith({
          identifier: 'test@example.com',
          password: 'password123'
        });
      });

      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session_123' });
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('shows signing in message during login', async () => {
      mockSignIn.create.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/signing in/i)).toBeInTheDocument();
      });
    });

    it('handles incomplete login status', async () => {
      mockSignIn.create.mockResolvedValue({
        status: 'needs_verification',
        createdSessionId: null
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/additional verification needed/i)).toBeInTheDocument();
      });

      expect(mockSetActive).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('handles login errors with message', async () => {
      mockSignIn.create.mockRejectedValue({
        errors: [{ message: 'Invalid email or password' }]
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'wrong@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'wrongpassword' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
      });
    });

    it('handles login errors without message', async () => {
      mockSignIn.create.mockRejectedValue({});

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/login failed. please try again/i)).toBeInTheDocument();
      });
    });

    it('does not submit when Clerk is not loaded', async () => {
      useSignIn.mockReturnValue({
        signIn: mockSignIn,
        setActive: mockSetActive,
        isLoaded: false,
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignIn.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('OAuth Login', () => {
    it('initiates Apple OAuth flow', async () => {
      mockSignIn.authenticateWithRedirect.mockResolvedValue();

      renderWithRouter(<Login />);

      const appleButton = screen.getByRole('button', { name: /apple/i });
      fireEvent.click(appleButton);

      await waitFor(() => {
        expect(mockSignIn.authenticateWithRedirect).toHaveBeenCalledWith({
          strategy: 'oauth_apple',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/'
        });
      });
    });

    it('initiates Google OAuth flow', async () => {
      mockSignIn.authenticateWithRedirect.mockResolvedValue();

      renderWithRouter(<Login />);

      const googleButton = screen.getByRole('button', { name: /google/i });
      fireEvent.click(googleButton);

      await waitFor(() => {
        expect(mockSignIn.authenticateWithRedirect).toHaveBeenCalledWith({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/'
        });
      });
    });

    it('handles Apple OAuth errors', async () => {
      mockSignIn.authenticateWithRedirect.mockRejectedValue(new Error('OAuth failed'));

      renderWithRouter(<Login />);

      fireEvent.click(screen.getByRole('button', { name: /apple/i }));

      await waitFor(() => {
        expect(screen.getByText(/oauth_apple sign-in failed/i)).toBeInTheDocument();
      });
    });

    it('handles Google OAuth errors', async () => {
      mockSignIn.authenticateWithRedirect.mockRejectedValue(new Error('OAuth failed'));

      renderWithRouter(<Login />);

      fireEvent.click(screen.getByRole('button', { name: /google/i }));

      await waitFor(() => {
        expect(screen.getByText(/oauth_google sign-in failed/i)).toBeInTheDocument();
      });
    });

    it('does not initiate OAuth when Clerk is not loaded', async () => {
      useSignIn.mockReturnValue({
        signIn: mockSignIn,
        setActive: mockSetActive,
        isLoaded: false,
      });

      renderWithRouter(<Login />);

      fireEvent.click(screen.getByRole('button', { name: /google/i }));

      await waitFor(() => {
        expect(mockSignIn.authenticateWithRedirect).not.toHaveBeenCalled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles special characters in email', async () => {
      mockSignIn.create.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'session_123'
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: "user+test@example.com" }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignIn.create).toHaveBeenCalledWith({
          identifier: "user+test@example.com",
          password: 'password123'
        });
      });
    });

    it('handles username instead of email', async () => {
      mockSignIn.create.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'session_123'
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/enter email or username/i), {
        target: { value: 'testuser' }
      });
      fireEvent.change(screen.getByPlaceholderText(/enter your password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignIn.create).toHaveBeenCalledWith({
          identifier: 'testuser',
          password: 'password123'
        });
      });
    });
  });
});