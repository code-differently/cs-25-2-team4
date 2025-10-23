import React, { useState, useRef, useEffect } from 'react';
import { useClerk, useUser as useClerkUser } from '@clerk/clerk-react';
import { useUser } from '../../context/UserContext';
import './CustomUserDropdown.css';

export const CustomUserDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut, openUserProfile } = useClerk();
  const { user: clerkUser } = useClerkUser();
  const { user, backendUser, isLoading } = useUser();
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getDisplayName = () => {
    if (isLoading) return "Loading...";
    
    if (backendUser?.fullName) return backendUser.fullName;
    if (user?.fullName) return user.fullName;
    if (user?.firstName && user?.lastName) return `${user.firstName} ${user.lastName}`;
    if (user?.firstName) return user.firstName;
    if (user?.lastName) return user.lastName;
    if (backendUser?.username) return backendUser.username;
    if (user?.username) return user.username;
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.split('@')[0];
    }
    
    return "User";
  };

  const getInitials = () => {
    const name = getDisplayName();
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const menuItems = [
    {
      label: 'Dashboard',
      icon: '🏠',
      onClick: () => {
        window.location.href = '/';
        setIsOpen(false);
      }
    },
    {
      label: 'Profile Settings',
      icon: '👤',
      onClick: () => {
        openUserProfile();
        setIsOpen(false);
      }
    },
    {
      label: 'Help & Support',
      icon: '❓',
      onClick: () => {
        window.location.href = '/help';
        setIsOpen(false);
      }
    },
    {
      type: 'divider'
    },
    {
      label: 'Sign Out',
      icon: '🚪',
      onClick: handleSignOut,
      className: 'sign-out'
    }
  ];

  return (
    <div className="custom-user-dropdown" ref={dropdownRef}>
      <button 
        className="user-avatar-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">
          {clerkUser?.imageUrl ? (
            <img 
              src={clerkUser.imageUrl} 
              alt={getDisplayName()}
              className="avatar-image"
            />
          ) : (
            <div className="avatar-initials">
              {getInitials()}
            </div>
          )}
        </div>
        <div className="user-info">
          <span className="user-name">{getDisplayName()}</span>
          <span className="user-email">
            {backendUser?.email || clerkUser?.emailAddresses?.[0]?.emailAddress}
          </span>
        </div>
        <svg 
          className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12"
        >
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-header">
            <div className="user-avatar-large">
              {clerkUser?.imageUrl ? (
                <img 
                  src={clerkUser.imageUrl} 
                  alt={getDisplayName()}
                  className="avatar-image-large"
                />
              ) : (
                <div className="avatar-initials-large">
                  {getInitials()}
                </div>
              )}
            </div>
            <div className="user-details">
              <h3 className="user-name-large">{getDisplayName()}</h3>
              <p className="user-email-small">
                {backendUser?.email || clerkUser?.emailAddresses?.[0]?.emailAddress}
              </p>
            </div>
          </div>

          <div className="dropdown-content">
            {menuItems.map((item, index) => {
              if (item.type === 'divider') {
                return <div key={index} className="dropdown-divider" />;
              }

              return (
                <button
                  key={index}
                  className={`dropdown-item ${item.className || ''}`}
                  onClick={item.onClick}
                >
                  <span className="item-icon">{item.icon}</span>
                  <span className="item-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};