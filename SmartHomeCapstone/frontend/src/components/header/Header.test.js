import React from 'react';  
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('renders correctly', () => {
    //Act
    render(<Header />);
    
    expect(screen.getByText('SmartHome')).toBeInTheDocument();
    
    expect(screen.getByPlaceholderText('Search type of keywords')).toBeInTheDocument();
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    
    expect(screen.getByAltText('Profile')).toBeInTheDocument();
  });

  it('toggles dropdown when profile section is clicked', () => {
    //Act
    render(<Header />);
    
  // Use a more semantic approach - look for a clickable element
    const profileDropdown = screen.getByText('John Doe');
    
    // Initially dropdown should not be visible
    expect(screen.queryByText('Profile')).not.toBeInTheDocument();
    
    // Click to open dropdown
    fireEvent.click(profileDropdown);
    expect(screen.getByText('Profile')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  it('toggles dark mode when toggle switch is clicked', () => {
    //Act
    render(<Header />);
    
    const toggleSwitch = screen.getByRole('checkbox');
    
    // Initially should be unchecked
    expect(toggleSwitch).not.toBeChecked();
    
    // Click to toggle
    fireEvent.click(toggleSwitch);
    expect(toggleSwitch).toBeChecked();
  });
});