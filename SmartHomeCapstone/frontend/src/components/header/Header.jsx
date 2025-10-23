import "./Header.css";
import React, { useState } from "react";
import { useEffect } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";
import { useUser } from "../../context/UserContext";

/* ==================== Header Component ==================== */
export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, backendUser, isLoading } = useUser();

  /* === Handlers === */
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  /* === Side Effect: Apply Dark Mode to <body> === */
  useEffect(() => {
    document.body.classList.toggle("dark-mode", !isDarkMode);
  }, [isDarkMode]);

  /* === Get display name === */
  const getDisplayName = () => {
    if (isLoading) return "Loading...";
    
    // Try backend user fullName first
    if (backendUser?.fullName) {
      return backendUser.fullName;
    }
    
    // Try Clerk user fullName
    if (user?.fullName) {
      return user.fullName;
    }
    
    // Try to construct from Clerk firstName/lastName
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    
    // Try individual names
    if (user?.firstName) return user.firstName;
    if (user?.lastName) return user.lastName;
    
    // Try username or email
    if (backendUser?.username) return backendUser.username;
    if (user?.username) return user.username;
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.split('@')[0];
    }
    
    return "User";
  };

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
              placeholder="Search devices and rooms"
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
              <span style={{ marginRight: '10px', fontSize: '14px' }}>
                Welcome, {getDisplayName()}
              </span>
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
