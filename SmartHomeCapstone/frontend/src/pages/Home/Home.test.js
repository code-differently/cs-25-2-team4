import { render, screen, fireEvent, within } from '@testing-library/react';
import { Home } from './Home';

describe('Home (initial state)', () => {

  it('renders the rooms bar with only All and + Add initially', () => {
    // Act
    render(<Home />);

    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '+ Add' })).toBeInTheDocument();

    // Should only have exactly 2 room buttons on initial load
    const roomsBar = screen.getByRole('navigation', { name: /rooms/i });
    const roomButtons = within(roomsBar).getAllByRole('button');
    expect(roomButtons).toHaveLength(2);
  });

  it('renders Add Device button on first load', () => {
    render(<Home />);
    expect(screen.getByRole('button', { name: '+ Add Device' })).toBeInTheDocument();
  });

  it('renders My Devices title but no devices initially', () => {
    render(<Home />);
    expect(screen.getByText('My Devices')).toBeInTheDocument();

    expect(screen.queryByTestId('device-card')).not.toBeInTheDocument();
  });

describe('Home (device adding)', () => {

  it('opens an inline add device form with name and room fields when clicking + Add Device', () => {
  render(<Home />);

  fireEvent.click(screen.getByTestId('add-device-btn'));

  expect(screen.getByPlaceholderText(/device name/i)).toBeInTheDocument();

  expect(screen.getByRole('combobox', { name: /select room/i })).toBeInTheDocument();

  expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
});

it('adds a new device and hides the form when Save is clicked', () => {
  //Act
  render(<Home />);

  fireEvent.click(screen.getByTestId('add-device-btn'));

  fireEvent.change(screen.getByPlaceholderText(/device name/i), {
    target: { value: 'Lamp' }
  });

  fireEvent.click(screen.getByRole('button', { name: /save/i }));

  expect(screen.getByTestId('device-card')).toBeInTheDocument();
  expect(screen.getByText('Lamp')).toBeInTheDocument();

  expect(screen.queryByPlaceholderText(/device name/i)).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
});

});

describe('Rooms bar (adding rooms)', () => {
  it('shows an inline input when + Add is clicked', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));

    expect(screen.getByPlaceholderText(/room name/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /save room/i })).toBeInTheDocument();
  });
});
});
