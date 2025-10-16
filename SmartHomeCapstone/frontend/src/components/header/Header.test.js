import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders correctly', () => {
    render(<Header />);
    
    // Check if Dashboard title is rendered
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    
    // Check if search bar is rendered
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    
    // Check if profile name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if toggle switch is rendered
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    
    // Check if profile picture is rendered
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('toggles dropdown when profile section is clicked', () => {
    render(<Header />);
    
    const profileDropdown = screen.getByText('John Doe').closest('.profile-dropdown');
    
    // Initially dropdown should not be visible
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Click to open dropdown
    fireEvent.click(profileDropdown);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('toggles dark mode when toggle switch is clicked', () => {
    render(<Header />);
    
    const toggleSwitch = screen.getByRole('checkbox');
    
    // Initially should be unchecked
    expect(toggleSwitch).not.toBeChecked();
    
    // Click to toggle
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toBeChecked();
  });
});