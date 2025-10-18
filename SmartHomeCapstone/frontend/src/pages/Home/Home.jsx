import React from 'react';
import './Home.css';

export const Home = () => {
  return (
    <div className="home">

      {/* Rooms bar row */}
      <div className="rooms-bar">
        <button>All</button>
        <button>+ Add</button>
      </div>

      {/* Devices Section */}
      <section className="devices-section">
        <div className="devices-header">
          <h2>My Devices</h2>
          <button data-testid="add-device-btn" className="add-device-btn">
            + Add Device
          </button>
        </div>

        {/* No devices yet on first load */}
      </section>

    </div>
  );
};
