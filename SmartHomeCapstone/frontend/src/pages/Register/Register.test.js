import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Register from './Register';

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockCreate = jest.fn();
const mockPrepareEmailAddressVerification = jest.fn();
const mockAuthenticateWithRedirect = jest.fn();
const mockSetActive = jest.fn();

jest.mock('@clerk/clerk-react', () => ({
    useSignUp: () => ({
        signUp: {
            create: mockCreate,
            authenticateWithRedirect: mockAuthenticateWithRedirect,
            prepareEmailAddressVerification: mockPrepareEmailAddressVerification,
        },
        setActive: mockSetActive,
        isLoaded: true,
    }),
}));

function renderWithRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
}

function fillAllFields(user) {
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
        if (user[input.name] !== undefined && input.name !== "password" && input.name !== "dob") {
            fireEvent.change(input, { target: { value: user[input.name] } });
        }
    });
    if (user.password !== undefined) {
        const password = screen.getByLabelText(/password/i);
        fireEvent.change(password, { target: { value: user.password } });
    }
    if (user.dob !== undefined) {
        const dobInput = screen.getByLabelText(/date of birth/i);
        fireEvent.change(dobInput, { target: { value: user.dob } });
    }
}

beforeEach(() => {
    jest.clearAllMocks();
    mockCreate.mockResolvedValue({ status: 'complete', createdSessionId: 'session123' });
    sessionStorage.clear();
});

describe('Register Component', () => {

    describe('Form Validation', () => {
        it('shows error when required fields are missing', () => {
            renderWithRouter(<Register />);
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(screen.getByText(/please fill all required fields/i)).toBeInTheDocument();
        });

        it('validates username cannot contain spaces', () => {
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'john doe',
                email: 'john@example.com',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(screen.getByText(/username cannot contain spaces/i)).toBeInTheDocument();
        });

        it('validates password minimum length', () => {
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'abc'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
        });

        it('validates email format', () => {
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'invalid-email',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(screen.getByText(/invalid email format/i)).toBeInTheDocument();
        });

        it('validates date of birth cannot be in the future', () => {
            const futureDate = new Date();
            futureDate.setFullYear(futureDate.getFullYear() + 1);
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                dob: futureDate.toISOString().split('T')[0]
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(screen.getByText(/date of birth cannot be in the future/i)).toBeInTheDocument();
        });

        it('validates date of birth must be after 1900', () => {
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123',
                dob: '1899-12-31'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(screen.getByText(/date of birth must be after 1900/i)).toBeInTheDocument();
        });
    });
    
    describe('Successful Registration', () => {
        it('successfully creates account with valid data', async () => {
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                password: 'password123',
                dob: '2000-01-01'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(await screen.findByText(/account created successfully/i)).toBeInTheDocument();
            expect(mockCreate).toHaveBeenCalledWith({
                emailAddress: 'jane@example.com',
                password: 'password123',
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'janesmith',
                unsafeMetadata: { dob: '2000-01-01' }
            });
        });

        it('allows registration without date of birth (optional)', async () => {
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'Jane',
                lastName: 'Smith',
                username: 'janesmith',
                email: 'jane@example.com',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(await screen.findByText(/account created successfully/i)).toBeInTheDocument();
        });

        it('sets session and navigates on success', async () => {
            jest.useFakeTimers();
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            await waitFor(() => {
                expect(mockSetActive).toHaveBeenCalledWith({ session: 'session123' });
            });
            expect(sessionStorage.getItem('freshRegistration')).toBe('true');
            
            jest.advanceTimersByTime(1000);
            expect(mockNavigate).toHaveBeenCalledWith('/');
            
            jest.useRealTimers();
        });
    });
    
    describe('Error Handling', () => {
        it('handles email verification requirement', async () => {
            mockCreate.mockResolvedValueOnce({ status: 'missing_requirements' });
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(await screen.findByText(/please check your email for a verification code/i)).toBeInTheDocument();
        });

        it('displays server error messages', async () => {
            mockCreate.mockRejectedValueOnce({ 
                errors: [{ message: 'Email already registered' }] 
            });
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'existing@example.com',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(await screen.findByText(/email already registered/i)).toBeInTheDocument();
        });

        it('shows generic error for unexpected failures', async () => {
            mockCreate.mockRejectedValueOnce(new Error('Network error'));
            renderWithRouter(<Register />);
            fillAllFields({
                firstName: 'John',
                lastName: 'Doe',
                username: 'johndoe',
                email: 'john@example.com',
                password: 'password123'
            });
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /continue/i }));
            
            // Assert
            expect(await screen.findByText(/registration failed. please try again/i)).toBeInTheDocument();
        });
    });

    describe('OAuth Sign Up', () => {
        it('handles Google OAuth sign up', () => {
            renderWithRouter(<Register />);
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /google/i }));
            
            // Assert
            expect(mockAuthenticateWithRedirect).toHaveBeenCalledWith({
                strategy: 'oauth_google',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/'
            });
            expect(sessionStorage.getItem('freshRegistration')).toBe('true');
        });

        it('handles Apple OAuth sign up', () => {
            renderWithRouter(<Register />);
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /apple/i }));
            
            // Assert
            expect(mockAuthenticateWithRedirect).toHaveBeenCalledWith({
                strategy: 'oauth_apple',
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/'
            });
        });

        it('handles OAuth errors', async () => {
            mockAuthenticateWithRedirect.mockRejectedValueOnce(new Error('OAuth failed'));
            renderWithRouter(<Register />);
            
            // Act
            fireEvent.click(screen.getByRole('button', { name: /google/i }));
            
            // Assert
            await waitFor(() => {
                expect(screen.getByText(/oauth_google sign-up failed/i)).toBeInTheDocument();
            });
        });
    });
});