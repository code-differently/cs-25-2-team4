import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThermostatModal } from './ThermostatModal';

describe('ThermostatModal Component', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders modal with device name', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText(/master bedroom thermostat — thermostat/i)).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeInTheDocument();
    });

    it('renders delete button', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('renders temperature dial', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('72°')).toBeInTheDocument();
    });

    it('renders setpoint slider', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('Setpoint')).toBeInTheDocument();
      expect(screen.getByLabelText('Setpoint')).toBeInTheDocument();
    });

    it('returns null when device is null', () => {
      const { container } = render(
        <ThermostatModal
          device={null}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Temperature Display', () => {
    it('displays device setpoint value', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, setpoint: 68 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('68°')).toBeInTheDocument();
      const slider = screen.getByLabelText('Setpoint');
      expect(slider).toHaveValue('68');
    });

    it('uses default setpoint of 72 when device setpoint is undefined', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, setpoint: undefined }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('72°')).toBeInTheDocument();
      const slider = screen.getByLabelText('Setpoint');
      expect(slider).toHaveValue('72');
    });

    it('updates temperature when slider is changed', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Setpoint');
      fireEvent.change(slider, { target: { value: '75' } });

      expect(screen.getByText('75°')).toBeInTheDocument();
      expect(slider).toHaveValue('75');
    });

    it('handles minimum temperature (50)', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, setpoint: 50 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('50°')).toBeInTheDocument();
    });

    it('handles maximum temperature (100)', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, setpoint: 100 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('100°')).toBeInTheDocument();
    });
  });

  describe('Setpoint Slider', () => {
    it('slider has correct min and max values', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Setpoint');
      expect(slider).toHaveAttribute('min', '50');
      expect(slider).toHaveAttribute('max', '100');
      expect(slider).toHaveAttribute('type', 'range');
    });
  });

  describe('Temperature Dial Editing', () => {
    it('enters edit mode when dial is clicked', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      // Should show input in edit mode
      const input = screen.getByDisplayValue('72');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('temperature-input');
    });

    it('input is auto-focused when entering edit mode', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      expect(input).toHaveFocus();
    });

    it('allows typing numbers in edit mode', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '75' } });

      expect(input).toHaveValue('75');
    });

    it('prevents non-numeric input', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: 'abc' } });

      // Should not change from 72
      expect(input).toHaveValue('72');
    });

    it('allows empty string during typing', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '' } });

      expect(input).toHaveValue('');
    });

    it('exits edit mode and updates temperature on blur', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '80' } });
      fireEvent.blur(input);

      // Should exit edit mode and show new value
      expect(screen.getByText('80°')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('80')).not.toBeInTheDocument();
    });

    it('clamps temperature to minimum (50) on blur', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '30' } });
      fireEvent.blur(input);

      expect(screen.getByText('50°')).toBeInTheDocument();
    });

    it('clamps temperature to maximum (100) on blur', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '150' } });
      fireEvent.blur(input);

      expect(screen.getByText('100°')).toBeInTheDocument();
    });

    it('reverts to previous value on blur if input is empty', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(screen.getByText('72°')).toBeInTheDocument();
    });

    it('exits edit mode on Enter key', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '78' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(screen.getByText('78°')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('78')).not.toBeInTheDocument();
    });

    it('cancels edit mode on Escape key', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      fireEvent.change(input, { target: { value: '88' } });
      fireEvent.keyDown(input, { key: 'Escape' });

      // Should revert to original value
      expect(screen.getByText('72°')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('88')).not.toBeInTheDocument();
    });

    it('input has maxLength of 3', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      fireEvent.click(dial);

      const input = screen.getByDisplayValue('72');
      expect(input).toHaveAttribute('maxLength', '3');
    });
  });

  describe('Toggle Switch State', () => {
    it('shows toggle as checked when device is on', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeChecked();
    });

    it('shows toggle as unchecked when device is off', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, isOn: false }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).not.toBeChecked();
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when backdrop is clicked', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const backdrop = screen.getByRole('checkbox').closest('.modal-backdrop');
      fireEvent.click(backdrop);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal card is clicked', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/master bedroom thermostat — thermostat/i).closest('.modal-card');
      fireEvent.click(modalCard);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onToggle with correct parameters when toggle is clicked', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      fireEvent.change(toggle);

      expect(mockOnToggle).toHaveBeenCalledWith('789', true);
    });

    it('calls onRequestDelete with device when delete button is clicked', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockOnRequestDelete).toHaveBeenCalledWith(mockDevice);
    });
  });

  describe('Visual State Based on Device Status', () => {
    it('does not apply is-off class when device is on', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/master bedroom thermostat — thermostat/i).closest('.modal-card');
      expect(modalCard).not.toHaveClass('is-off');
    });

    it('applies is-off class when device is off', () => {
      render(
        <ThermostatModal
          device={{ ...mockDevice, isOn: false }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/master bedroom thermostat — thermostat/i).closest('.modal-card');
      expect(modalCard).toHaveClass('is-off');
    });

    it('applies editing class to dial when in edit mode', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const dial = screen.getByText('72°').closest('.temperature-dial');
      expect(dial).not.toHaveClass('editing');

      fireEvent.click(dial);

      const editingDial = screen.getByDisplayValue('72').closest('.temperature-dial');
      expect(editingDial).toHaveClass('editing');
    });
  });

  describe('State Management', () => {
    it('resets setpoint to device value when device changes', () => {
      const { rerender } = render(
        <ThermostatModal
          device={{ ...mockDevice, setpoint: 65 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('65°')).toBeInTheDocument();

      // Change setpoint locally
      const slider = screen.getByLabelText('Setpoint');
      fireEvent.change(slider, { target: { value: '75' } });
      expect(screen.getByText('75°')).toBeInTheDocument();

      // Change device (simulating prop update)
      rerender(
        <ThermostatModal
          device={{ ...mockDevice, deviceId: '999', setpoint: 70 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      // Should reset to new device's setpoint
      expect(screen.getByText('70°')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for toggle', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-label', 'Toggle Master Bedroom Thermostat');
    });

    it('setpoint slider has accessible label', () => {
      render(
        <ThermostatModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Setpoint');
      expect(slider).toHaveAttribute('aria-label', 'Setpoint');
    });
  });
});