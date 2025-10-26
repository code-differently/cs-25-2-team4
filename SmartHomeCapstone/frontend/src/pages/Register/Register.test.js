import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';
import { useSignUp } from '@clerk/clerk-react';

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

describe('Register Component', () => {
  const mockSignUp = {
    create: jest.fn(),
    prepareEmailAddressVerification: jest.fn(),
    authenticateWithRedirect: jest.fn(),
  };
  const mockSetActive = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    
    useSignUp.mockReturnValue({
      signUp: mockSignUp,
      setActive: mockSetActive,
      isLoaded: true,
    });
  });

  describe('Rendering', () => {
    it('renders the registration form with all required fields', () => {
      renderWithRouter(<Register />);

      expect(screen.getByText('Create your account')).toBeInTheDocument();
      expect(screen.getByText('Welcome! Please fill in the details to get started.')).toBeInTheDocument();
      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^username$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/date of birth/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument();
    });

    it('renders OAuth buttons', () => {
      renderWithRouter(<Register />);

      expect(screen.getByRole('button', { name: /apple/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /google/i })).toBeInTheDocument();
    });

    it('renders link to login page', () => {
      renderWithRouter(<Register />);

      const signInLink = screen.getByRole('link', { name: /sign in/i });
      expect(signInLink).toBeInTheDocument();
      expect(signInLink).toHaveAttribute('href', '/login');
    });

    it('marks date of birth as optional', () => {
      renderWithRouter(<Register />);
      expect(screen.getByText(/optional/i)).toBeInTheDocument();
    });
  });

  describe('Form Input Handling', () => {
    it('updates all form fields', () => {
      renderWithRouter(<Register />);

      const firstNameInput = screen.getAllByRole('textbox')[0];
      const lastNameInput = screen.getAllByRole('textbox')[1];
      const usernameInput = screen.getAllByRole('textbox')[2];
      const emailInput = screen.getByRole('textbox', { name: /email address/i });

      fireEvent.change(firstNameInput, { target: { value: 'John' } });
      fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
      fireEvent.change(usernameInput, { target: { value: 'johndoe' } });
      fireEvent.change(emailInput, { target: { value: 'john@example.com' } });

      expect(firstNameInput).toHaveValue('John');
      expect(lastNameInput).toHaveValue('Doe');
      expect(usernameInput).toHaveValue('johndoe');
      expect(emailInput).toHaveValue('john@example.com');
    });

    it('updates password field', () => {
      renderWithRouter(<Register />);

      const passwordInput = screen.getByLabelText(/^password$/i);
      fireEvent.change(passwordInput, { target: { value: 'securePass123' } });

      expect(passwordInput).toHaveValue('securePass123');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    it('updates date of birth field', () => {
      renderWithRouter(<Register />);

      const dobInput = screen.getByLabelText(/date of birth/i);
      fireEvent.change(dobInput, { target: { value: '1990-01-01' } });

      expect(dobInput).toHaveValue('1990-01-01');
      expect(dobInput).toHaveAttribute('type', 'date');
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting with empty required fields', async () => {
      renderWithRouter(<Register />);

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
      });

      expect(mockSignUp.create).not.toHaveBeenCalled();
    });

    it('shows error when first name is missing', async () => {
      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[1], { target: { value: 'Doe' } }); // last name
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } }); // username
      fireEvent.change(inputs[3], { target: { value: 'john@example.com' } }); // email
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
      });
    });

    it('allows submission without date of birth (optional field)', async () => {
      mockSignUp.create.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'session_123'
      });

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'John' } });
      fireEvent.change(inputs[1], { target: { value: 'Doe' } });
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } });
      fireEvent.change(inputs[3], { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignUp.create).toHaveBeenCalled();
      });
    });
  });

  describe('Registration Flow', () => {
    it('successfully registers with all fields', async () => {
      mockSignUp.create.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'session_123'
      });

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'John' } });
      fireEvent.change(inputs[1], { target: { value: 'Doe' } });
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } });
      fireEvent.change(inputs[3], { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'securePass123' } });
      fireEvent.change(screen.getByLabelText(/date of birth/i), { target: { value: '1990-05-15' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignUp.create).toHaveBeenCalledWith({
          emailAddress: 'john@example.com',
          password: 'securePass123',
          firstName: 'John',
          lastName: 'Doe',
          username: 'johndoe',
          unsafeMetadata: {
            dob: '1990-05-15'
          }
        });
      });

      expect(mockSetActive).toHaveBeenCalledWith({ session: 'session_123' });
      expect(sessionStorage.getItem('freshRegistration')).toBe('true');
      expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
    });

    it('handles email verification requirement', async () => {
      mockSignUp.create.mockResolvedValue({
        status: 'missing_requirements'
      });
      mockSignUp.prepareEmailAddressVerification.mockResolvedValue();

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Jane' } });
      fireEvent.change(inputs[1], { target: { value: 'Smith' } });
      fireEvent.change(inputs[2], { target: { value: 'janesmith' } });
      fireEvent.change(inputs[3], { target: { value: 'jane@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignUp.prepareEmailAddressVerification).toHaveBeenCalledWith({
          strategy: 'email_code'
        });
      });

      expect(screen.getByText(/check your email for a verification code/i)).toBeInTheDocument();
    });

    it('shows creating account message during registration', async () => {
      mockSignUp.create.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'Test' } });
      fireEvent.change(inputs[1], { target: { value: 'User' } });
      fireEvent.change(inputs[2], { target: { value: 'testuser' } });
      fireEvent.change(inputs[3], { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      });
    });

    it('handles registration errors with message', async () => {
      mockSignUp.create.mockRejectedValue({
        errors: [{ message: 'Email already exists' }]
      });

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'John' } });
      fireEvent.change(inputs[1], { target: { value: 'Doe' } });
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } });
      fireEvent.change(inputs[3], { target: { value: 'existing@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it('handles registration errors without message', async () => {
      mockSignUp.create.mockRejectedValue({});

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'John' } });
      fireEvent.change(inputs[1], { target: { value: 'Doe' } });
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } });
      fireEvent.change(inputs[3], { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
      });
    });

    it('does not submit when Clerk is not loaded', async () => {
      useSignUp.mockReturnValue({
        signUp: mockSignUp,
        setActive: mockSetActive,
        isLoaded: false,
      });

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'John' } });
      fireEvent.change(inputs[1], { target: { value: 'Doe' } });
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } });
      fireEvent.change(inputs[3], { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(mockSignUp.create).not.toHaveBeenCalled();
      });
    });
  });

  describe('OAuth Registration', () => {
    it('initiates Apple OAuth and sets fresh registration flag', async () => {
      mockSignUp.authenticateWithRedirect.mockResolvedValue();

      renderWithRouter(<Register />);

      fireEvent.click(screen.getByRole('button', { name: /apple/i }));

      await waitFor(() => {
        expect(sessionStorage.getItem('freshRegistration')).toBe('true');
        expect(mockSignUp.authenticateWithRedirect).toHaveBeenCalledWith({
          strategy: 'oauth_apple',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/'
        });
      });
    });

    it('initiates Google OAuth and sets fresh registration flag', async () => {
      mockSignUp.authenticateWithRedirect.mockResolvedValue();

      renderWithRouter(<Register />);

      fireEvent.click(screen.getByRole('button', { name: /google/i }));

      await waitFor(() => {
        expect(sessionStorage.getItem('freshRegistration')).toBe('true');
        expect(mockSignUp.authenticateWithRedirect).toHaveBeenCalledWith({
          strategy: 'oauth_google',
          redirectUrl: '/sso-callback',
          redirectUrlComplete: '/'
        });
      });
    });

    it('handles Apple OAuth errors', async () => {
      mockSignUp.authenticateWithRedirect.mockRejectedValue(new Error('OAuth failed'));

      renderWithRouter(<Register />);

      fireEvent.click(screen.getByRole('button', { name: /apple/i }));

      await waitFor(() => {
        expect(screen.getByText(/oauth_apple sign-up failed/i)).toBeInTheDocument();
      });
    });

    it('handles Google OAuth errors', async () => {
      mockSignUp.authenticateWithRedirect.mockRejectedValue(new Error('OAuth failed'));

      renderWithRouter(<Register />);

      fireEvent.click(screen.getByRole('button', { name: /google/i }));

      await waitFor(() => {
        expect(screen.getByText(/oauth_google sign-up failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation After Success', () => {
    it('navigates to home after successful registration', async () => {
      jest.useFakeTimers();
      
      mockSignUp.create.mockResolvedValue({
        status: 'complete',
        createdSessionId: 'session_123'
      });

      renderWithRouter(<Register />);

      const inputs = screen.getAllByRole('textbox');
      fireEvent.change(inputs[0], { target: { value: 'John' } });
      fireEvent.change(inputs[1], { target: { value: 'Doe' } });
      fireEvent.change(inputs[2], { target: { value: 'johndoe' } });
      fireEvent.change(inputs[3], { target: { value: 'john@example.com' } });
      fireEvent.change(screen.getByLabelText(/^password$/i), { target: { value: 'pass123' } });

      fireEvent.click(screen.getByRole('button', { name: /continue/i }));

      await waitFor(() => {
        expect(screen.getByText(/account created successfully/i)).toBeInTheDocument();
      });

      jest.advanceTimersByTime(1000);

      expect(mockNavigate).toHaveBeenCalledWith('/');

      jest.useRealTimers();
    });
  });
});