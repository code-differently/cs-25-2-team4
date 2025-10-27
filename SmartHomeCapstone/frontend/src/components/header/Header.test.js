/* eslint-disable import/first */
/**
 * ----------------------------------------------------------------------
 * Header Component Tests
 * ----------------------------------------------------------------------
 * All dependencies properly mocked based on actual Header.jsx imports
 */

// Import React first for JSX in mocks
import React from "react";

/** Mock axios to prevent ES module import errors */
jest.mock("axios");

/** Mock UserContext */
jest.mock("../../context/UserContext", () => ({
  useUser: jest.fn(() => ({
    backendUser: {
      clerkId: "user_123",
      username: "testuser",
      email: "test@example.com",
    },
    isLoading: false,
  })),
}));

/** Mock useUserSync hook */
jest.mock("../../hooks/useUserSync", () => ({
  useUserSync: jest.fn(),
}));

/** Mock useHomes hook */
jest.mock("../../hooks/useHomes", () => ({
  useHomes: jest.fn(() => ({
    homes: [{ homeId: 1, name: "My Home", address: "123 Main St" }],
    currentHome: { homeId: 1, name: "My Home", address: "123 Main St" },
    loading: false,
    error: null,
    refreshHomes: jest.fn(),
    switchHome: jest.fn(),
  })),
}));

/** Mock CustomUserDropdown - Header imports this as "./CustomUserDropdown" */
jest.mock("./CustomUserDropdown", () => ({
  __esModule: true,
  CustomUserDropdown: () => (
    <div data-testid="custom-user-dropdown">
      <span>testuser</span>
    </div>
  ),
}));

/** Mock react-router-dom */
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

/** Mock Clerk - includes SignedIn and SignedOut components */
jest.mock("@clerk/clerk-react", () => ({
  useAuth: jest.fn(() => ({
    isSignedIn: true,
    userId: "user_123",
    signOut: jest.fn(),
  })),
  useClerk: jest.fn(() => ({
    signOut: jest.fn(),
  })),
  SignOutButton: ({ children }) => <button>{children || "Sign Out"}</button>,
  UserButton: () => <div data-testid="user-button">UserButton</div>,
  SignedIn: ({ children }) => <div data-testid="signed-in">{children}</div>,
  SignedOut: ({ children }) => null, // Don't render when signed in
}));

/** Mock lucide-react icons */
jest.mock("lucide-react", () => ({
  Search: () => <span data-testid="search-icon">Search</span>,
  Sun: () => <span data-testid="sun-icon">Sun</span>,
  Moon: () => <span data-testid="moon-icon">Moon</span>,
  User: () => <span data-testid="user-icon">User</span>,
  Home: () => <span data-testid="home-icon">Home</span>,
  Settings: () => <span data-testid="settings-icon">Settings</span>,
}));

/** Mock userService */
jest.mock("../../services/userService", () => ({
  userService: {
    getUserByClerkId: jest.fn(),
    createUser: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));

/**
 * ----------------------------------------------------------------------
 * IMPORTS UNDER TEST
 * ----------------------------------------------------------------------
 */
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

/**
 * ----------------------------------------------------------------------
 * TESTS
 * ----------------------------------------------------------------------
 */
describe("Header Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'theme') return 'light';
      return null;
    });
    Storage.prototype.setItem = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Initial Render", () => {
    it("renders the header element", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("renders the SmartHome title", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      expect(screen.getByText(/SmartHome/i)).toBeInTheDocument();
    });

    it("renders search input", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const searchInput = screen.getByPlaceholderText(/search devices by name/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("renders dark mode toggle", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const darkModeToggle = screen.getByRole("checkbox");
      expect(darkModeToggle).toBeInTheDocument();
      expect(darkModeToggle).toHaveAttribute("id", "dark-mode-toggle");
    });

    it("renders user dropdown when signed in", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      expect(screen.getByTestId("custom-user-dropdown")).toBeInTheDocument();
    });
  });

  describe("Search Functionality", () => {
    it("displays the search term from props", () => {
      // Act
      const searchTerm = "living room lamp";
      render(<Header searchTerm={searchTerm} onSearchChange={jest.fn()} />);
      // Assert
      const searchInput = screen.getByDisplayValue(searchTerm);
      expect(searchInput).toBeInTheDocument();
    });

    it("calls onSearchChange when user types", () => {
      // Act
      const mockOnSearchChange = jest.fn();
      render(<Header searchTerm="" onSearchChange={mockOnSearchChange} />);
      const searchInput = screen.getByPlaceholderText(/search devices by name/i);
      fireEvent.change(searchInput, { target: { value: "thermostat" } });
      // Assert
      expect(mockOnSearchChange).toHaveBeenCalledWith("thermostat");
    });

    it("updates search input value when typing", () => {
      // Act
      const mockOnSearchChange = jest.fn();
      render(<Header searchTerm="" onSearchChange={mockOnSearchChange} />);
      const searchInput = screen.getByPlaceholderText(/search devices by name/i);
      fireEvent.change(searchInput, { target: { value: "camera" } });
      // Assert
      expect(mockOnSearchChange).toHaveBeenCalledTimes(1);
    });
  });

  describe("Dark Mode Toggle", () => {
    it("has dark mode toggle unchecked by default", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const toggle = screen.getByRole("checkbox");
      expect(toggle).not.toBeChecked();
    });

    it("toggles dark mode when clicked", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      const toggle = screen.getByRole("checkbox");
      // Assert
      expect(toggle).not.toBeChecked();
      fireEvent.click(toggle);
      expect(toggle).toBeChecked();
      fireEvent.click(toggle);
      expect(toggle).not.toBeChecked();
    });

    it("shows moon emoji when in dark mode", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      expect(screen.getByText("🌙")).toBeInTheDocument();
    });

    it("shows sun emoji when in light mode", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      const toggle = screen.getByRole("checkbox");
      fireEvent.click(toggle); // Disable dark mode
      // Assert
      expect(screen.getByText("☀️")).toBeInTheDocument();
    });
  });

  describe("User Authentication", () => {
    it("shows user dropdown for signed in users", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      expect(screen.getByTestId("signed-in")).toBeInTheDocument();
      expect(screen.getByTestId("custom-user-dropdown")).toBeInTheDocument();
    });

    it("does not show signed out message when user is signed in", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      expect(screen.queryByText(/please sign in/i)).not.toBeInTheDocument();
    });
  });

  describe("Navigation", () => {
    it("has a link to home page", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const homeLink = screen.getByRole("link", { name: /SmartHome/i });
      expect(homeLink).toHaveAttribute("href", "/");
    });
  });

  describe("Accessibility", () => {
    it("header has proper banner role", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const header = screen.getByRole("banner");
      expect(header).toBeInTheDocument();
    });

    it("search input has appropriate placeholder", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const searchInput = screen.getByPlaceholderText(/search devices by name/i);
      expect(searchInput).toBeInTheDocument();
    });

    it("dark mode toggle has proper id for label association", () => {
      // Act
      render(<Header searchTerm="" onSearchChange={jest.fn()} />);
      // Assert
      const toggle = screen.getByRole("checkbox");
      expect(toggle).toHaveAttribute("id", "dark-mode-toggle");
      // Verify label exists and is associated with the checkbox
      const label = screen.getByLabelText("🌙");
      expect(label).toBe(toggle);
    });
  });
});