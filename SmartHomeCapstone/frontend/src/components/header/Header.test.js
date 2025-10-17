import React from 'react';  
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders correctly', () => {
    // Act
    render(<Header />);
    
    expect(screen.getByText('SmartHome')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Search type of keywords')).toBeInTheDocument();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('toggles dropdown when profile section is clicked', () => {
    // Act
    render(<Header />);
    
  // Use a more semantic approach - look for a clickable element
    const profileDropdown = screen.getByText('John Doe');
    
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Click to open dropdown
    fireEvent.click(profileDropdown);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('toggles dark mode when toggle switch is clicked', () => {
    // Act
    render(<Header />);
    
    const toggleSwitch = screen.getByRole('checkbox');
    
    expect(toggleSwitch).not.toBeChecked();
    
    // Click to toggle
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toBeChecked();
  });

  it('closes dropdown when profile section is clicked again', () => {
    // Act
    render(<Header />);

    const profileDropdown = screen.getByText('John Doe');

    // Open dropdown
    fireEvent.click(profileDropdown);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    
    // Click again to close dropdown
    fireEvent.click(profileDropdown);
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
  });

  it('changes icon when dark mode is toggled', () => {
    // Act
    render(<Header />);

    expect(screen.getByText('🌙')).toBeInTheDocument();
    expect(screen.queryByText('☀️')).not.toBeInTheDocument();

    // Toggle dark mode
    const toggleSwitch = screen.getByRole('checkbox');
    fireEvent.click(toggleSwitch);

    // After toggling, the sun icon should be visible
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.queryByText('🌙')).not.toBeInTheDocument();
  });
});