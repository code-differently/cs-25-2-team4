import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { LightModal } from './LightModal';

describe('LightModal Component', () => {
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
  });

  describe('Rendering', () => {
    it('renders modal with device name', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText(/living room light — light/i)).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      render(
        <LightModal
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
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('renders brightness control', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('Brightness')).toBeInTheDocument();
      expect(screen.getByLabelText('Brightness')).toBeInTheDocument();
    });

    it('renders brightness value bubble', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('75')).toBeInTheDocument();
    });

    it('renders color wheel', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const colorWheel = screen.getByAltText('Color wheel');
      expect(colorWheel).toBeInTheDocument();
    });

    it('returns null when device is null', () => {
      const { container } = render(
        <LightModal
          device={null}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Brightness Control', () => {
    it('displays device brightness value', () => {
      render(
        <LightModal
          device={{ ...mockDevice, brightness: 60 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      expect(slider).toHaveValue('60');
      expect(screen.getByText('60')).toBeInTheDocument();
    });

    it('uses default brightness of 60 when device brightness is undefined', () => {
      render(
        <LightModal
          device={{ ...mockDevice, brightness: undefined }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      expect(slider).toHaveValue('60');
      expect(screen.getByText('60')).toBeInTheDocument();
    });

    it('updates brightness value when slider is changed', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      fireEvent.change(slider, { target: { value: '85' } });

      expect(slider).toHaveValue('85');
      expect(screen.getByText('85')).toBeInTheDocument();
    });

    it('handles brightness value of 0', () => {
      render(
        <LightModal
          device={{ ...mockDevice, brightness: 0 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      expect(slider).toHaveValue('0');
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('handles brightness value of 100', () => {
      render(
        <LightModal
          device={{ ...mockDevice, brightness: 100 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      expect(slider).toHaveValue('100');
      expect(screen.getByText('100')).toBeInTheDocument();
    });

    it('brightness slider has correct min and max values', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      expect(slider).toHaveAttribute('min', '0');
      expect(slider).toHaveAttribute('max', '100');
      expect(slider).toHaveAttribute('type', 'range');
    });
  });

  describe('Toggle Switch State', () => {
    it('shows toggle as checked when device is on', () => {
      render(
        <LightModal
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
        <LightModal
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
        <LightModal
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
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/living room light — light/i).closest('.modal-card');
      fireEvent.click(modalCard);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onToggle with correct parameters when toggle is clicked', () => {
      render(
        <LightModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      fireEvent.change(toggle);

      expect(mockOnToggle).toHaveBeenCalledWith('456', true);
    });

    it('calls onRequestDelete with device when delete button is clicked', () => {
      render(
        <LightModal
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

    it('stops event propagation when toggle is clicked', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggleLabel = screen.getByRole('checkbox').closest('label');
      fireEvent.click(toggleLabel);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Visual State Based on Device Status', () => {
    it('does not apply is-off class when device is on', () => {
      render(
        <LightModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/living room light — light/i).closest('.modal-card');
      expect(modalCard).not.toHaveClass('is-off');
    });

    it('applies is-off class when device is off', () => {
      render(
        <LightModal
          device={{ ...mockDevice, isOn: false }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/living room light — light/i).closest('.modal-card');
      expect(modalCard).toHaveClass('is-off');
    });
  });

  describe('Color Wheel', () => {
    it('displays color wheel image', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const colorWheelImage = screen.getByAltText('Color wheel');
      expect(colorWheelImage).toHaveAttribute('src', '/assets/light-wheel.png');
    });

    it('shows fallback color wheel on image error', async () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const colorWheelImage = screen.getByAltText('Color wheel');
      
      // Trigger image error
      fireEvent.error(colorWheelImage);

      await waitFor(() => {
        const fallback = screen.getByRole('img', { name: 'Color wheel' });
        expect(fallback).toHaveClass('fallback');
      });
    });
  });

  describe('Brightness State Management', () => {
    it('resets brightness to device value when device changes', () => {
      const { rerender } = render(
        <LightModal
          device={{ ...mockDevice, brightness: 50 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText('50')).toBeInTheDocument();

      // Change brightness locally
      const slider = screen.getByLabelText('Brightness');
      fireEvent.change(slider, { target: { value: '75' } });
      expect(screen.getByText('75')).toBeInTheDocument();

      // Change device (simulating prop update)
      rerender(
        <LightModal
          device={{ ...mockDevice, deviceId: '789', brightness: 90 }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      // Should reset to new device's brightness
      expect(screen.getByText('90')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for toggle', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-label', 'Toggle Living Room Light');
    });

    it('brightness slider has accessible label', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const slider = screen.getByLabelText('Brightness');
      expect(slider).toHaveAttribute('aria-label', 'Brightness');
    });

    it('color wheel has alt text', () => {
      render(
        <LightModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const colorWheel = screen.getByRole('img', { name: /color wheel/i });
      expect(colorWheel).toBeInTheDocument();
    });
  });
});