import React, { useState } from 'react';

export default function LoginForm({ onSwitch }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // 1. Email validation
    if (!formData.username.trim()) {
      newErrors.username = 'Email required';
    } else if (!formData.username.includes('@')) {
      newErrors.username = 'Please enter a valid email address';
    }

    // 2. Password validation
    const password = formData.password;
    
    // Regex breakdown: 
    // (?=.*[A-Za-z]) -> must contain at least one letter
    // (?=.*\d)       -> must contain at least one number
    // (?=.*[\W_])    -> must contain at least one special character
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_]).+$/;

    if (!password.trim()) {
      newErrors.password = 'Password required';
    } else if (!passwordRegex.test(password)) {
      newErrors.password = 'Password must include letters, numbers, and special characters';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Logged in successfully!');
      }, 1500);
    }
  };

  const getGroupClass = (field) => {
    if (errors[field]) return 'input-group error shake';
    if (formData[field] && !errors[field]) return 'input-group success';
    return 'input-group';
  };

  return (
    <form className="form-section" onSubmit={handleSubmit} noValidate>
      <h2>Welcome Back</h2>
      
      <div className={getGroupClass('username')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <input 
          type="email" 
          id="username" 
          placeholder=" " 
          value={formData.username} 
          onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
        />
        <label htmlFor="username">Email Address</label>
        {errors.username && <div className="error-msg">{errors.username}</div>}
      </div>

      <div className={getGroupClass('password')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input 
          type={showPassword ? 'text' : 'password'} 
          id="password" 
          placeholder=" " 
          value={formData.password} 
          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
        />
        <label htmlFor="password">Password</label>
        <button 
          type="button" 
          className="toggle-password" 
          onClick={() => setShowPassword(!showPassword)} 
          aria-label="Toggle password visibility"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        {errors.password && <div className="error-msg">{errors.password}</div>}
      </div>

      <button type="submit" className="btn primary-btn" disabled={isLoading}>
        {isLoading ? <span className="loader"></span> : 'Login'}
      </button>
      <button type="button" className="btn secondary-btn" onClick={onSwitch}>
        Create an account
      </button>
    </form>
  );
}
