import { render, screen } from '@testing-library/react';
import { Home } from './Home';

describe('Home (initial state)', () => {

  it('renders the rooms bar with only All and + Add initially', () => {
    // Act
    render(<Home />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add' })).toBeInTheDocument();

    // Should only have exactly 2 room buttons on initial load
    const roomButtons = screen.getAllByRole('button');
    expect(roomButtons).toHaveLength(2);
  });

  it('renders Add Device button on first load', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: '+ Add Device' })).toBeInTheDocument();
  });

  it('renders My Devices title but no devices initially', () => {
    render(<Home />);
    expect(screen.getByText('My Devices')).toBeInTheDocument();

    // No device cards yet
    expect(screen.queryByTestId('device-card')).not.toBeInTheDocument();
  });

});
