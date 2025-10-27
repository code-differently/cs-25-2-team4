import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

const mockOnConfirm = jest.fn();
const mockOnCancel = jest.fn();

const renderModal = (props = {}) =>
  render(
    <ConfirmDeleteModal
      type="device"
      targetName="Test"
      onConfirm={mockOnConfirm}
      onCancel={mockOnCancel}
      {...props}
    />
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe('ConfirmDeleteModal Component', () => {
  describe('Device Deletion Modal', () => {
    it('renders device deletion modal with correct text', () => {
      // Act
      renderModal({ type: "device", targetName: "Living Room Light" });
      // Assert
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.textContent).toMatch(/remove device/i);
      expect(heading.textContent).toMatch(/living room light/i);
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('renders delete and cancel buttons for device', () => {
      // Act
      renderModal({ type: "device", targetName: "Test Device" });
      // Assert
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('calls onConfirm when delete button is clicked for device', () => {
      // Act
      renderModal({ type: "device", targetName: "Test Device" });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked for device', () => {
      // Act
      renderModal({ type: "device", targetName: "Test Device" });
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });
  });

  describe('Room Deletion Modal', () => {
    it('renders room deletion modal with correct text', () => {
      // Act
      renderModal({ type: "room", targetName: "Bedroom" });
      // Assert
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.textContent).toMatch(/delete/i);
      expect(heading.textContent).toMatch(/bedroom/i);
      expect(heading.textContent).toMatch(/and all devices inside it/i);
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });

    it('renders delete and cancel buttons for room', () => {
      // Act
      renderModal({ type: "room", targetName: "Living Room" });
      // Assert
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });

    it('calls onConfirm when delete button is clicked for room', () => {
      // Act
      renderModal({ type: "room", targetName: "Kitchen" });
      fireEvent.click(screen.getByRole('button', { name: /delete/i }));
      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(1);
      expect(mockOnCancel).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked for room', () => {
      // Act
      renderModal({ type: "room", targetName: "Bathroom" });
      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(1);
      expect(mockOnConfirm).not.toHaveBeenCalled();
    });

    it('displays warning about deleting all devices in room', () => {
      // Act
      renderModal({ type: "room", targetName: "Office" });
      // Assert
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.textContent).toMatch(/delete/i);
      expect(heading.textContent).toMatch(/office/i);
      expect(heading.textContent).toMatch(/and all devices inside it/i);
    });
  });

  describe('Modal Styling', () => {
    it('delete button has correct CSS class', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('button', { name: /delete/i })).toHaveClass('confirm-delete-btn');
    });

    it('cancel button has correct CSS class', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('button', { name: /cancel/i })).toHaveClass('confirm-cancel-btn');
    });

    it('modal has correct structure', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });

  describe('Target Name Display', () => {
    it.each([
      ["device", "Mom's Camera #1"],
      ["room", "Kid's Bedroom"],
      ["device", "Very Long Device Name That Should Still Display Correctly"],
      ["room", "Master Bedroom with Walk-in Closet and Ensuite Bathroom"]
    ])('displays %s name with special/long characters: %s', (type, name) => {
      // Act
      renderModal({ type, targetName: name });
      // Assert
      expect(screen.getByText(new RegExp(name, 'i'))).toBeInTheDocument();
    });
  });

  describe('Event Propagation', () => {
    it('stops propagation when modal is clicked', () => {
      // Act
      const mockOuterClick = jest.fn();
      render(
        <div onClick={mockOuterClick}>
          <ConfirmDeleteModal
            type="device"
            targetName="Test"
            onConfirm={mockOnConfirm}
            onCancel={mockOnCancel}
          />
        </div>
      );
      fireEvent.click(screen.getByRole('dialog'));
      // Assert
      expect(mockOuterClick).not.toHaveBeenCalled();
    });
  });

  describe('Different Type Values', () => {
    it('handles device type correctly', () => {
      // Act
      renderModal({ type: "device", targetName: "Test" });
      // Assert
      expect(screen.getByText(/remove device/i)).toBeInTheDocument();
      expect(screen.queryByText(/and all devices inside it/i)).not.toBeInTheDocument();
    });

    it('handles room type correctly', () => {
      // Act
      renderModal({ type: "room", targetName: "Test" });
      // Assert
      const heading = screen.getByRole('heading', { level: 3 });
      expect(heading.textContent).toMatch(/delete/i);
      expect(heading.textContent).toMatch(/test/i);
      expect(heading.textContent).toMatch(/and all devices inside it/i);
      expect(screen.queryByText(/remove device/i)).not.toBeInTheDocument();
    });
  });

  describe('Warning Message', () => {
    it('shows warning for both device and room deletion', () => {
      // Act
      const { rerender } = renderModal({ type: "device", targetName: "Test" });
      // Assert
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();

      // Act
      rerender(
        <ConfirmDeleteModal
          type="room"
          targetName="Test"
          onConfirm={mockOnConfirm}
          onCancel={mockOnCancel}
        />
      );
      // Assert
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument();
    });
  });

  describe('Button Order', () => {
    it('renders delete button before cancel button', () => {
      // Act
      renderModal();
      // Assert
      const buttons = screen.getAllByRole('button');
      expect(buttons[0]).toHaveTextContent('Delete');
      expect(buttons[1]).toHaveTextContent('Cancel');
    });
  });

  describe('Multiple Clicks', () => {
    it('handles multiple delete button clicks', () => {
      // Act
      renderModal();
      const deleteButton = screen.getByRole('button', { name: /delete/i });
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      fireEvent.click(deleteButton);
      // Assert
      expect(mockOnConfirm).toHaveBeenCalledTimes(3);
    });

    it('handles multiple cancel button clicks', () => {
      // Act
      renderModal();
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      fireEvent.click(cancelButton);
      fireEvent.click(cancelButton);
      // Assert
      expect(mockOnCancel).toHaveBeenCalledTimes(2);
    });
  });

  describe('Accessibility', () => {
    it('modal content is in the document', () => {
      // Act
      renderModal({ type: "device", targetName: "Test Device" });
      // Assert
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveClass('confirm-title');
    });

    it('buttons are keyboard accessible', () => {
      // Act
      renderModal();
      // Assert
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
    });
  });
});