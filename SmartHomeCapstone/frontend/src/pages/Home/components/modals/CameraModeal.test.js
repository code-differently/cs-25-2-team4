import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CameraModal } from './CameraModal';

describe('CameraModal Component', () => {
  const mockDevice = {
    deviceId: '123',
    deviceName: 'Front Door Camera',
    deviceType: 'CAMERA',
    isOn: true,
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
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText(/front door camera — camera/i)).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-label', 'Toggle Front Door Camera');
    });

    it('renders delete button', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('renders camera feed image', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const cameraImage = screen.getByAltText('Camera feed');
      expect(cameraImage).toBeInTheDocument();
      expect(cameraImage).toHaveAttribute('src', expect.stringContaining('camera.gif'));
    });

    it('returns null when device is null', () => {
      const { container } = render(
        <CameraModal
          device={null}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('returns null when device is undefined', () => {
      const { container } = render(
        <CameraModal
          device={undefined}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Toggle Switch State', () => {
    it('shows toggle as checked when device is on', () => {
      render(
        <CameraModal
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
        <CameraModal
          device={{ ...mockDevice, isOn: false }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).not.toBeChecked();
    });

    it('handles falsy isOn values correctly', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, isOn: null }}
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
        <CameraModal
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
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const modalCard = screen.getByText(/front door camera — camera/i).closest('.modal-card');
      fireEvent.click(modalCard);

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onToggle with correct parameters when toggle is clicked', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      fireEvent.change(toggle);

      expect(mockOnToggle).toHaveBeenCalledWith('123', true);
    });

    it('calls onToggle when device is off', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, isOn: false }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      fireEvent.change(toggle);

      expect(mockOnToggle).toHaveBeenCalledWith('123', false);
    });

    it('does not propagate click event when toggle is clicked', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggleLabel = screen.getByRole('checkbox').closest('label');
      fireEvent.click(toggleLabel);

      // onClose should not be called due to stopPropagation
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onRequestDelete with device when delete button is clicked', () => {
      render(
        <CameraModal
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

    it('does not propagate click event when delete button is clicked', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      // onClose should not be called due to stopPropagation
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Visual State Based on Device Status', () => {
    it('does not apply off class when device is on', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, isOn: true }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const cameraFeed = screen.getByAltText('Camera feed').parentElement;
      expect(cameraFeed).not.toHaveClass('off');
    });

    it('applies off class to camera feed when device is off', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, isOn: false }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const cameraFeed = screen.getByAltText('Camera feed').parentElement;
      expect(cameraFeed).toHaveClass('off');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for toggle', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const toggle = screen.getByRole('checkbox');
      expect(toggle).toHaveAttribute('aria-label', 'Toggle Front Door Camera');
    });

    it('camera image has descriptive alt text', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByAltText('Camera feed')).toBeInTheDocument();
    });

    it('image is not draggable', () => {
      render(
        <CameraModal
          device={mockDevice}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      const image = screen.getByAltText('Camera feed');
      expect(image).toHaveAttribute('draggable', 'false');
    });
  });

  describe('Different Device Names', () => {
    it('displays long device names correctly', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, deviceName: 'Very Long Camera Name That Should Still Display' }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText(/very long camera name that should still display — camera/i)).toBeInTheDocument();
    });

    it('displays device names with special characters', () => {
      render(
        <CameraModal
          device={{ ...mockDevice, deviceName: "Mom's Camera #1" }}
          onClose={mockOnClose}
          onToggle={mockOnToggle}
          onRequestDelete={mockOnRequestDelete}
        />
      );

      expect(screen.getByText(/mom's camera #1 — camera/i)).toBeInTheDocument();
    });
  });
});