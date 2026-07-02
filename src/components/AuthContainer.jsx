import React from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

export default function AuthContainer({ mode, onModeChange, onSuccess, onBack }) {
  const isSignup = mode === 'signup';

  return (
    <div className="glass-container auth-panel">
      <div className="auth-header">
        <div className="auth-text">
          <h1>{isSignup ? 'Welcome !' : 'Hello, Welcome Back!'}</h1>
          <p>
            {isSignup
              ? 'Sign up to reserve your next badminton court'
              : 'Please enter your phone number / email and password to access your account'}
          </p>
        </div>

        <div className="auth-toggle">
          <button
            type="button"
            className={`toggle-btn ${isSignup ? 'active' : ''}`}
            onClick={() => onModeChange('signup')}
          >
            Sign Up
          </button>
          <button
            type="button"
            className={`toggle-btn ${!isSignup ? 'active' : ''}`}
            onClick={() => onModeChange('login')}
          >
            Login
          </button>
        </div>
      </div>

      {isSignup ? (
        <SignupForm onSwitch={() => onModeChange('login')} onAuthSuccess={onSuccess} />
      ) : (
        <LoginForm onSwitch={() => onModeChange('signup')} onAuthSuccess={onSuccess} />
      )}

      <button type="button" className="btn secondary-btn back-button" onClick={onBack}>
        Back to welcome
      </button>
    </div>
  );
}
