/* eslint-disable import/first */
/**
 * ----------------------------------------------------------------------
 * CustomUserDropdown Component Tests
 * ----------------------------------------------------------------------
 * All dependencies properly mocked
 */

import React from "react";
jest.mock("axios");
jest.mock("../../services/userService", () => ({
  userService: {
    getUserByClerkId: jest.fn(),
    syncUser: jest.fn(),
    updateUser: jest.fn(),
  },
  setAuthToken: jest.fn(),
}));
jest.mock("../../hooks/useUserSync", () => ({ useUserSync: jest.fn() }));
jest.mock("../../hooks/useHomes", () => ({
  useHomes: jest.fn(() => ({
    homes: [],
    currentHome: null,
    loading: false,
    error: null,
  })),
  setAuthToken: jest.fn(),
}));
jest.mock("../../services/roomService", () => ({
  roomService: { getRoomsByHome: jest.fn() },
  setAuthToken: jest.fn(),
}));
jest.mock("../../services/deviceService", () => ({
  deviceService: { getAllDevices: jest.fn() },
  setAuthToken: jest.fn(),
}));
jest.mock("@clerk/clerk-react");
jest.mock("../../context/UserContext");

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { CustomUserDropdown } from "./CustomUserDropdown";
import { useClerk, useUser as useClerkUser } from "@clerk/clerk-react";
import { useUser } from "../../context/UserContext";

const mockSignOut = jest.fn();
const mockOpenUserProfile = jest.fn();

const mockClerkUser = {
  id: "user_123",
  emailAddresses: [{ emailAddress: "test@example.com" }],
  firstName: "John",
  lastName: "Doe",
  fullName: "John Doe",
  username: "johndoe",
  imageUrl: "https://example.com/avatar.jpg",
};
const mockBackendUser = {
  userId: 1,
  clerkId: "user_123",
  email: "test@example.com",
  fullName: "John Doe",
  username: "johndoe",
};

beforeEach(() => {
  jest.clearAllMocks();
  cleanup();
});

function setMocks({
  clerkUser = mockClerkUser,
  backendUser = mockBackendUser,
  isLoaded = true,
  isLoading = false,
}) {
  useClerk.mockReturnValue({
    signOut: mockSignOut,
    openUserProfile: mockOpenUserProfile,
  });
  useClerkUser.mockReturnValue({ user: clerkUser, isLoaded });
  useUser.mockReturnValue({
    user: clerkUser,
    backendUser,
    isLoading,
    error: null,
  });
}

describe("CustomUserDropdown", () => {
  describe("Rendering", () => {
    it("shows user info and avatar", () => {
      setMocks({});
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("test@example.com")).toBeInTheDocument();
      expect(screen.getByAltText("John Doe")).toHaveAttribute(
        "src",
        mockClerkUser.imageUrl,
      );
    });

    it("shows initials if no image", () => {
      setMocks({ clerkUser: { ...mockClerkUser, imageUrl: null } });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("shows dropdown arrow", () => {
      setMocks({});
      // Act
      render(<CustomUserDropdown />);
      // Assert
      // eslint-disable-next-line testing-library/no-node-access
      const svg = screen.getByRole("button").querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("dropdown-arrow");
    });

    it("dropdown menu hidden initially", () => {
      setMocks({});
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.queryByText("Profile Settings")).not.toBeInTheDocument();
    });
  });

  describe("Display Name Logic", () => {
    it("displays backend full name when available", () => {
      setMocks({
        backendUser: { ...mockBackendUser, fullName: "Backend Name" },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("Backend Name")).toBeInTheDocument();
    });

    it("falls back to clerk full name when backend full name is null", () => {
      setMocks({ backendUser: { ...mockBackendUser, fullName: null } });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("constructs name from firstName and lastName when fullName is null", () => {
      setMocks({
        clerkUser: { ...mockClerkUser, fullName: null },
        backendUser: { ...mockBackendUser, fullName: null },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("shows only first name when lastName is null", () => {
      setMocks({
        clerkUser: { ...mockClerkUser, fullName: null, lastName: null },
        backendUser: { ...mockBackendUser, fullName: null },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("John")).toBeInTheDocument();
    });

    it("shows username when no name fields available", () => {
      setMocks({
        clerkUser: {
          ...mockClerkUser,
          fullName: null,
          firstName: null,
          lastName: null,
        },
        backendUser: { ...mockBackendUser, fullName: null },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("johndoe")).toBeInTheDocument();
    });

    it("shows email prefix when no name or username available", () => {
      setMocks({
        clerkUser: {
          ...mockClerkUser,
          fullName: null,
          firstName: null,
          lastName: null,
          username: null,
        },
        backendUser: { ...mockBackendUser, fullName: null, username: null },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("test")).toBeInTheDocument();
    });

    it('shows "User" as fallback when no information available', () => {
      setMocks({
        clerkUser: {
          id: "user_123",
          fullName: null,
          firstName: null,
          lastName: null,
          username: null,
          emailAddresses: [],
        },
        backendUser: {
          ...mockBackendUser,
          fullName: null,
          username: null,
          email: null,
        },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("User")).toBeInTheDocument();
    });

    it("shows Loading... when loading", () => {
      setMocks({ isLoading: true });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
  });

  describe("Initials Generation", () => {
    it("generates initials from full name (two words)", () => {
      setMocks({
        clerkUser: { ...mockClerkUser, fullName: "John Doe", imageUrl: null },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("generates initials from full name (three words) - uses first two words", () => {
      setMocks({
        clerkUser: {
          ...mockClerkUser,
          fullName: "John Michael Doe",
          imageUrl: null,
        },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("JD")).toBeInTheDocument();
    });

    it("generates single initial when only first name available", () => {
      setMocks({
        clerkUser: {
          ...mockClerkUser,
          fullName: null,
          firstName: "John",
          lastName: null,
          imageUrl: null,
        },
        backendUser: { ...mockBackendUser, fullName: null },
      });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getByText("J")).toBeInTheDocument();
    });
  });

  describe("Dropdown Toggle", () => {
    it("opens and closes dropdown", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      const button = screen.getByRole("button");
      // Act
      fireEvent.click(button);
      // Assert
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      // Act
      fireEvent.click(button);
      // Assert
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    it("rotates arrow and sets aria-expanded", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      const button = screen.getByRole("button");
      // eslint-disable-next-line testing-library/no-node-access
      const arrow = button.querySelector("svg");
      // Assert
      expect(arrow).not.toHaveClass("rotated");
      expect(button).toHaveAttribute("aria-expanded", "false");
      // Act
      fireEvent.click(button);
      // Assert
      expect(arrow).toHaveClass("rotated");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Dropdown Menu Items", () => {
    it("shows user info and avatar in dropdown", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      // Assert
      expect(screen.getAllByText("John Doe")).toHaveLength(2);
      expect(screen.getAllByText("test@example.com")).toHaveLength(2);
      expect(screen.getAllByAltText("John Doe").length).toBeGreaterThan(1);
    });

    it("shows all menu items and icons", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      // Assert
      ["Dashboard", "Profile Settings", "Help & Support", "Sign Out"].forEach(
        (text) => expect(screen.getByText(text)).toBeInTheDocument(),
      );
      ["🏠", "👤", "❓", "🚪"].forEach((icon) =>
        expect(screen.getByText(icon)).toBeInTheDocument(),
      );
    });
  });

  describe("Menu Item Actions", () => {
    beforeEach(() => {
      delete window.location;
      window.location = { href: "" };
    });

    it("navigates to home on Dashboard", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByRole("button", { name: /dashboard/i }));
      // Assert
      expect(window.location.href).toBe("/");
    });

    it("opens user profile on Profile Settings", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(
        screen.getByRole("button", { name: /profile settings/i }),
      );
      // Assert
      expect(mockOpenUserProfile).toHaveBeenCalled();
    });

    it("navigates to help on Help & Support", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByRole("button", { name: /help & support/i }));
      // Assert
      expect(window.location.href).toBe("/help");
    });

    it("calls signOut on Sign Out", async () => {
      mockSignOut.mockResolvedValue();
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
      // Assert
      await waitFor(() => {
        expect(mockSignOut).toHaveBeenCalled();
      });
    });

    it("closes dropdown after menu item click", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      const button = screen.getByRole("button");
      // Act
      fireEvent.click(button);
      fireEvent.click(screen.getByRole("button", { name: /dashboard/i }));
      // Assert
      expect(screen.queryByText("Profile Settings")).not.toBeInTheDocument();
    });
  });

  describe("Click Outside Behavior", () => {
    it("closes dropdown when clicking outside", () => {
      setMocks({});
      const { container } = render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      fireEvent.mouseDown(container);
      // Assert
      expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    });

    it("does not close dropdown when clicking inside", () => {
      setMocks({});
      render(<CustomUserDropdown />);
      // Act
      fireEvent.click(screen.getByRole("button"));
      // eslint-disable-next-line testing-library/no-node-access
      const dropdown = document.querySelector(".dropdown-menu");
      fireEvent.mouseDown(dropdown);
      // Assert
      expect(screen.getByText("Dashboard")).toBeInTheDocument();
    });
  });

  describe("Email Display", () => {
    it("shows backend email if available, else clerk email", () => {
      setMocks({});
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getAllByText("test@example.com")).toHaveLength(1);

      cleanup();
      setMocks({ backendUser: { ...mockBackendUser, email: null } });
      // Act
      render(<CustomUserDropdown />);
      // Assert
      expect(screen.getAllByText("test@example.com")).toHaveLength(1);
    });
  });

  describe("Cleanup", () => {
    it("removes event listener on unmount", () => {
      const spy = jest.spyOn(document, "removeEventListener");
      setMocks({});
      const { unmount } = render(<CustomUserDropdown />);
      // Act
      unmount();
      // Assert
      expect(spy).toHaveBeenCalledWith("mousedown", expect.any(Function));
    });
  });
});
