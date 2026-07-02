import React, { useState } from 'react';

export default function SignupForm({ onSwitch, onAuthSuccess }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const nameRegex = /^[A-Za-z]{2,30}$/;
  const passwordRegex = /^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1;
    if (/\d/.test(pass) && /[@$!%*?&]/.test(pass)) strength += 1;
    if (strength === 1) return 'weak';
    if (strength === 2) return 'medium';
    return 'strong';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!nameRegex.test(formData.firstName)) newErrors.firstName = 'First name should be 2-30 letters';
    if (!nameRegex.test(formData.lastName)) newErrors.lastName = 'Last name should be 2-30 letters';
    if (!phoneRegex.test(formData.phone)) newErrors.phone = 'Phone number must be 10 digits';
    if (!emailRegex.test(formData.email)) newErrors.email = 'Enter a valid email address';
    if (!passwordRegex.test(formData.password)) newErrors.password = 'Password must be at least 8 characters and include upper/lowercase plus numbers';
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess({ label: formData.firstName });
      }, 1200);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, phone: value.replace(/\D/g, '').slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const getGroupClass = (field, noIcon = false) => {
    const baseClass = noIcon ? 'input-group no-icon' : 'input-group';
    if (errors[field]) return `${baseClass} error shake`;
    if (formData[field] && !errors[field]) return `${baseClass} success`;
    return baseClass;
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <form className="form-section" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className={getGroupClass('firstName', true)}>
          <input
            type="text"
            name="firstName"
            id="firstName"
            placeholder=" "
            value={formData.firstName}
            onChange={handleChange}
          />
          <label htmlFor="firstName">First Name</label>
          {errors.firstName && <div className="error-msg">{errors.firstName}</div>}
        </div>
        <div className={getGroupClass('lastName', true)}>
          <input
            type="text"
            name="lastName"
            id="lastName"
            placeholder=" "
            value={formData.lastName}
            onChange={handleChange}
          />
          <label htmlFor="lastName">Last Name</label>
          {errors.lastName && <div className="error-msg">{errors.lastName}</div>}
        </div>
      </div>

      <div className={getGroupClass('phone')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <input type="tel" name="phone" id="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
        <label htmlFor="phone">Mobile Number</label>
        {errors.phone && <div className="error-msg">{errors.phone}</div>}
      </div>

      <div className={getGroupClass('email')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
        <input type="email" name="email" id="email" placeholder=" " value={formData.email} onChange={handleChange} />
        <label htmlFor="email">Mail ID</label>
        {errors.email && <div className="error-msg">{errors.email}</div>}
      </div>

      <div className={getGroupClass('password')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input
          type={showPassword ? 'text' : 'password'}
          name="password"
          id="signupPassword"
          placeholder=" "
          value={formData.password}
          onChange={handleChange}
        />
        <label htmlFor="signupPassword">Password</label>
        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
        {formData.password && (
          <div className={`password-strength ${strength}`}>
            <div className="strength-bar"></div>
            <span className="strength-text">{strength.charAt(0).toUpperCase() + strength.slice(1)}</span>
          </div>
        )}
        {errors.password && !formData.password && <div className="error-msg">{errors.password}</div>}
      </div>

      <div className={getGroupClass('confirmPassword')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder=" "
          value={formData.confirmPassword}
          onChange={handleChange}
        />
        <label htmlFor="confirmPassword">Confirm Password</label>
        {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
      </div>

      <button type="submit" className="btn primary-btn" disabled={isLoading}>
        {isLoading ? <span className="loader"></span> : 'Sign Up'}
      </button>
      <button type="button" className="btn secondary-btn" onClick={onSwitch}>
        Back to Login
      </button>
    </form>
  );
}
