import React from 'react';

export default function WelcomeScreen({ onSelect }) {
  return (
    <div className="welcome-screen">
      <div className="welcome-top">
        <div className="logo-frame">
          <div className="logo-placeholder">
            <span>Your Logo</span>
          </div>
          <p className="logo-caption">Place your logo or brand image here later</p>
        </div>

        <div className="welcome-copy">
          <h1>Welcome</h1>
          <p>Choose Login or Sign Up to enter the booking portal.</p>
        </div>
      </div>

      <div className="welcome-actions">
        <button type="button" className="btn primary-btn" onClick={() => onSelect('signup')}>
          Sign Up
        </button>
        <button type="button" className="btn secondary-btn" onClick={() => onSelect('login')}>
          Login
        </button>
      </div>
    </div>
  );
}
