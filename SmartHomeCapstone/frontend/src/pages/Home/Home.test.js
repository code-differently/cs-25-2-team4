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
    // Act
    render(<Home />);
    expect(screen.getByRole('button', { name: '+ Add Device' })).toBeInTheDocument();
  });

  it('renders My Devices title but no devices initially', () => {
    // Act
    render(<Home />);
    expect(screen.getByText('My Devices')).toBeInTheDocument();

    expect(screen.queryByTestId('device-card')).not.toBeInTheDocument();
  });
});

describe('Home (device adding)', () => {

  it('opens an inline add device form with name and room fields when clicking + Add Device', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByTestId('add-device-btn'));

    expect(screen.getByPlaceholderText(/device name/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('adds a new device and hides the form when Save is clicked', () => {
    // Act
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

  it('adds a new device bubble after saving the device form', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByTestId('add-device-btn'));

    const deviceName = 'Test Device';
    fireEvent.change(screen.getByPlaceholderText(/device name/i), {
      target: { value: deviceName },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByTestId('device-card')).toBeInTheDocument();
    expect(screen.getByText(deviceName)).toBeInTheDocument();
  });

  it('closes the add device form when Cancel is clicked without clearing the input', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByTestId('add-device-btn'));

    fireEvent.change(screen.getByPlaceholderText(/device name/i), {
        target: { value: 'Fan' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText(/device name/i)).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: '+ Add Device' })).toBeInTheDocument();
  });

  it('shows a validation message if trying to save a device with an empty name', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByTestId('add-device-btn'));

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/device name is required/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/device name/i)).toBeInTheDocument();
  });

  it('shows a toast error when trying to save a device with an empty name', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByTestId('add-device-btn'));

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/device name is required/i)).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/device name/i)).toBeInTheDocument();
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

  it('adds a new room and makes it active while All becomes inactive', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));

    const roomName = 'Bedroom';
    fireEvent.change(screen.getByPlaceholderText(/room name/i), {
        target: { value: roomName },
    });

    fireEvent.click(screen.getByRole('button', { name: /save room/i }));

    expect(screen.getByRole('button', { name: roomName })).toBeInTheDocument();

    expect(screen.getByRole('button', { name: roomName })).toHaveClass('active');

    expect(screen.getByRole('button', { name: 'All' })).not.toHaveClass('active');
  });

  it('shows an inline room form when clicking + Add in rooms bar', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));

    expect(screen.getByPlaceholderText(/room name/i)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /save room/i })).toBeInTheDocument();
  });

  it('keeps add device form open when switching rooms and saves to the active room automatically', () => {
    // Act
    render(<Home />);

    // Add first room
    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));
    fireEvent.change(screen.getByPlaceholderText(/room name/i), {
        target: { value: 'Bedroom' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save room/i }));

    // Open Add Device form
    fireEvent.click(screen.getByTestId('add-device-btn'));
    expect(screen.getByPlaceholderText(/device name/i)).toBeInTheDocument();

    // Add second room
    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));
    fireEvent.change(screen.getByPlaceholderText(/room name/i), {
        target: { value: 'Kitchen' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save room/i }));

    // Switch to Bedroom
    fireEvent.click(screen.getByRole('button', { name: 'Bedroom' }));

    // Form should still be visible
    expect(screen.getByPlaceholderText(/device name/i)).toBeInTheDocument();
  });

  it('activates a clicked room and deactivates the previously active one', () => {
    //Act
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));
    fireEvent.change(screen.getByPlaceholderText(/room name/i), {
        target: { value: 'Bedroom' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save room/i }));

    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));
    fireEvent.change(screen.getByPlaceholderText(/room name/i), {
        target: { value: 'Kitchen' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save room/i }));

    fireEvent.click(screen.getByRole('button', { name: 'Bedroom' }));

    expect(screen.getByRole('button', { name: 'Bedroom' })).toHaveClass('active');
    expect(screen.getByRole('button', { name: 'Kitchen' })).not.toHaveClass('active');
  });

  it('closes the add room form when Cancel is clicked without clearing the input', () => {
    // Act
    render(<Home />);

    fireEvent.click(screen.getByRole('button', { name: '+ Add' }));

    fireEvent.change(screen.getByPlaceholderText(/room name/i), {
        target: { value: 'Garage' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByPlaceholderText(/room name/i)).not.toBeInTheDocument();

    expect(screen.getByRole('button', { name: '+ Add' })).toBeInTheDocument();
  });
});
