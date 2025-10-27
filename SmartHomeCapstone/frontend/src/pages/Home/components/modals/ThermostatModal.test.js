import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThermostatModal } from './ThermostatModal';

describe('ThermostatModal', () => {
  const mockDevice = {
    deviceId: '789',
    deviceName: 'Master Bedroom Thermostat',
    deviceType: 'THERMOSTAT',
    isOn: true,
    setpoint: 72,
  };
  const mockOnClose = jest.fn();
  const mockOnToggle = jest.fn();
  const mockOnRequestDelete = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  function renderModal(device = mockDevice) {
    return render(
      <ThermostatModal
        device={device}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
  }

  it('renders modal with device name, toggle, delete button, dial, and slider', () => {
    renderModal();
    
    // Assert
    expect(screen.getByText(/master bedroom thermostat — thermostat/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByText('72°')).toBeInTheDocument();
    expect(screen.getByLabelText('Setpoint')).toBeInTheDocument();
  });

  it('returns null when device is null', () => {
    renderModal(null);
    
    // Assert
    expect(screen.queryByText(/thermostat/i)).not.toBeInTheDocument();
  });

  it('shows correct setpoint and slider value', () => {
    renderModal({ ...mockDevice, setpoint: 68 });
    
    // Assert
    expect(screen.getByText('68°')).toBeInTheDocument();
    expect(screen.getByLabelText('Setpoint')).toHaveValue('68');
  });

  it('uses default setpoint when undefined', () => {
    renderModal({ ...mockDevice, setpoint: undefined });
    
    // Assert
    expect(screen.getByText('72°')).toBeInTheDocument();
    expect(screen.getByLabelText('Setpoint')).toHaveValue('72');
  });

  it('slider has correct min, max, and type', () => {
    renderModal();
    
    // Assert
    const slider = screen.getByLabelText('Setpoint');
    expect(slider).toHaveAttribute('min', '50');
    expect(slider).toHaveAttribute('max', '100');
    expect(slider).toHaveAttribute('type', 'range');
  });

  it('toggle reflects device isOn state (on)', () => {
    renderModal({ ...mockDevice, isOn: true });
    
    // Assert
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('toggle reflects device isOn state (off)', () => {
    renderModal({ ...mockDevice, isOn: false });
    
    // Assert
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('calls onClose when backdrop is clicked', () => {
    renderModal();
    
    // Act
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    
    // Assert
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('calls onToggle with correct params', () => {
    renderModal();
    const checkbox = screen.getByLabelText('Toggle Master Bedroom Thermostat');
    fireEvent.click(checkbox);
    // The handler is called with the current state (true)
    expect(mockOnToggle).toHaveBeenCalledWith('789', true);
  });

  it('calls onRequestDelete with device', () => {
    renderModal();
    
    // Act
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    
    // Assert
    expect(mockOnRequestDelete).toHaveBeenCalledWith(mockDevice);
  });

  it('applies is-off class when device is off', () => {
    renderModal({ ...mockDevice, isOn: false });
    
    // Assert
    const modalCard = screen.getByTestId('modal-card');
    expect(modalCard).toHaveClass('is-off');
  });

  it('has proper aria-labels', () => {
    renderModal();
    
    // Assert
    expect(screen.getByLabelText('Toggle Master Bedroom Thermostat')).toBeInTheDocument();
    expect(screen.getByLabelText('Setpoint')).toHaveAttribute('aria-label', 'Setpoint');
  });

  it('allows editing temperature via dial input', () => {
    renderModal();
    
    // Act
    fireEvent.click(screen.getByText('72°')); // Click the temperature display
    const input = screen.getByRole('textbox'); // Only the temperature input is a textbox
    fireEvent.change(input, { target: { value: '75' } });
    fireEvent.blur(input);
    
    // Assert
    expect(screen.getByText('75°')).toBeInTheDocument();
  });

  it('resets setpoint when device changes', () => {
    const { rerender } = renderModal({ ...mockDevice, setpoint: 65 });
    
    // Act
    fireEvent.change(screen.getByLabelText('Setpoint'), { target: { value: '75' } });
    rerender(
      <ThermostatModal
        device={{ ...mockDevice, deviceId: '999', setpoint: 70 }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByText('70°')).toBeInTheDocument();
  });
});