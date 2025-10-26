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
      renderModal();
      expect(screen.getByText(/front door camera — camera/i)).toBeInTheDocument();
    });

    it('renders toggle switch', () => {
      renderModal();
      const toggle = screen.getByRole('checkbox');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-label', 'Toggle Front Door Camera');
    });

    it('renders delete button', () => {
      renderModal();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('renders camera feed image', () => {
      renderModal();
      const cameraImage = screen.getByAltText('Camera feed');
      expect(cameraImage).toBeInTheDocument();
      expect(cameraImage).toHaveAttribute('src', expect.stringContaining('camera.gif'));
    });

    it.each([null, undefined])('returns null when device is %s', (value) => {
      render(<CameraModal device={value} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  describe('Toggle Switch State', () => {
    it.each([
      [true, true],
      [false, false],
      [null, false],
    ])('shows toggle as %s when device isOn is %s', (isOn, checked) => {
      renderModal({ device: { ...mockDevice, isOn } });
      const toggle = screen.getByRole('checkbox');
      expect(toggle.checked).toBe(checked);
    });
  });

  describe('User Interactions', () => {
    it('calls onClose when backdrop is clicked', () => {
      renderModal({ onClose: mockOnClose });
      fireEvent.click(screen.getByTestId('modal-backdrop'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when modal card is clicked', () => {
      renderModal({ onClose: mockOnClose });
      fireEvent.click(screen.getByTestId('modal-card'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it.each([
      [{ isOn: true }, false],
      [{ isOn: false }, true],
    ])('calls onToggle with correct parameters when toggle is clicked', (deviceProps, expected) => {
      renderModal({ device: { ...mockDevice, ...deviceProps }, onToggle: mockOnToggle });
      fireEvent.click(screen.getByRole('checkbox'));
      expect(mockOnToggle).toHaveBeenCalledWith('123', expected);
    });

    it('does not propagate click event when toggle is clicked', () => {
      renderModal({ onClose: mockOnClose });
      fireEvent.click(screen.getByRole('checkbox'));
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases and Robustness', () => {
    it('does not render modal content when device is missing required fields', () => {
      renderModal({ device: {} });
      expect(screen.queryByText(/— camera/i)).not.toBeInTheDocument();
    });

    it('delete button is not rendered when device is null', () => {
      renderModal({ device: null });
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });

    it('toggle switch is not rendered when device is null', () => {
      renderModal({ device: null });
      expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    });

    it.each([
      ['onClose'],
      ['onToggle'],
      ['onRequestDelete'],
    ])('does not throw error if %s is not provided', (prop) => {
      const props = { device: mockDevice };
      delete props[prop];
      expect(() => render(<CameraModal {...props} />)).not.toThrow();
    });
  });

  describe('Keyboard Accessibility', () => {
    it('focuses toggle switch on tab', () => {
      renderModal();
      const toggle = screen.getByRole('checkbox');
      toggle.focus();
      expect(toggle).toHaveFocus();
    });

    it('focuses delete button on tab', () => {
      renderModal();
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      deleteButton.focus();
      expect(deleteButton).toHaveFocus();
    });
  });

  describe('Modal Close Button', () => {
    it('renders close button and calls onClose when clicked', () => {
      renderModal({ onClose: mockOnClose });
      const closeButton = screen.getByRole('button', { name: /close/i });
      expect(closeButton).toBeInTheDocument();
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modal Structure and Content', () => {
    it('should have a heading with device name and type', () => {
      renderModal();
      expect(screen.getByRole('heading', { name: /front door camera — camera/i })).toBeInTheDocument();
    });

    it('should not render camera feed if device is missing deviceId', () => {
      renderModal({ device: { ...mockDevice, deviceId: undefined } });
      expect(screen.queryByAltText('Camera feed')).not.toBeInTheDocument();
    });
  });

  describe('Button Accessibility', () => {
    it.each([
      ['delete'],
      ['close'],
    ])('%s button should have type="button"', (name) => {
      renderModal();
      const button = screen.getByRole('button', { name: new RegExp(name, 'i') });
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Delete Button Interaction', () => {
    it('calls onRequestDelete with deviceId when delete button is clicked', () => {
      renderModal({ onRequestDelete: mockOnRequestDelete });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      expect(mockOnRequestDelete).toHaveBeenCalledWith('123');
    });

    it('does not throw if onRequestDelete is missing and delete button is clicked', () => {
      renderModal({ onRequestDelete: undefined });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    });
  });

  describe('Toggle Switch Interaction', () => {
    it('toggle switch has correct value after click', () => {
      renderModal({ device: { ...mockDevice, isOn: false } });
      const toggle = screen.getByRole('checkbox');
      fireEvent.click(toggle);
      expect(toggle).toBeChecked();
    });

    it('toggle switch is focusable and can be toggled with keyboard', () => {
      renderModal({ device: { ...mockDevice, isOn: false } });
      const toggle = screen.getByRole('checkbox');
      toggle.focus();
      fireEvent.keyDown(toggle, { key: ' ', code: 'Space' });
      expect(toggle).toHaveFocus();
    });
  });

  describe('Visual State Based on Device Status', () => {
    it('does not apply off class when device is on', () => {
      renderModal({ device: { ...mockDevice, isOn: true } });
      expect(screen.getByAltText('Camera feed')).not.toHaveClass('off');
    });

    it('applies off class to camera feed when device is off', () => {
      renderModal({ device: { ...mockDevice, isOn: false } });
      expect(screen.getByAltText('Camera feed')).toHaveClass('off');
    });
  });

  describe('Accessibility', () => {
    it('has proper aria-label for toggle', () => {
      renderModal();
      expect(screen.getByRole('checkbox')).toHaveAttribute('aria-label', 'Toggle Front Door Camera');
    });

    it('camera image has descriptive alt text', () => {
      renderModal();
      expect(screen.getByAltText('Camera feed')).toBeInTheDocument();
    });

    it('image is not draggable', () => {
      renderModal();
      expect(screen.getByAltText('Camera feed')).toHaveAttribute('draggable', 'false');
    });
  });

  describe('Different Device Names', () => {
    it('displays long device names correctly', () => {
      renderModal({ device: { ...mockDevice, deviceName: 'Very Long Camera Name That Should Still Display' } });
      expect(screen.getByText(/very long camera name that should still display — camera/i)).toBeInTheDocument();
    });

    it('displays device names with special characters', () => {
      renderModal({ device: { ...mockDevice, deviceName: "Mom's Camera #1" } });
      expect(screen.getByText(/mom's camera #1 — camera/i)).toBeInTheDocument();
    });
  });
});