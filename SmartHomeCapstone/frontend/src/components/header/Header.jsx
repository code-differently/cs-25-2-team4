import './Header.scss';
import React from 'react';

export const Header = () => {
  return (
    <header className="header">
      <nav className="header-top-menu">
        <ul>
          <li>
            <a href="/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/contact">Contact</a>
          </li>
        </ul>
      </nav>
    </header>
  );
};
