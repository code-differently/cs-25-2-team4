import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DevicesList } from './DevicesList';

describe('DevicesList Component', () => {
  const mockDevices = [
    {
      deviceId: '1',
      deviceName: 'Living Room Light',
      deviceType: 'LIGHT',
      isOn: true,
      roomId: '101'
    },
    {
      deviceId: '2',
      deviceName: 'Bedroom Camera',
      deviceType: 'CAMERA',
      isOn: false,
      roomId: '102'
    },
    {
      deviceId: '3',
      deviceName: 'Kitchen Thermostat',
      deviceType: 'THERMOSTAT',
      isOn: true,
      roomId: '101'
    }
  ];

  const mockRooms = [
    { name: 'All', active: true },
    { name: 'Living Room', id: '101', active: false },
    { name: 'Bedroom', id: '102', active: false }
  ];

  const mockOnToggle = jest.fn();
  const mockOnCameraOpen = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering Devices', () => {
    it('renders all devices when "All" room is active', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Living Room Light')).toBeInTheDocument();
      expect(screen.getByText('Bedroom Camera')).toBeInTheDocument();
      expect(screen.getByText('Kitchen Thermostat')).toBeInTheDocument();
    });

    it('renders only devices from active room', () => {
      const activeRooms = [
        { name: 'All', active: false },
        { name: 'Living Room', id: '101', active: true },
        { name: 'Bedroom', id: '102', active: false }
      ];

      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="Living Room"
          rooms={activeRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Living Room Light')).toBeInTheDocument();
      expect(screen.getByText('Kitchen Thermostat')).toBeInTheDocument();
      expect(screen.queryByText('Bedroom Camera')).not.toBeInTheDocument();
    });

    it('renders each device with correct status', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const cards = screen.getAllByTestId('device-card');
      expect(cards[0]).toHaveTextContent('ON');
      expect(cards[1]).toHaveTextContent('OFF');
      expect(cards[2]).toHaveTextContent('ON');
    });

    it('applies correct CSS classes based on device state', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const cards = screen.getAllByTestId('device-card');
      expect(cards[0]).toHaveClass('is-on');
      expect(cards[1]).toHaveClass('is-off');
    });
  });

  describe('Device Toggles', () => {
    it('renders toggle switches for all devices', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const toggles = screen.getAllByRole('checkbox');
      expect(toggles).toHaveLength(3);
    });

    it('toggle switch reflects device on/off state', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const toggles = screen.getAllByRole('checkbox');
      expect(toggles[0]).toBeChecked(); // Living Room Light is on
      expect(toggles[1]).not.toBeChecked(); // Bedroom Camera is off
      expect(toggles[2]).toBeChecked(); // Kitchen Thermostat is on
    });

    it('calls onToggle with correct parameters when toggle is clicked', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const toggles = screen.getAllByRole('checkbox');
      fireEvent.change(toggles[0]);

      expect(mockOnToggle).toHaveBeenCalledWith('1', true);
    });

    it('toggle has accessible label', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const firstToggle = screen.getAllByRole('checkbox')[0];
      expect(firstToggle.closest('label')).toHaveAttribute('aria-label', 'Toggle Living Room Light');
    });
  });

  describe('Device Click Behavior', () => {
    it('device card is clickable for modal-enabled devices', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const cards = screen.getAllByTestId('device-card');
      expect(cards[0]).toHaveClass('clickable'); // Light
      expect(cards[1]).toHaveClass('clickable'); // Camera
      expect(cards[2]).toHaveClass('clickable'); // Thermostat
    });

    it('calls onCameraOpen when camera device is clicked', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const cards = screen.getAllByTestId('device-card');
      fireEvent.click(cards[1]); // Click camera card

      expect(mockOnCameraOpen).toHaveBeenCalledWith(mockDevices[1]);
    });

    it('calls onCameraOpen when light device is clicked', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const cards = screen.getAllByTestId('device-card');
      fireEvent.click(cards[0]); // Click light card

      expect(mockOnCameraOpen).toHaveBeenCalledWith(mockDevices[0]);
    });

    it('calls onCameraOpen when thermostat device is clicked', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const cards = screen.getAllByTestId('device-card');
      fireEvent.click(cards[2]); // Click thermostat card

      expect(mockOnCameraOpen).toHaveBeenCalledWith(mockDevices[2]);
    });
  });

  describe('Search Filtering', () => {
    it('filters devices by search term', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          searchTerm="camera"
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Bedroom Camera')).toBeInTheDocument();
      expect(screen.queryByText('Living Room Light')).not.toBeInTheDocument();
      expect(screen.queryByText('Kitchen Thermostat')).not.toBeInTheDocument();
    });

    it('search is case insensitive', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          searchTerm="LIGHT"
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Living Room Light')).toBeInTheDocument();
    });

    it('shows search empty state when no devices match', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          searchTerm="nonexistent"
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('No devices found')).toBeInTheDocument();
      expect(screen.getByText(/no devices match "nonexistent"/i)).toBeInTheDocument();
    });

    it('combines room filter and search filter', () => {
      const activeRooms = [
        { name: 'All', active: false },
        { name: 'Living Room', id: '101', active: true },
        { name: 'Bedroom', id: '102', active: false }
      ];

      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="Living Room"
          rooms={activeRooms}
          searchTerm="kitchen"
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Kitchen Thermostat')).toBeInTheDocument();
      expect(screen.queryByText('Living Room Light')).not.toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('shows room empty state when room has no devices', () => {
      const activeRooms = [
        { name: 'All', active: false },
        { name: 'Empty Room', id: '999', active: true }
      ];

      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="Empty Room"
          rooms={activeRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText(/no devices in empty room/i)).toBeInTheDocument();
    });

    it('shows no devices empty state when All room is empty', () => {
      render(
        <DevicesList
          devices={[]}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('No devices yet')).toBeInTheDocument();
    });

    it('shows search empty state with search term', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          searchTerm="xyz"
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('No devices found')).toBeInTheDocument();
      expect(screen.getByText(/no devices match "xyz"/i)).toBeInTheDocument();
    });
  });

  describe('Device Icons', () => {
    it('renders icon for each device', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const iconBoxes = screen.getAllByTestId('device-card').map(card => 
        card.querySelector('.icon-box')
      );
      expect(iconBoxes).toHaveLength(3);
      iconBoxes.forEach(box => expect(box).toBeInTheDocument());
    });
  });

  describe('Device Name Variations', () => {
    it('handles devices with "name" property instead of "deviceName"', () => {
      const devicesWithName = [
        {
          deviceId: '1',
          name: 'Old Style Device',
          deviceType: 'LIGHT',
          isOn: true,
          roomId: '101'
        }
      ];

      render(
        <DevicesList
          devices={devicesWithName}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Old Style Device')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty device list', () => {
      render(
        <DevicesList
          devices={[]}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('No devices yet')).toBeInTheDocument();
    });

    it('handles undefined searchTerm', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          searchTerm={undefined}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Living Room Light')).toBeInTheDocument();
      expect(screen.getByText('Bedroom Camera')).toBeInTheDocument();
      expect(screen.getByText('Kitchen Thermostat')).toBeInTheDocument();
    });

    it('handles empty searchTerm', () => {
      render(
        <DevicesList
          devices={mockDevices}
          activeRoom="All"
          rooms={mockRooms}
          searchTerm=""
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Living Room Light')).toBeInTheDocument();
    });

    it('handles devices without roomId', () => {
      const devicesWithoutRoom = [
        {
          deviceId: '1',
          deviceName: 'Orphan Device',
          deviceType: 'LIGHT',
          isOn: true
        }
      ];

      render(
        <DevicesList
          devices={devicesWithoutRoom}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      expect(screen.getByText('Orphan Device')).toBeInTheDocument();
    });
  });

  describe('Device Type Case Variations', () => {
    it('handles uppercase device types', () => {
      const devices = [{
        deviceId: '1',
        deviceName: 'Test Device',
        deviceType: 'CAMERA',
        isOn: true,
        roomId: '101'
      }];

      render(
        <DevicesList
          devices={devices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const card = screen.getByTestId('device-card');
      expect(card).toHaveClass('clickable');
    });

    it('handles SECURITYCAMERA device type', () => {
      const devices = [{
        deviceId: '1',
        deviceName: 'Security Cam',
        deviceType: 'SECURITYCAMERA',
        isOn: true,
        roomId: '101'
      }];

      render(
        <DevicesList
          devices={devices}
          activeRoom="All"
          rooms={mockRooms}
          onToggle={mockOnToggle}
          onCameraOpen={mockOnCameraOpen}
        />
      );

      const card = screen.getByTestId('device-card');
      fireEvent.click(card);
      expect(mockOnCameraOpen).toHaveBeenCalled();
    });
  });
});