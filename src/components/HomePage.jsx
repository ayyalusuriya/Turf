import React from 'react';

export default function HomePage({ userLabel, facilities, onSelectFacility, onProfile, onLogout }) {
  return (
    <div className="home-page">
      <div className="home-content">
        <div className="home-topbar">
          <div className="user-intro">
            <div className="avatar-placeholder">{userLabel ? userLabel.charAt(0).toUpperCase() : 'U'}</div>
            <div>
              <p className="small-label">Hello</p>
              <h2>{userLabel ? `${userLabel}` : 'Guest'}</h2>
            </div>
          </div>
          <div className="top-buttons">
            <button type="button" className="icon-btn" aria-label="Search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button type="button" className="icon-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
          </div>
        </div>

        <div className="hero-banner">
          <div className="hero-copy">
            <p>Book the best sports facilities in town.</p>
          </div>
        </div>

        <div className="available-row">
          <span>AVAILABLE NOW</span>
          <button type="button" className="view-all">View All</button>
        </div>

        <div className="facility-grid">
          {facilities.map((facility) => (
            <button
              key={facility.id}
              type="button"
              className="facility-card"
              onClick={() => onSelectFacility(facility)}
              style={{ backgroundImage: `url(${facility.image})` }}
            >
              <div className="facility-overlay" />
              <div className="facility-footer">
                <span>{facility.title}</span>
                <span className="facility-price">{facility.price}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <nav className="home-nav">
        <button type="button" className="nav-item active" aria-label="Home">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 9.5L12 3l9 6.5V21a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
            <path d="M9 21V12h6v9" />
          </svg>
        </button>
        <button type="button" className="nav-item" aria-label="Locations">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10z" />
            <circle cx="12" cy="11" r="2" />
          </svg>
        </button>
        <button type="button" className="nav-item" aria-label="Favorites">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21.1l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.7z" />
          </svg>
        </button>
        <button type="button" className="nav-item" aria-label="Profile" onClick={onProfile}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="7" r="4" />
            <path d="M6 21v-2a6 6 0 0 1 12 0v2" />
          </svg>
        </button>
      </nav>
    </div>
  );
}
