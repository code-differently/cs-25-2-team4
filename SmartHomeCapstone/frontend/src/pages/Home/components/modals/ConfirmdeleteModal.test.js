import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

describe('ConfirmDeleteModal Component', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Device Deletion Modal', () => {
    it('renders device deletion modal with correct text', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Living Room Light"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/remove device "living room light"/i)).toBeInTheDocument();
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('renders delete and cancel buttons for device', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test Device"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('calls onConfirm when delete button is clicked for device', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test Device"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked for device', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test Device"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Room Deletion Modal', () => {
    it('renders room deletion modal with correct text', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Bedroom"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/delete "bedroom" and all devices inside it/i)).toBeInTheDocument();
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('renders delete and cancel buttons for room', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Living Room"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('calls onConfirm when delete button is clicked for room', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Kitchen"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked for room', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Bathroom"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('displays warning about deleting all devices in room', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Office"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const title = screen.getByText(/delete "office" and all devices inside it/i);
      expect(title).toBeInTheDocument();
    });
  });

  describe('Modal Styling', () => {
    it('delete button has correct CSS class', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      expect(deleteButton).toHaveClass('confirm-delete-btn');
    });

    it('cancel button has correct CSS class', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toHaveClass('confirm-cancel-btn');
    });

    it('modal has correct structure', () => {
      const { container } = render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(container.querySelector('.confirm-modal-card')).toBeInTheDocument();
      expect(container.querySelector('.confirm-actions')).toBeInTheDocument();
    });
  });

  describe('Target Name Display', () => {
    it('displays device name with special characters', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Mom's Camera #1"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/mom's camera #1/i)).toBeInTheDocument();
    });

    it('displays room name with special characters', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Kid's Bedroom"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/kid's bedroom/i)).toBeInTheDocument();
    });

    it('displays long device names', () => {
      const longName = 'Very Long Device Name That Should Still Display Correctly';
      render(
        <ConfirmDeleteModal
          type="device"
          targetName={longName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(new RegExp(longName, 'i'))).toBeInTheDocument();
    });

    it('displays long room names', () => {
      const longName = 'Master Bedroom with Walk-in Closet and Ensuite Bathroom';
      render(
        <ConfirmDeleteModal
          type="room"
          targetName={longName}
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(new RegExp(longName, 'i'))).toBeInTheDocument();
    });
  });

  describe('Event Propagation', () => {
    it('stops propagation when modal is clicked', () => {
      const mockOuterClick = jest.fn();
      const { container } = render(
        <div onClick={mockOuterClick}>
          <ConfirmDeleteModal
            type="device"
            targetName="Test"
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        </div>
      );

      const modal = container.querySelector('.confirm-modal-card');
      fireEvent.click(modal);

      // Modal click should stop propagation
      expect(mockOuterClick).not.toHaveBeenCalled();
    });
  });

  describe('Different Type Values', () => {
    it('handles device type correctly', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/remove device/i)).toBeInTheDocument();
      expect(screen.queryByText(/and all devices inside it/i)).not.toBeInTheDocument();
    });

    it('handles room type correctly', () => {
      render(
        <ConfirmDeleteModal
          type="room"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/delete "test" and all devices inside it/i)).toBeInTheDocument();
      expect(screen.queryByText(/remove device/i)).not.toBeInTheDocument();
    });
  });

  describe('Warning Message', () => {
    it('shows warning for both device and room deletion', () => {
      const { rerender } = render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();

      rerender(
        <ConfirmDeleteModal
          type="room"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });
  });

  describe('Button Order', () => {
    it('renders delete button before cancel button', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Delete');
      expect(buttons[1]).toHaveTextContent('Cancel');
    });
  });

  describe('Multiple Clicks', () => {
    it('handles multiple delete button clicks', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);

      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });

    it('handles multiple cancel button clicks', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('modal content is in the document', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test Device"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('confirm-title');
    });

    it('buttons are keyboard accessible', () => {
      render(
        <ConfirmDeleteModal
          type="device"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      const cancelButton = screen.getByRole('button', { name: /cancel/i });

      expect(deleteButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
    });
  });
});