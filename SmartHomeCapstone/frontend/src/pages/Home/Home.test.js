import { render, screen } from '@testing-library/react';
import { Home } from './Home';

describe('Home (initial state)', () => {

  it('renders the rooms bar with only All and + Add initially', () => {
    // Act
    render(<Home />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('+ Add')).toBeInTheDocument();

    // There should only be exactly 2 room tabs at first
    const roomTabs = screen.getAllByRole('button', { name: /All|\+ Add/ });
    expect(roomTabs.length).toBe(2);
  });

  it('renders Add Device button on first load', () => {
    render(<Home />);
    expect(screen.getByText('+ Add Device')).toBeInTheDocument();
  });

  it('renders My Devices title but no devices initially', () => {
    render(<Home />);
    expect(screen.getByText('My Devices')).toBeInTheDocument();

    expect(screen.queryByTestId('device-card')).not.toBeInTheDocument();
  });

});
