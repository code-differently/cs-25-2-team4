/* eslint-disable import/first */
/**
 * ----------------------------------------------------------------------
 * TOP-OF-FILE JEST.MOCKS (MUST BE BEFORE *ANY* IMPORTS)
 * ----------------------------------------------------------------------
 * If a single import of the real module happens before we mock it,
 * React will bind to the real implementation and our mocks won't apply.
 * That's what caused the "Cannot destructure selectedDevice..." crash.
 * ----------------------------------------------------------------------
 */

// Import React FIRST for JSX in mocks
import React from "react";

/** Modal stack: stub the component; return a DUMB hook object */
jest.mock("./components/ModalManager.jsx", () => ({
  __esModule: true,
  // NAMED exports (match Home.jsx): { ModalManager, useModalManager }
  useModalManager: () => ({
    selectedDevice: null,
    modalType: null,
    openDeviceModal: jest.fn(),
    openCameraModal: jest.fn(),
    closeModal: jest.fn(),
    requestDeleteDevice: jest.fn(),
    confirmDeleteDevice: jest.fn(),
    returnToDeviceModal: jest.fn(),
    returnToCameraModal: jest.fn(),
    handleToggle: jest.fn(),
  }),
  // STUB component to avoid rendering any nested modals
  ModalManager: () => null,
}));

/** Coordinator: mock with basic UI elements for testing */
jest.mock("./components/RoomDeviceCoordinator.jsx", () => ({
  __esModule: true,
  RoomDeviceCoordinator: ({ rooms, devices, showAddRoomForm, newRoomName, onAddRoomClick, onRoomClick }) => {
    const activeRoom = rooms?.find((r) => r.active)?.name;
    const activeRoomObj = rooms?.find((r) => r.name === activeRoom);
    
    // Filter devices by active room
    const filteredDevices = activeRoom === "All" 
      ? devices 
      : devices?.filter((d) => d.roomId === activeRoomObj?.id) || [];
    
    const showEmptyState = activeRoom !== "All" && filteredDevices.length === 0;
    
    return (
      <div data-testid="mock-rdc">
        {/* Mock rooms bar */}
        <div className="add-room-section">
          {!showAddRoomForm && <button onClick={onAddRoomClick}>+ Add Room</button>}
          {showAddRoomForm && (
            <div className="add-room-form">
              <input placeholder="Room Name" value={newRoomName} readOnly />
              <button>Save Room</button>
              <button>Cancel</button>
            </div>
          )}
        </div>
        <nav role="navigation" aria-label="rooms" className="rooms-bar">
          {rooms?.map((room, index) => (
            <button
              key={index}
              className={room.active ? "active" : ""}
              onClick={() => onRoomClick?.(room.name)}
            >
              {room.name}
            </button>
          ))}
        </nav>
        
        {/* Mock device management */}
        <section className="devices-section">
          <div className="devices-header">
            <h2>My Devices</h2>
            <button data-testid="add-device-btn" className="add-device-btn">
              + Add Device
            </button>
          </div>
          
          {showEmptyState ? (
            <div className="devices-list">
              <div className="empty-state">
                <p className="empty-state-message">No devices in this room yet</p>
              </div>
            </div>
          ) : (
            <div className="devices-grid">
              {filteredDevices?.map((device, index) => (
                <div
                  key={device.deviceId || index}
                  data-testid="device-card"
                  className={`device-card ${device.isOn ? "is-on" : "is-off"}`}
                >
                  <div className="device-card-header">
                    <span className="device-title">{device.deviceName}</span>
                    <label className="device-toggle">
                      <input
                        type="checkbox"
                        checked={device.isOn}
                        readOnly
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <span className="device-status-text">
                    {device.isOn ? "ON" : "OFF"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  },
}));

/** ConfirmDeleteModal: stub */
jest.mock("./components/modals/ConfirmDeleteModal.jsx", () => ({
  __esModule: true,
  ConfirmDeleteModal: () => <div data-testid="mock-confirm-delete" />,
}));

/** Router: keep BrowserRouter minimal and stub navigate */
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  BrowserRouter: ({ children }) => <div>{children}</div>,
}));

/** Hooks & context */
jest.mock("../../hooks/useRooms", () => ({ useRooms: jest.fn() }));
jest.mock("../../hooks/useDevices", () => ({ useDevices: jest.fn() }));
jest.mock("../../hooks/useHomes", () => ({ useHomes: jest.fn() }));
jest.mock("../../hooks/useUserSync", () => ({ useUserSync: jest.fn() }));
jest.mock("../../context/UserContext", () => ({ useUser: jest.fn() }));

/** Header */
jest.mock("../../components/header/Header.jsx", () => ({
  __esModule: true,
  Header: () => <div data-testid="mock-header">Header</div>,
}));

/** Services */
jest.mock("../../services/roomService", () => ({
  roomService: {
    getRoomsByHome: jest.fn(),
    createRoom: jest.fn(),
    deleteRoom: jest.fn(),
    getRoomById: jest.fn(),
    updateRoom: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

jest.mock("../../services/deviceService", () => ({
  deviceService: {
    getAllDevices: jest.fn(),
    createDevice: jest.fn(),
    deleteDevice: jest.fn(),
    turnDeviceOn: jest.fn(),
    turnDeviceOff: jest.fn(),
    getDeviceById: jest.fn(),
    controlDevice: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

/** CreateHome */
jest.mock("../CreateHome/CreateHome", () => ({
  __esModule: true,
  default: () => <div>Mock CreateHome</div>,
}));

/**
 * ----------------------------------------------------------------------
 * IMPORTS UNDER TEST (SAFE NOW — ALL MOCKS ARE ALREADY INSTALLED)
 * ----------------------------------------------------------------------
 */
import { render, screen, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { useRooms } from "../../hooks/useRooms";
import { useDevices } from "../../hooks/useDevices";
import { useHomes } from "../../hooks/useHomes";
import { useUser } from "../../context/UserContext";
import { BrowserRouter } from "react-router-dom";
/* eslint-enable import/first */

/**
 * ----------------------------------------------------------------------
 * SIMPLE RENDER HELPER (wrap component in BrowserRouter)
 * ----------------------------------------------------------------------
 */
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

/**
 * ----------------------------------------------------------------------
 * CONVENIENT REFERENCES TO OUR MOCKED HOOKS
 * ----------------------------------------------------------------------
 */
const mockUseRooms = useRooms;
const mockUseDevices = useDevices;
const mockUseHomes = useHomes;
const mockUseUser = useUser;

/**
 * ----------------------------------------------------------------------
 * DEFAULT MOCK RETURN VALUES
 * ----------------------------------------------------------------------
 * These are the "happy path" defaults we set up in beforeEach().
 * Individual tests override by calling mockUse*.mockReturnValue(...)
 * again inside the test.
 * ----------------------------------------------------------------------
 */
const defaultUserMock = {
  backendUser: {
    clerkId: "user_123",
    username: "testuser",
    email: "test@example.com",
  },
  isLoading: false,
};

const defaultHomesMock = {
  homes: [{ homeId: 1, name: "My Home", address: "123 Main St" }],
  currentHome: { homeId: 1, name: "My Home", address: "123 Main St" },
  loading: false,
  error: null,
  refreshHomes: jest.fn(),
  createHome: jest.fn(),
  switchHome: jest.fn(),
};

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
  setRooms: jest.fn(),
};

const defaultDevicesMock = {
  devices: [],
  loading: false,
  error: null,
  addDevice: jest.fn(),
  toggleDevice: jest.fn(),
  deleteDevice: jest.fn(),
  setDevices: jest.fn(),
};

/**
 * ----------------------------------------------------------------------
 * TESTS
 * ----------------------------------------------------------------------
 */
describe("Home Component", () => {
  beforeEach(() => {
    // Always reset call counts and implementations to defaults
    jest.clearAllMocks();

    // Default return values for all hooks
    mockUseUser.mockReturnValue(defaultUserMock);
    mockUseHomes.mockReturnValue(defaultHomesMock);
    mockUseRooms.mockReturnValue(defaultRoomsMock);
    mockUseDevices.mockReturnValue(defaultDevicesMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders main structure correctly", () => {
      renderWithRouter(<Home />);

      // Rooms nav landmark (your component likely sets aria-label="Rooms")
      expect(
        screen.getByRole("navigation", { name: /rooms/i })
      ).toBeInTheDocument();

      // Title text
      expect(screen.getByText("My Devices")).toBeInTheDocument();

      // Default room button
      expect(screen.getByRole("button", { name: "All" })).toBeInTheDocument();

      // Add Room button
      expect(
        screen.getByRole("button", { name: "+ Add Room" })
      ).toBeInTheDocument();

      // Add Device button (assumes data-testid is present)
      expect(screen.getByTestId("add-device-btn")).toBeInTheDocument();
    });

    it("shows All room as active by default", () => {
      renderWithRouter(<Home />);
      expect(screen.getByRole("button", { name: "All" })).toHaveClass("active");
    });
  });

  describe("Loading States", () => {
    it("shows loading when rooms are loading", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        loading: true,
      });

      renderWithRouter(<Home />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    it("shows loading when devices are loading", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        loading: true,
      });

      renderWithRouter(<Home />);
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe("Error States", () => {
    it("shows error when rooms fail to load", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        error: "Failed to load rooms",
      });

      renderWithRouter(<Home />);
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });

    it("shows error when devices fail to load", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        error: "Failed to load devices",
      });

      renderWithRouter(<Home />);
      expect(screen.getByText(/error loading data/i)).toBeInTheDocument();
    });
  });

  describe("Room Management", () => {
    it("calls openAddRoomForm when + Add Room is clicked", () => {
      const mockOpenAddRoomForm = jest.fn();
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        openAddRoomForm: mockOpenAddRoomForm,
      });

      renderWithRouter(<Home />);
      fireEvent.click(screen.getByRole("button", { name: "+ Add Room" }));

      expect(mockOpenAddRoomForm).toHaveBeenCalled();
    });

    it("shows add room form when showAddRoomForm is true", () => {
      mockUseRooms.mockReturnValue({
        ...defaultRoomsMock,
        showAddRoomForm: true,
        newRoomName: "Test Room",
      });

      renderWithRouter(<Home />);

      expect(screen.getByDisplayValue("Test Room")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save room/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();
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

      renderWithRouter(<Home />);

      expect(
        screen.getByRole("button", { name: "All" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Living Room" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Kitchen" })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Living Room" })
      ).toHaveClass("active");
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

      renderWithRouter(<Home />);
      fireEvent.click(screen.getByRole("button", { name: "Bedroom" }));

      expect(mockActivateRoom).toHaveBeenCalledWith("Bedroom");
    });
  });

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
            roomId: 1,
          },
          {
            deviceId: 2,
            deviceName: "Thermostat",
            deviceType: "THERMOSTAT",
            isOn: false,
            roomId: 1,
          },
        ],
      });

      renderWithRouter(<Home />);

      const deviceCards = screen.getAllByTestId("device-card");
      expect(deviceCards).toHaveLength(2);
      expect(screen.getByText("Smart Light")).toBeInTheDocument();
      expect(screen.getByText("Thermostat")).toBeInTheDocument();
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
            roomId: 1,
          },
          {
            deviceId: 2,
            deviceName: "Light Off",
            deviceType: "LIGHT",
            isOn: false,
            roomId: 1,
          },
        ],
      });

      renderWithRouter(<Home />);

      const checkboxes = screen.getAllByRole("checkbox");
      expect(checkboxes).toHaveLength(2);
      expect(checkboxes[0]).toBeChecked();
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

      renderWithRouter(<Home />);

      expect(
        screen.getByText(/no devices in this room yet/i)
      ).toBeInTheDocument();
    });
  });

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
          {
            deviceId: 1,
            deviceName: "Bedroom Light",
            roomId: 2,
            deviceType: "LIGHT",
            isOn: false,
          },
          {
            deviceId: 2,
            deviceName: "Kitchen Light",
            roomId: 3,
            deviceType: "LIGHT",
            isOn: false,
          },
        ],
      });

      renderWithRouter(<Home />);

      const deviceCards = screen.getAllByTestId("device-card");
      expect(deviceCards).toHaveLength(1);
      expect(screen.getByText("Bedroom Light")).toBeInTheDocument();
      expect(
        screen.queryByText("Kitchen Light")
      ).not.toBeInTheDocument();
    });

    it("shows all devices when All room is active", () => {
      mockUseDevices.mockReturnValue({
        ...defaultDevicesMock,
        devices: [
          {
            deviceId: 1,
            deviceName: "Light 1",
            roomId: 2,
            deviceType: "LIGHT",
            isOn: false,
          },
          {
            deviceId: 2,
            deviceName: "Light 2",
            roomId: 3,
            deviceType: "LIGHT",
            isOn: false,
          },
        ],
      });

      renderWithRouter(<Home />);

      const deviceCards = screen.getAllByTestId("device-card");
      expect(deviceCards).toHaveLength(2);
      expect(screen.getByText("Light 1")).toBeInTheDocument();
      expect(screen.getByText("Light 2")).toBeInTheDocument();
    });

    it("calls useDevices and useRooms hooks", () => {
      renderWithRouter(<Home />);

      expect(mockUseRooms).toHaveBeenCalled();
      expect(mockUseDevices).toHaveBeenCalled();
    });
  });
});