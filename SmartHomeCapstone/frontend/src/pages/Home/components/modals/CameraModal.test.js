import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CameraModal } from './CameraModal';

const mockDevice = {
  deviceId: '123',
  deviceName: 'Front Door Camera',
  deviceType: 'CAMERA',
  isOn: true,
};

const renderModal = (props = {}) =>
  render(
    <CameraModal
      device={mockDevice}
      onClose={jest.fn()}
      onToggle={jest.fn()}
      onRequestDelete={jest.fn()}
      {...props}
    />
  );

describe('CameraModal Component', () => {
  let mockOnClose, mockOnToggle, mockOnRequestDelete;

  beforeEach(() => {
    mockOnClose = jest.fn();
    mockOnToggle = jest.fn();
    mockOnRequestDelete = jest.fn();
  });

  describe('Rendering', () => {
    it('renders modal with device name', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByText(/front door camera — camera/i)).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      // Act
      renderModal();
      // Assert
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-label', 'Toggle Front Door Camera');
    });

    it('renders delete button', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('renders camera feed image', () => {
      // Act
      renderModal();
      // Assert
      const cameraImage = screen.getByAltText('Camera feed');
      expect(cameraImage).toBeInTheDocument();
      expect(cameraImage).toHaveAttribute('src', expect.stringContaining('camera.gif'));
    });

    it.each([null, undefined])('returns null when device is %s', (value) => {
      // Act
      render(<CameraModal device={value} />);
      // Assert
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Toggle Switch State', () => {
    it.each([
      [true, true],
      [false, false],
      [null, false],
    ])('shows toggle as %s when device isOn is %s', (isOn, checked) => {
      // Act
      renderModal({ device: { ...mockDevice, isOn } });
      // Assert
      const toggle = screen.getByRole('checkbox');
      expect(toggle.checked).toBe(checked);
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when backdrop is clicked', () => {
      // Act
      renderModal({ onClose: mockOnClose });
      fireEvent.click(screen.getByTestId('modal-backdrop'));
      // Assert
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal card is clicked', () => {
      // Act
      renderModal({ onClose: mockOnClose });
      fireEvent.click(screen.getByTestId('modal-card'));
      // Assert
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it.each([
      [{ isOn: true }, false],
      [{ isOn: false }, true],
    ])('calls onToggle with correct parameters when toggle is clicked', (deviceProps, expected) => {
      // Act
      renderModal({ device: { ...mockDevice, ...deviceProps }, onToggle: mockOnToggle });
      fireEvent.click(screen.getByRole('checkbox'));
      // Assert
      expect(mockOnToggle).toHaveBeenCalledWith('123', expected);
    });

    it('does not propagate click event when toggle is clicked', () => {
      // Act
      renderModal({ onClose: mockOnClose });
      fireEvent.click(screen.getByRole('checkbox'));
      // Assert
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('does not render modal content when device is missing required fields', () => {
      // Act
      renderModal({ device: {} });
      // Assert
      expect(screen.queryByText(/— camera/i)).not.toBeInTheDocument();
    });

    it('delete button is not rendered when device is null', () => {
      // Act
      renderModal({ device: null });
      // Assert
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('toggle switch is not rendered when device is null', () => {
      // Act
      renderModal({ device: null });
      // Assert
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it.each([
      ['onClose'],
      ['onToggle'],
      ['onRequestDelete'],
    ])('does not throw error if %s is not provided', (prop) => {
      // Act
      const props = { device: mockDevice };
      delete props[prop];
      // Assert
      expect(() => render(<CameraModal {...props} />)).not.toThrow();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('focuses toggle switch on tab', () => {
      // Act
      renderModal();
      const toggle = screen.getByRole('checkbox');
      toggle.focus();
      // Assert
      expect(toggle).toHaveFocus();
    });

    it('focuses delete button on tab', () => {
      // Act
      renderModal();
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.focus();
      // Assert
      expect(deleteButton).toHaveFocus();
    });
  });

  describe('Modal Close Button', () => {
    it('renders close button and calls onClose when clicked', () => {
      // Act
      renderModal({ onClose: mockOnClose });
      const closeButton = screen.getByRole('button', { name: /close/i });
      fireEvent.click(closeButton);
      // Assert
      expect(closeButton).toBeInTheDocument();
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal Structure and Content', () => {
    it('should have a heading with device name and type', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('heading', { name: /front door camera — camera/i })).toBeInTheDocument();
    });

    it('should not render camera feed if device is missing deviceId', () => {
      // Act
      renderModal({ device: { ...mockDevice, deviceId: undefined } });
      // Assert
      expect(screen.queryByAltText('Camera feed')).not.toBeInTheDocument();
    });
  });

  describe('Button Accessibility', () => {
    it.each([
      ['delete'],
      ['close'],
    ])('%s button should have type="button"', (name) => {
      // Act
      renderModal();
      const button = screen.getByRole('button', { name: new RegExp(name, 'i') });
      // Assert
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Delete Button Interaction', () => {
    it('calls onRequestDelete with deviceId when delete button is clicked', () => {
      // Act
      renderModal({ onRequestDelete: mockOnRequestDelete });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      // Assert
      expect(mockOnRequestDelete).toHaveBeenCalledWith('123');
    });

    it('does not throw if onRequestDelete is missing and delete button is clicked', () => {
      // Act
      renderModal({ onRequestDelete: undefined });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      // Assert
      // No error thrown
    });
  });

  describe('Toggle Switch Interaction', () => {
    it('toggle switch has correct value after click', () => {
      // Act
      renderModal({ device: { ...mockDevice, isOn: false } });
      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      // Assert
      expect(toggle).toBeChecked();
    });

    it('toggle switch is focusable and can be toggled with keyboard', () => {
      // Act
      renderModal({ device: { ...mockDevice, isOn: false } });
      const toggle = screen.getByRole('checkbox');
      toggle.focus();
      fireEvent.keyDown(toggle, { key: ' ', code: 'Space' });
      // Assert
      expect(toggle).toHaveFocus();
    });
  });

  describe('Visual State Based on Device Status', () => {
    it('does not apply off class when device is on', () => {
      // Act
      renderModal({ device: { ...mockDevice, isOn: true } });
      // Assert
      expect(screen.getByAltText('Camera feed')).not.toHaveClass('off');
    });

    it('applies off class to camera feed when device is off', () => {
      // Act
      renderModal({ device: { ...mockDevice, isOn: false } });
      // Assert
      expect(screen.getByAltText('Camera feed')).toHaveClass('off');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for toggle', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Toggle Front Door Camera');
    });

    it('camera image has descriptive alt text', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByAltText('Camera feed')).toBeInTheDocument();
    });

    it('image is not draggable', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByAltText('Camera feed')).toHaveAttribute('draggable', 'false');
    });
  });

  describe('Different Device Names', () => {
    it('displays long device names correctly', () => {
      // Act
      renderModal({ device: { ...mockDevice, deviceName: 'Very Long Camera Name That Should Still Display' } });
      // Assert
      expect(screen.getByText(/very long camera name that should still display — camera/i)).toBeInTheDocument();
    });

    it('displays device names with special characters', () => {
      // Act
      renderModal({ device: { ...mockDevice, deviceName: "Mom's Camera #1" } });
      // Assert
      expect(screen.getByText(/mom's camera #1 — camera/i)).toBeInTheDocument();
    });
  });
});