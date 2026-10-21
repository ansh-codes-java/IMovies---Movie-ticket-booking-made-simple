import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiShield, FiUser } from 'react-icons/fi';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminRegister, setIsAdminRegister] = useState(() => searchParams.get('admin') === 'true');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync state if query parameter changes
  useEffect(() => {
    if (searchParams.get('admin') === 'true') {
      setIsAdminRegister(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        username: username.trim(),
        email: email.trim(),
        password,
        confirmPassword,
        phone: phone.trim(),
      };

      if (isAdminRegister) {
        payload.role = 'ADMIN';
        payload.adminSecretKey = adminSecretKey.trim();
      }

      const user = await register(payload);
      toast.success(
        user.role === 'ADMIN'
          ? `Admin privileges granted! Welcome, ${user.username}`
          : `Account created successfully! Welcome, ${user.username}`
      );
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-page d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        minHeight: '85vh',
        backgroundColor: '#08090D',
      }}
    >
      <div
        className="cinema-card shadow-lg"
        style={{
          width: '100%',
          maxWidth: '460px',
          backgroundColor: '#111827',
          border: isAdminRegister ? '1px solid #F59E0B' : '1px solid #E50914',
          borderRadius: '12px',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Header matching Screenshot 1 */}
        <div className="text-center mb-3">
          <div className="brand-logo mb-1" style={{ fontSize: '2rem' }}>
            <span className="brand-i">i</span>
            <span className="brand-movies">Movies</span>
          </div>
          <h2 className="h5 fw-bold" style={{ color: '#F9FAFB' }}>
            {isAdminRegister ? 'Admin Registration' : 'Register'}
          </h2>
        </div>

        {/* Tab switch between Customer and Admin */}
        <div className="d-flex mb-4 p-1 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <button
            type="button"
            className={`btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 ${
              !isAdminRegister ? 'btn-danger' : 'btn-link text-muted text-decoration-none'
            }`}
            onClick={() => setIsAdminRegister(false)}
          >
            <FiUser size={14} /> Regular User
          </button>
          <button
            type="button"
            className={`btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 ${
              isAdminRegister ? 'btn-warning text-dark fw-bold' : 'btn-link text-muted text-decoration-none'
            }`}
            onClick={() => setIsAdminRegister(true)}
          >
            <FiShield size={14} /> Admin Access
          </button>
        </div>

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <div className="mb-3 text-start">
            <label className="cinema-label" htmlFor="regUsername">
              Username
            </label>
            <input
              id="regUsername"
              type="text"
              className="form-control cinema-input w-100"
              placeholder="Enter Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-3 text-start">
            <label className="cinema-label" htmlFor="regEmail">
              Email
            </label>
            <input
              id="regEmail"
              type="email"
              className="form-control cinema-input w-100"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 text-start">
            <label className="cinema-label" htmlFor="regPassword">
              Password
            </label>
            <input
              id="regPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-control cinema-input w-100"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-3 text-start">
            <label className="cinema-label" htmlFor="regConfirmPassword">
              Confirm Password
            </label>
            <input
              id="regConfirmPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-control cinema-input w-100"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Optional Admin Secret Key */}
          {isAdminRegister && (
            <div className="mb-3 text-start">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <label className="cinema-label text-warning m-0" htmlFor="adminSecret">
                  Admin Authorization Key
                </label>
                <button
                  type="button"
                  className="btn btn-link p-0 text-warning small text-decoration-none"
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setAdminSecretKey('imovies_admin_secure_secret_2026')}
                >
                  Insert Default Key
                </button>
              </div>
              <input
                id="adminSecret"
                type="text"
                className="form-control cinema-input w-100 border-warning"
                placeholder="Enter admin authorization key"
                value={adminSecretKey}
                onChange={(e) => setAdminSecretKey(e.target.value)}
                required
              />
              <small className="text-muted d-block mt-1" style={{ fontSize: '0.78rem' }}>
                Key: <code className="text-warning">imovies_admin_secure_secret_2026</code>. If this email already exists, entering your password and this key will promote your account to Admin.
              </small>
            </div>
          )}

          {/* Show Password Checkbox matching Screenshot 1 */}
          <div className="form-check text-start mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPasswordCheckReg"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{
                backgroundColor: showPassword ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            />
            <label
              className="form-check-label small"
              htmlFor="showPasswordCheckReg"
              style={{ color: '#9CA3AF', cursor: 'pointer' }}
            >
              Show Password
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`btn w-100 py-2 mb-3 ${isAdminRegister ? 'btn-warning text-dark fw-bold' : 'btn-cinema'}`}
            disabled={loading}
            style={{ fontWeight: '600' }}
          >
            {loading ? 'Processing...' : isAdminRegister ? 'Create / Upgrade Admin Account' : 'Submit'}
          </button>

          {/* Already have an account link matching Screenshot 1 */}
          <div className="text-center small mb-2" style={{ color: '#9CA3AF' }}>
            Already have an account?{' '}
            <Link
              to={isAdminRegister ? '/login?admin=true' : '/login'}
              className="text-decoration-none fw-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              Login
            </Link>
          </div>

          {/* Register as an Admin link matching Screenshot 1 */}
          <div className="text-center small mt-2">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none small"
              style={{ color: isAdminRegister ? '#9CA3AF' : 'var(--color-primary)', fontSize: '0.85rem' }}
              onClick={() => setIsAdminRegister(!isAdminRegister)}
            >
              {isAdminRegister ? '← Switch to regular user registration' : 'Register as an Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
