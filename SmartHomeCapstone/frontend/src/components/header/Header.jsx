import "./Header.css";
import React, { useState } from "react";
import { useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

/* ==================== Header Component ==================== */
export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  /* === Handlers === */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
              placeholder="Search type of keywords"
              className="search-input"
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
              <UserButton />
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
