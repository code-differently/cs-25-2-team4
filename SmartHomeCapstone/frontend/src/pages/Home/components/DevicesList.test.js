import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { DevicesList } from "./DevicesList";
import { registerDeviceIcon } from "./DeviceIcon";

const mockDevices = [
  {
    deviceId: "1",
    deviceName: "Living Room Light",
    deviceType: "LIGHT",
    isOn: true,
    roomId: "101",
  },
  {
    deviceId: "2",
    deviceName: "Bedroom Camera",
    deviceType: "CAMERA",
    isOn: false,
    roomId: "102",
  },
  {
    deviceId: "3",
    deviceName: "Kitchen Thermostat",
    deviceType: "THERMOSTAT",
    isOn: true,
    roomId: "101",
  },
];

const mockRooms = [
  { name: "All", active: true },
  { name: "Living Room", id: "101", active: false },
  { name: "Bedroom", id: "102", active: false },
];

const mockOnToggle = jest.fn();
const mockOnCameraOpen = jest.fn();

const renderDevicesList = (props = {}) =>
  render(
    <DevicesList
      devices={mockDevices}
      activeRoom="All"
      rooms={mockRooms}
      onToggle={mockOnToggle}
      onCameraOpen={mockOnCameraOpen}
      {...props}
    />,
  );

beforeEach(() => {
  jest.clearAllMocks();
});

describe("DevicesList Component", () => {
  describe("Rendering Devices", () => {
    it('renders all devices when "All" room is active', () => {
      // Act
      renderDevicesList();

      // Assert
      expect(screen.getByText("Living Room Light")).toBeInTheDocument();
      expect(screen.getByText("Bedroom Camera")).toBeInTheDocument();
      expect(screen.getByText("Kitchen Thermostat")).toBeInTheDocument();
    });

    it("renders only devices from active room", () => {
      // Act
      renderDevicesList({
        activeRoom: "Living Room",
        rooms: [
          { name: "All", active: false },
          { name: "Living Room", id: "101", active: true },
          { name: "Bedroom", id: "102", active: false },
        ],
      });

      // Assert
      expect(screen.getByText("Living Room Light")).toBeInTheDocument();
      expect(screen.getByText("Kitchen Thermostat")).toBeInTheDocument();
      expect(screen.queryByText("Bedroom Camera")).not.toBeInTheDocument();
    });

    it("renders each device with correct status", () => {
      // Act
      renderDevicesList();

      // Assert
      const cards = screen.getAllByTestId("device-card");
      expect(cards[0]).toHaveTextContent("ON");
      expect(cards[1]).toHaveTextContent("OFF");
      expect(cards[2]).toHaveTextContent("ON");
    });

    it("applies correct CSS classes based on device state", () => {
      // Act
      renderDevicesList();

      // Assert
      const cards = screen.getAllByTestId("device-card");
      expect(cards[0]).toHaveClass("is-on");
      expect(cards[1]).toHaveClass("is-off");
    });
  });

  describe("Device Toggles", () => {
    it("renders toggle switches for all devices", () => {
      // Act
      renderDevicesList();

      // Assert
      const toggles = screen.getAllByRole("checkbox");
      expect(toggles).toHaveLength(3);
    });

    it("toggle switch reflects device on/off state", () => {
      // Act
      renderDevicesList();

      // Assert
      const toggles = screen.getAllByRole("checkbox");
      expect(toggles[0]).toBeChecked();
      expect(toggles[1]).not.toBeChecked();
      expect(toggles[2]).toBeChecked();
    });

    it("calls onToggle with correct parameters when toggle is clicked", () => {
      // Act
      renderDevicesList();
      const toggles = screen.getAllByRole("checkbox");
      fireEvent.click(toggles[0]);

      // Assert
      expect(mockOnToggle).toHaveBeenCalledWith("1", true);
    });

    it("toggle has accessible label", () => {
      // Act
      renderDevicesList();

      // Assert
      const deviceCards = screen.getAllByTestId("device-card");
      const firstCard = deviceCards[0];
      const label = within(firstCard).getByLabelText(
        "Toggle Living Room Light",
      );
      expect(label).toBeInTheDocument();
    });
  });

  describe("Device Click Behavior", () => {
    it("device card is clickable for modal-enabled devices", () => {
      // Act
      renderDevicesList();

      // Assert
      const cards = screen.getAllByTestId("device-card");
      expect(cards[0]).toHaveClass("clickable");
      expect(cards[1]).toHaveClass("clickable");
      expect(cards[2]).toHaveClass("clickable");
    });

    it("calls onCameraOpen when camera device is clicked", () => {
      // Act
      renderDevicesList();
      const cards = screen.getAllByTestId("device-card");
      fireEvent.click(cards[1]);

      // Assert
      expect(mockOnCameraOpen).toHaveBeenCalledWith(mockDevices[1]);
    });

    it("calls onCameraOpen when light device is clicked", () => {
      // Act
      renderDevicesList();
      const cards = screen.getAllByTestId("device-card");
      fireEvent.click(cards[0]);

      // Assert
      expect(mockOnCameraOpen).toHaveBeenCalledWith(mockDevices[0]);
    });

    it("calls onCameraOpen when thermostat device is clicked", () => {
      // Act
      renderDevicesList();
      const cards = screen.getAllByTestId("device-card");
      fireEvent.click(cards[2]);

      // Assert
      expect(mockOnCameraOpen).toHaveBeenCalledWith(mockDevices[2]);
    });
  });

  describe("Search Filtering", () => {
    it("filters devices by search term", () => {
      // Act
      renderDevicesList({ searchTerm: "camera" });

      // Assert
      expect(screen.getByText("Bedroom Camera")).toBeInTheDocument();
      expect(screen.queryByText("Living Room Light")).not.toBeInTheDocument();
      expect(screen.queryByText("Kitchen Thermostat")).not.toBeInTheDocument();
    });

    it("search is case insensitive", () => {
      // Act
      renderDevicesList({ searchTerm: "LIGHT" });

      // Assert
      expect(screen.getByText("Living Room Light")).toBeInTheDocument();
    });

    it("shows search empty state when no devices match", () => {
      // Act
      renderDevicesList({ searchTerm: "nonexistent" });

      // Assert
      expect(screen.getByText("No devices found")).toBeInTheDocument();
      expect(
        screen.getByText(/no devices match "nonexistent"/i),
      ).toBeInTheDocument();
    });

    it("combines room filter and search filter", () => {
      // Act
      renderDevicesList({
        activeRoom: "Living Room",
        rooms: [
          { name: "All", active: false },
          { name: "Living Room", id: "101", active: true },
          { name: "Bedroom", id: "102", active: false },
        ],
        searchTerm: "kitchen",
      });

      // Assert
      expect(screen.getByText("Kitchen Thermostat")).toBeInTheDocument();
      expect(screen.queryByText("Living Room Light")).not.toBeInTheDocument();
    });
  });

  describe("Empty States", () => {
    it("shows room empty state when room has no devices", () => {
      // Act
      renderDevicesList({
        activeRoom: "Empty Room",
        rooms: [
          { name: "All", active: false },
          { name: "Empty Room", id: "999", active: true },
        ],
      });

      // Assert
      expect(screen.getByText(/no devices in empty room/i)).toBeInTheDocument();
    });

    it("shows no devices empty state when All room is empty", () => {
      // Act
      renderDevicesList({ devices: [] });

      // Assert
      expect(screen.getByText("No devices yet")).toBeInTheDocument();
    });

    it("shows search empty state with search term", () => {
      // Act
      renderDevicesList({ searchTerm: "xyz" });

      // Assert
      expect(screen.getByText("No devices found")).toBeInTheDocument();
      expect(screen.getByText(/no devices match "xyz"/i)).toBeInTheDocument();
    });
  });

  describe("Device Icons", () => {
    it("renders icon for each device", () => {
      // Act
      renderDevicesList();

      // Assert
      const deviceCards = screen.getAllByTestId("device-card");
      const iconBoxes = deviceCards.map((card) =>
        within(card).getByTestId("icon-box"),
      );
      expect(iconBoxes).toHaveLength(3);
      iconBoxes.forEach((box) => expect(box).toBeInTheDocument());
    });

    describe("DeviceIcon coverage (via DevicesList)", () => {
      it("renders nothing when deviceType is missing", () => {
        renderDevicesList({
          devices: [{ deviceId: "x", deviceName: "No Type", isOn: true }],
        });
        // should not throw and icon-box still exists (empty span)
        expect(screen.getByText("No Type")).toBeInTheDocument();
      });

      it("renders nothing when deviceType is unknown", () => {
        renderDevicesList({
          devices: [
            {
              deviceId: "x",
              deviceName: "Mystery",
              deviceType: "X",
              isOn: true,
            },
          ],
        });
        expect(screen.getByText("Mystery")).toBeInTheDocument();
      });

      it("renders custom registered icon type", () => {
        // register before render
        registerDeviceIcon("CUSTOM", () => <svg data-testid="custom-icon" />);
        renderDevicesList({
          devices: [
            {
              deviceId: "x",
              deviceName: "Custom Dev",
              deviceType: "CUSTOM",
              isOn: true,
            },
          ],
        });
        expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
      });
    });
  });

  describe("Device Name Variations", () => {
    it('handles devices with "name" property instead of "deviceName"', () => {
      // Act
      renderDevicesList({
        devices: [
          {
            deviceId: "1",
            name: "Old Style Device",
            deviceType: "LIGHT",
            isOn: true,
            roomId: "101",
          },
        ],
      });

      // Assert
      expect(screen.getByText("Old Style Device")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty device list", () => {
      // Act
      renderDevicesList({ devices: [] });

      // Assert
      expect(screen.getByText("No devices yet")).toBeInTheDocument();
    });

    it("handles undefined searchTerm", () => {
      // Act
      renderDevicesList({ searchTerm: undefined });

      // Assert
      expect(screen.getByText("Living Room Light")).toBeInTheDocument();
      expect(screen.getByText("Bedroom Camera")).toBeInTheDocument();
      expect(screen.getByText("Kitchen Thermostat")).toBeInTheDocument();
    });

    it("handles empty searchTerm", () => {
      // Act
      renderDevicesList({ searchTerm: "" });

      // Assert
      expect(screen.getByText("Living Room Light")).toBeInTheDocument();
    });

    it("handles devices without roomId", () => {
      // Act
      renderDevicesList({
        devices: [
          {
            deviceId: "1",
            deviceName: "Orphan Device",
            deviceType: "LIGHT",
            isOn: true,
          },
        ],
      });

      // Assert
      expect(screen.getByText("Orphan Device")).toBeInTheDocument();
    });
  });

  describe("Device Type Case Variations", () => {
    it("handles uppercase device types", () => {
      // Act
      renderDevicesList({
        devices: [
          {
            deviceId: "1",
            deviceName: "Test Device",
            deviceType: "CAMERA",
            isOn: true,
            roomId: "101",
          },
        ],
      });

      // Assert
      const card = screen.getByTestId("device-card");
      expect(card).toHaveClass("clickable");
    });

    it("handles SECURITYCAMERA device type", () => {
      // Act
      renderDevicesList({
        devices: [
          {
            deviceId: "1",
            deviceName: "Security Cam",
            deviceType: "SECURITYCAMERA",
            isOn: true,
            roomId: "101",
          },
        ],
      });

      // Assert
      const card = screen.getByTestId("device-card");
      fireEvent.click(card);
      expect(mockOnCameraOpen).toHaveBeenCalled();
    });
  });
});
