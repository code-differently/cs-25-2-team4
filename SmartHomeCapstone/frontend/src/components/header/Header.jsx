import "./Header.css";
import { useState } from "react";
import { useEffect } from "react";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { CustomUserDropdown } from "./CustomUserDropdown";

/* ==================== Header Component ==================== */
export const Header = ({ searchTerm, onSearchChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  /* === Handlers === */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  /* === Side Effect: Apply Dark Mode to <body> === */
  useEffect(() => {
    document.body.classList.toggle("dark-mode", !isDarkMode);
  }, [isDarkMode]);

 /* ==================== Render ==================== */
  return (
    <header className="header">
      <nav className="header-top-menu">

        {/* === Left: Title === */}
        <div className="header-left">
          <h1 className="header-title">
            <a href="/">SmartHome</a>
          </h1>
        </div>

        {/* === Center: Search === */}
        <div className="header-center">
          <div className="header-search">
            <input
              type="text"
              placeholder="Search devices by name"
              className="search-input"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        {/* === Right: Toggle + Profile === */}
        <div className="header-right">

          {/* --- Dark Mode Toggle --- */}
          <div className="toggle-switch">
            <input
              type="checkbox"
              id="dark-mode-toggle"
              checked={isDarkMode}
              onChange={toggleDarkMode}
            />
            <label htmlFor="dark-mode-toggle" className="toggle-label">
              <span className="toggle-slider">{isDarkMode ? "☀️" : "🌙"}</span>
            </label>
          </div>

          {/* --- Profile Section --- */}
          <div className="profile-section">
            <SignedIn>
              <CustomUserDropdown />
            </SignedIn>
            <SignedOut>
              <span>Please sign in</span>
            </SignedOut>
          </div>
        </div>
      </nav>
    </header>
  );
};
