import React from 'react';

export default function ProfilePage({ onBack }) {
  return (
    <div className="home-page profile-page">
      <div className="profile-card glass-container">
        <div className="profile-header">
          <p className="section-label">Profile</p>
          <h1>Your Profile</h1>
          <p>This page will be designed later. For now, use the button below to return home.</p>
        </div>

        <div className="profile-placeholder">
          <div className="profile-avatar">P</div>
          <p className="profile-text">Profile details coming soon</p>
        </div>

        <button type="button" className="btn primary-btn" onClick={onBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
