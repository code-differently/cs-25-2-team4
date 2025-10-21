import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "./Header";

describe("Header", () => {
  it("renders correctly", () => {
    // Act
    render(<Header />);

    // Assert
    expect(screen.getByText("SmartHome")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Search type of keywords"),
    ).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByAltText("Profile")).toBeInTheDocument();
  });

  it("toggles dropdown when profile section is clicked", () => {
    // Act
    render(<Header />);

    // Use a more semantic approach - look for a clickable element
    const profileDropdown = screen.getByText("John Doe");

    // Assert
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();

    // Act
    fireEvent.click(profileDropdown);

    // Assert
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("About")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("toggles dark mode when toggle switch is clicked", () => {
    // Act
    render(<Header />);

    const toggleSwitch = screen.getByRole("checkbox");

    // Assert
    expect(toggleSwitch).not.toBeChecked();

    // Act
    fireEvent.click(toggleSwitch);

    // Assert
    expect(toggleSwitch).toBeChecked();
  });

  it("closes dropdown when profile section is clicked again", () => {
    // Act
    render(<Header />);

    const profileDropdown = screen.getByText("John Doe");

    // Act
    fireEvent.click(profileDropdown);

    // Assert
    expect(screen.getByText("Profile")).toBeInTheDocument();

    // Act
    fireEvent.click(profileDropdown);

    // Assert
    expect(screen.queryByText("Profile")).not.toBeInTheDocument();
  });

  it("changes icon when dark mode is toggled", () => {
    // Act
    render(<Header />);

    // Assert
    expect(screen.getByText("🌙")).toBeInTheDocument();
    expect(screen.queryByText("☀️")).not.toBeInTheDocument();

    // Act + Toggle dark mode
    const toggleSwitch = screen.getByRole("checkbox");
    fireEvent.click(toggleSwitch);

    // Assert — icon updated after toggle
    expect(screen.getByText("☀️")).toBeInTheDocument();
    expect(screen.queryByText("🌙")).not.toBeInTheDocument();
  });

  it("adds and removes dark-mode class on body when toggle is clicked", () => {
    // Act
    render(<Header />);

    // Assert — By default dark mode should be ON (because !isDarkMode = true)
    expect(document.body).toHaveClass("dark-mode");

    // Act - Click to toggle to light mode
    fireEvent.click(screen.getByRole("checkbox"));

    // Assert — Now dark-mode should be removed
    expect(document.body).not.toHaveClass("dark-mode");

    // Act - Click again to toggle back
    fireEvent.click(screen.getByRole("checkbox"));

    // Assert — dark-mode should be applied again
    expect(document.body).toHaveClass("dark-mode");
  });
});
