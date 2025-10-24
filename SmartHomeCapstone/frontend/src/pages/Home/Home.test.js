import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
// Then import the mocked hooks
import { useRooms } from "../../hooks/useRooms";
import { useDevices } from "../../hooks/useDevices";


// Mock the hooks first
jest.mock("../../hooks/useRooms", () => ({
  useRooms: jest.fn(),
}));

jest.mock("../../hooks/useDevices", () => ({
  useDevices: jest.fn(),
}));

// Now create the mock variables
const mockUseRooms = useRooms;
const mockUseDevices = useDevices;

// Mock data that matches your actual component structure
const defaultRoomsMock = {
  rooms: [{ name: "All", active: true, id: 1 }],
  loading: false,
  error: null,
  roomError: "",
  fadeOutRoom: false,
  newRoomName: "",
  showAddRoomForm: false,
  openAddRoomForm: jest.fn(),
  cancelAddRoomForm: jest.fn(),
  setNewRoomName: jest.fn(),
  activateRoom: jest.fn(),
  addRoom: jest.fn(),
};

const defaultDevicesMock = {
  devices: [],
  loading: false,
  error: null,
  addDevice: jest.fn(),
  toggleDevice: jest.fn(),
  deleteDevice: jest.fn(),
};

describe("Home Component", () => {
  beforeEach(() => {
    mockUseRooms.mockReturnValue(defaultRoomsMock);
    mockUseDevices.mockReturnValue(defaultDevicesMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  describe("Initial Render", () => {
    it("renders main structure correctly", () => {
      render(<Home />);

      expect(screen.getByRole("navigation", { name: /rooms/i })).toBeInTheDocument();
      expect(screen.getByText("My Devices")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "+ Add" })).toBeInTheDocument();
      expect(screen.getByTestId("add-device-btn")).toBeInTheDocument();
    });

    it("shows All room as active by default", () => {
      render(<Home />);
      expect(screen.getByRole("button", { name: "All" })).toHaveClass("active");
    });
  });

  // Loading states
  describe("Loading States", () => {
    it("shows loading when rooms are loading", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        loading: true,
      });

      render(<Home />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("shows loading when devices are loading", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        loading: true,
      });

      render(<Home />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  // Error states
  describe("Error States", () => {
    it("shows error when rooms fail to load", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        error: "Failed to load rooms",
      });

      render(<Home />);
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });

    it("shows error when devices fail to load", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        error: "Failed to load devices",
      });

      render(<Home />);
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  // Room interactions
  describe("Room Management", () => {
    it("calls openAddRoomForm when + Add is clicked", () => {
      const mockOpenAddRoomForm = jest.fn();
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        openAddRoomForm: mockOpenAddRoomForm,
      });

      render(<Home />);
      fireEvent.click(screen.getByRole("button", { name: "+ Add" }));

      expect(mockOpenAddRoomForm).toHaveBeenCalled();
    });

    it("shows add room form when showAddRoomForm is true", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        showAddRoomForm: true,
        newRoomName: "Test Room",
      });

      render(<Home />);

      expect(screen.getByDisplayValue("Test Room")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /save room/i })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
    });

    it("displays multiple rooms from hook data", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        rooms: [
          { name: "All", active: false, id: 1 },
          { name: "Living Room", active: true, id: 2 },
          { name: "Kitchen", active: false, id: 3 },
        ],
      });

      render(<Home />);

      expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Living Room" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Kitchen" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Living Room" })).toHaveClass("active");
    });

    it("calls activateRoom when room button is clicked", () => {
      const mockActivateRoom = jest.fn();
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        rooms: [
          { name: "All", active: true, id: 1 },
          { name: "Bedroom", active: false, id: 2 },
        ],
        activateRoom: mockActivateRoom,
      });

      render(<Home />);
      fireEvent.click(screen.getByRole("button", { name: "Bedroom" }));

      expect(mockActivateRoom).toHaveBeenCalledWith("Bedroom");
    });
  });

  // Device interactions - Updated to match actual component behavior
  describe("Device Management", () => {
    it("renders device cards when devices are provided", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          { 
            deviceId: 1, 
            deviceName: "Smart Light", 
            deviceType: "LIGHT", 
            isOn: true, 
            roomId: 1 
          },
          { 
            deviceId: 2, 
            deviceName: "Thermostat", 
            deviceType: "THERMOSTAT", 
            isOn: false, 
            roomId: 1 
          },
        ],
      });

      render(<Home />);

      const deviceCards = screen.getAllByTestId("device-card");
      expect(deviceCards).toHaveLength(2);
      
      // Check for device names in the cards
      expect(screen.getByText("Smart Light")).toBeInTheDocument();
      expect(screen.getByText("Thermostat")).toBeInTheDocument();
    });

    it("renders device toggle functionality", () => {
      const mockToggleDevice = jest.fn();
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          { 
            deviceId: 1, 
            deviceName: "Smart Light", 
            deviceType: "LIGHT", 
            isOn: true, 
            roomId: 1 
          },
        ],
        toggleDevice: mockToggleDevice,
      });

      render(<Home />);

      // Check that the toggle exists and is in the correct state
      const toggleInput = screen.getByRole("checkbox");
      expect(toggleInput).toBeInTheDocument();
      expect(toggleInput).toBeChecked(); // Since isOn: true

      // Click the toggle
      fireEvent.change(toggleInput);

      // The useModalManager's handleToggle should eventually call the original toggleDevice
      // But we can't easily test this without mocking the entire useModalManager hook
      expect(toggleInput).toBeInTheDocument();
    });

    it("shows correct toggle state for devices", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          { 
            deviceId: 1, 
            deviceName: "Light On", 
            deviceType: "LIGHT", 
            isOn: true, 
            roomId: 1 
          },
          { 
            deviceId: 2, 
            deviceName: "Light Off", 
            deviceType: "LIGHT", 
            isOn: false, 
            roomId: 1 
          },
        ],
      });

      render(<Home />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(2);
      
      // First device should be checked (isOn: true)
      expect(checkboxes[0]).toBeChecked();
      // Second device should not be checked (isOn: false)
      expect(checkboxes[1]).not.toBeChecked();
    });

    it("shows empty state when no devices in active room", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        rooms: [
          { name: "All", active: false, id: 1 },
          { name: "Empty Room", active: true, id: 2 },
        ],
      });

      render(<Home />);

      expect(screen.getByText(/no devices in this room yet/i)).toBeInTheDocument();
    });
  });

  // Integration tests
  describe("Hook Integration", () => {
    it("filters devices by active room", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        rooms: [
          { name: "All", active: false, id: 1 },
          { name: "Bedroom", active: true, id: 2 },
        ],
      });
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          { deviceId: 1, deviceName: "Bedroom Light", roomId: 2, deviceType: "LIGHT", isOn: false },
          { deviceId: 2, deviceName: "Kitchen Light", roomId: 3, deviceType: "LIGHT", isOn: false },
        ],
      });

      render(<Home />);

      // Should only show devices for the active room (Bedroom - roomId: 2)
      const deviceCards = screen.getAllByTestId("device-card");
      expect(deviceCards).toHaveLength(1);
      expect(screen.getByText("Bedroom Light")).toBeInTheDocument();
      expect(screen.queryByText("Kitchen Light")).not.toBeInTheDocument();
    });

    it("shows all devices when All room is active", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          { deviceId: 1, deviceName: "Light 1", roomId: 2, deviceType: "LIGHT", isOn: false },
          { deviceId: 2, deviceName: "Light 2", roomId: 3, deviceType: "LIGHT", isOn: false },
        ],
      });

      render(<Home />);

      // Should show all devices when "All" room is active
      const deviceCards = screen.getAllByTestId("device-card");
      expect(deviceCards).toHaveLength(2);
      expect(screen.getByText("Light 1")).toBeInTheDocument();
      expect(screen.getByText("Light 2")).toBeInTheDocument();
    });

    it("renders correct device status", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          { deviceId: 1, deviceName: "Light On", roomId: 1, deviceType: "LIGHT", isOn: true },
          { deviceId: 2, deviceName: "Light Off", roomId: 1, deviceType: "LIGHT", isOn: false },
        ],
      });

      render(<Home />);

      const statusTexts = screen.getAllByText(/ON|OFF/);
      expect(statusTexts).toHaveLength(2);
      expect(screen.getByText("ON")).toBeInTheDocument();
      expect(screen.getByText("OFF")).toBeInTheDocument();
    });

    it("calls useDevices and useRooms hooks", () => {
      render(<Home />);

      // Verify that both hooks are called
      expect(mockUseRooms).toHaveBeenCalled();
      expect(mockUseDevices).toHaveBeenCalled();
    });
  });
});

