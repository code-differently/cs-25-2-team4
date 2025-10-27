import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LightModal } from './LightModal';

const mockDevice = {
  deviceId: '456',
  deviceName: 'Living Room Light',
  deviceType: 'LIGHT',
  isOn: true,
  brightness: 75,
};

const mockOnClose = jest.fn();
const mockOnToggle = jest.fn();
const mockOnRequestDelete = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe('LightModal Component', () => {
  it('renders modal elements', () => {
    render(
      <LightModal
        device={mockDevice}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByText(/living room light — light/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByAltText('Color wheel')).toHaveAttribute('src', '/assets/light-wheel.png');
    expect(screen.getByLabelText('Brightness')).toHaveValue('75');
  });

  it('does not render modal elements when device is null', () => {
    render(
      <LightModal
        device={null}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.queryByText(/living room light/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Brightness')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('toggle switch reflects device state', () => {
    const { rerender } = render(
      <LightModal
        device={{ ...mockDevice, isOn: true }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    const toggle = screen.getAllByRole('checkbox')[0];
    expect(toggle).toBeChecked();

    // Act
    rerender(
      <LightModal
        device={{ ...mockDevice, isOn: false }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    const toggleAfter = screen.getAllByRole('checkbox')[0];
    expect(toggleAfter).not.toBeChecked();
  });

  it('reflects brightness prop and disables slider when off', () => {
    const { rerender } = render(
      <LightModal
        device={{ ...mockDevice, brightness: 40 }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByLabelText('Brightness')).toHaveValue('40');
    
    // Act
    rerender(
      <LightModal
        device={{ ...mockDevice, brightness: 90 }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByLabelText('Brightness')).toHaveValue('90');

    // Act
    rerender(
      <LightModal
        device={{ ...mockDevice, isOn: false }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByLabelText('Brightness')).toBeDisabled();
  });

  it('toggle switch calls onToggle when clicked', () => {
    render(
      <LightModal
        device={{ ...mockDevice, isOn: true }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Act
    const checkbox = screen.getByLabelText('Toggle Living Room Light');
    fireEvent.click(checkbox);
    
    // Assert
    // The handler is called with the current state (true)
    expect(mockOnToggle).toHaveBeenCalledWith('456', true);
  });

  it('does not render toggle when device is null', () => {
    render(
      <LightModal
        device={null}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('brightness slider displays and updates value, handles edge cases', () => {
    const { rerender } = render(
      <LightModal
        device={{ ...mockDevice, brightness: 60 }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    const slider = screen.getByLabelText('Brightness');
    expect(slider).toHaveValue('60');
    
    // Act
    fireEvent.change(slider, { target: { value: '85' } });
    
    // Assert
    expect(slider).toHaveValue('85');
    expect(screen.getByText('85')).toBeInTheDocument();

    // Act
    rerender(
      <LightModal
        device={{ ...mockDevice, brightness: 0 }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByLabelText('Brightness')).toHaveValue('0');
    expect(screen.getByText('0')).toBeInTheDocument();

    // Act
    rerender(
      <LightModal
        device={{ ...mockDevice, brightness: 100 }}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByLabelText('Brightness')).toHaveValue('100');
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('color wheel image displays and shows fallback on error', async () => {
    render(
      <LightModal
        device={mockDevice}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    const colorWheelImage = screen.getByAltText('Color wheel');
    expect(colorWheelImage).toHaveAttribute('src', '/assets/light-wheel.png');
    
    // Act
    fireEvent.error(colorWheelImage);
    
    // Assert
    await waitFor(() => {
      expect(screen.getByRole('img', { name: 'Color wheel' })).toHaveClass('fallback');
    });
  });

  it('has proper accessibility attributes', () => {
    render(
      <LightModal
        device={mockDevice}
        onClose={mockOnClose}
        onToggle={mockOnToggle}
        onRequestDelete={mockOnRequestDelete}
      />
    );
    
    // Assert
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Toggle Living Room Light');
    expect(screen.getByLabelText('Brightness')).toHaveAttribute('aria-label', 'Brightness');
    expect(screen.getByRole('img', { name: /color wheel/i })).toBeInTheDocument();
  });
});