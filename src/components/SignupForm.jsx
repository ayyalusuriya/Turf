import React, { useState } from 'react';

export default function SignupForm({ onSwitch }) {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', password: '', confirmPassword: '', gender: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const patterns = {
    name: /^[A-Za-z]{2,30}$/,
    phone: /^\d{10}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return '';
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1;
    if (/\d/.test(pass) && /[@$!%*?&]/.test(pass)) strength += 1;

    if (strength === 1 || pass.length < 8) return 'weak';
    if (strength === 2) return 'medium';
    return 'strong';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!patterns.name.test(formData.firstName)) newErrors.firstName = '2-30 letters only';
    if (!patterns.name.test(formData.lastName)) newErrors.lastName = '2-30 letters only';
    if (!patterns.phone.test(formData.phone)) newErrors.phone = 'Exactly 10 digits required';
    if (!patterns.password.test(formData.password)) newErrors.password = 'Must meet complexity rules';
    if (!formData.confirmPassword || formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.gender) newErrors.gender = 'Select a gender';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        alert('Account created successfully!');
      }, 1500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'phone') {
      setFormData({ ...formData, phone: value.replace(/\D/g, '').slice(0, 10) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Clear error dynamically when user types
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const getGroupClass = (field, noIcon = false) => {
    let baseClass = noIcon ? 'input-group no-icon' : 'input-group';
    if (errors[field]) return `${baseClass} error shake`;
    if (formData[field] && !errors[field]) return `${baseClass} success`;
    return baseClass;
  };

  const strength = getPasswordStrength(formData.password);

  return (
    <form className="form-section" onSubmit={handleSubmit} noValidate>
      <h2>Create Account</h2>

      <div className="row">
        <div className={getGroupClass('firstName', true)}>
          <input type="text" name="firstName" id="firstName" placeholder=" " value={formData.firstName} onChange={handleChange} />
          <label htmlFor="firstName">First Name</label>
          {errors.firstName && <div className="error-msg">{errors.firstName}</div>}
        </div>
        <div className={getGroupClass('lastName', true)}>
          <input type="text" name="lastName" id="lastName" placeholder=" " value={formData.lastName} onChange={handleChange} />
          <label htmlFor="lastName">Last Name</label>
          {errors.lastName && <div className="error-msg">{errors.lastName}</div>}
        </div>
      </div>

      <div className={getGroupClass('phone')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <input type="tel" name="phone" id="phone" placeholder=" " value={formData.phone} onChange={handleChange} />
        <label htmlFor="phone">Phone Number</label>
        {errors.phone && <div className="error-msg">{errors.phone}</div>}
      </div>

      <div className={getGroupClass('password')}>
        <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <input type={showPassword ? 'text' : 'password'} name="password" id="signupPassword" placeholder=" " value={formData.password} onChange={handleChange} />
        <label htmlFor="signupPassword">Password</label>
        <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
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
        <input type="password" name="confirmPassword" id="confirmPassword" placeholder=" " value={formData.confirmPassword} onChange={handleChange} />
        <label htmlFor="confirmPassword">Confirm Password</label>
        {errors.confirmPassword && <div className="error-msg">{errors.confirmPassword}</div>}
      </div>

      <div className="gender-group">
        {['Male', 'Female', 'Other'].map(g => (
          <label className="radio-label" key={g}>
            <input type="radio" name="gender" value={g.toLowerCase()} checked={formData.gender === g.toLowerCase()} onChange={handleChange} />
            <span className="radio-custom"></span> {g}
          </label>
        ))}
        {errors.gender && <div className="error-msg gender-error">{errors.gender}</div>}
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