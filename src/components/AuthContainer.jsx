import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import './Auth.css';

export default function AuthContainer() {
  const [view, setView] = useState('login');

  return (
    <div className="glass-container">
      {view === 'login' ? (
        <LoginForm onSwitch={() => setView('signup')} />
      ) : (
        <SignupForm onSwitch={() => setView('login')} />
      )}
    </div>
  );
}