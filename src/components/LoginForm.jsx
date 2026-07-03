import React, { useState } from 'react';
import API from "../services/api";

export default function LoginForm({ onSwitch, onAuthSuccess }) {
  const [formData, setFormData] = useState({ contact: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const contact = formData.contact.trim();

    if (!contact) {
      newErrors.contact = 'Phone number or email is required';
    } else if (contact.includes('@')) {
      if (!emailRegex.test(contact)) {
        newErrors.contact = 'Enter a valid email address';
      }
    } else if (!phoneRegex.test(contact)) {
      newErrors.contact = 'Enter a valid 10-digit phone number';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    setErrors(newErrors);

   if (Object.keys(newErrors).length === 0) {

    try {

        setIsLoading(true);

        const response = await API.post("/login", {

            email: formData.contact,
            password: formData.password

        });

        setIsLoading(false);

        localStorage.setItem("token", response.data.token);

        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        onAuthSuccess({
            label: response.data.user.firstName
        })

    } catch (error) {

        setIsLoading(false);

        alert(error.response?.data?.message || "Login Failed");

    }

    }
  };

  const getGroupClass = (field) => {
    if (errors[field]) return 'input-group error shake';
    if (formData[field] && !errors[field]) return 'input-group success';
    return 'input-group';
  };

  return (
    <form className="form-section" onSubmit={handleSubmit} noValidate>
      <div className="form-fields">
        <div className={getGroupClass('contact')}>
          <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <input
            type="text"
            id="contact"
            placeholder=" "
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          <label htmlFor="contact">Phone number / email</label>
          {errors.contact && <div className="error-msg">{errors.contact}</div>}
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