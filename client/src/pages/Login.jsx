import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiShield, FiUser } from 'react-icons/fi';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(() => searchParams.get('admin') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectPath = location.state?.from || '/';

  // Sync state if query parameter changes
  useEffect(() => {
    if (searchParams.get('admin') === 'true') {
      setIsAdminLogin(true);
    }
  }, [searchParams]);

  const handleFillDemoAdmin = () => {
    setIdentifier('admin@imovies.com');
    setPassword('Admin@123456');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const cleanIdentifier = identifier.trim();
    if (!cleanIdentifier || !password) {
      setError('Please enter both your email/username and password');
      return;
    }

    try {
      setLoading(true);
      const user = await login(cleanIdentifier, password);
      toast.success(`Welcome back, ${user.username}!`);
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        if (isAdminLogin) {
          toast.info('Signed in as standard user. To access the admin suite, please use an administrator account.');
        }
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Invalid email, username, or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="login-page d-flex align-items-center justify-content-center py-5 px-3"
      style={{
        minHeight: '80vh',
        backgroundColor: '#08090D',
      }}
    >
      <div
        className="cinema-card shadow-lg"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#111827',
          border: isAdminLogin ? '1px solid #F59E0B' : '1px solid #E50914',
          borderRadius: '12px',
          padding: '2.5rem 2rem',
        }}
      >
        {/* Header matching Screenshot 2 */}
        <div className="text-center mb-3">
          <div className="brand-logo mb-1" style={{ fontSize: '2rem' }}>
            <span className="brand-i">i</span>
            <span className="brand-movies">Movies</span>
          </div>
          <h2 className="h5 fw-bold" style={{ color: '#F9FAFB' }}>
            {isAdminLogin ? 'Admin Sign In' : 'Login'}
          </h2>
        </div>

        {/* Tab switch between Customer and Admin */}
        <div className="d-flex mb-4 p-1 rounded" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
          <button
            type="button"
            className={`btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 ${
              !isAdminLogin ? 'btn-danger' : 'btn-link text-muted text-decoration-none'
            }`}
            onClick={() => setIsAdminLogin(false)}
          >
            <FiUser size={14} /> User Sign In
          </button>
          <button
            type="button"
            className={`btn btn-sm flex-fill d-flex align-items-center justify-content-center gap-1 ${
              isAdminLogin ? 'btn-warning text-dark fw-bold' : 'btn-link text-muted text-decoration-none'
            }`}
            onClick={() => setIsAdminLogin(true)}
          >
            <FiShield size={14} /> Admin Sign In
          </button>
        </div>

        {isAdminLogin && (
          <div className="mb-3 text-center">
            <button
              type="button"
              className="btn btn-outline-warning btn-sm w-100 py-1"
              style={{ fontSize: '0.8rem' }}
              onClick={handleFillDemoAdmin}
            >
              Fill Demo Admin (admin@imovies.com)
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert-danger py-2 px-3 small mb-3" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email or Username Field */}
          <div className="mb-3 text-start">
            <label className="cinema-label" htmlFor="loginIdentifier">
              Email or Username
            </label>
            <input
              id="loginIdentifier"
              type="text"
              className="form-control cinema-input w-100"
              placeholder={isAdminLogin ? 'admin or admin@imovies.com' : 'Enter your email or username'}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password Field */}
          <div className="mb-3 text-start">
            <label className="cinema-label" htmlFor="loginPassword">
              Password
            </label>
            <input
              id="loginPassword"
              type={showPassword ? 'text' : 'password'}
              className="form-control cinema-input w-100"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Show Password Checkbox matching Screenshot 2 */}
          <div className="form-check text-start mb-4">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPasswordCheck"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
              style={{
                backgroundColor: showPassword ? 'var(--color-primary)' : 'var(--color-bg-secondary)',
                borderColor: 'var(--color-border)',
              }}
            />
            <label
              className="form-check-label small"
              htmlFor="showPasswordCheck"
              style={{ color: '#9CA3AF', cursor: 'pointer' }}
            >
              Show Password
            </label>
          </div>

          {/* Submit Button matching Screenshot 2 */}
          <button
            type="submit"
            className={`btn w-100 py-2 mb-3 ${isAdminLogin ? 'btn-warning text-dark fw-bold' : 'btn-cinema'}`}
            disabled={loading}
            style={{ fontWeight: '600' }}
          >
            {loading ? 'Signing in...' : isAdminLogin ? 'Sign In to Admin Suite' : 'Submit'}
          </button>

          {/* Create an account link matching Screenshot 2 */}
          <div className="text-center small mt-3" style={{ color: '#9CA3AF' }}>
            {isAdminLogin ? 'Need an admin account? ' : 'Create an account '}
            <Link
              to={isAdminLogin ? '/register?admin=true' : '/register'}
              className="text-decoration-none fw-bold"
              style={{ color: 'var(--color-primary)' }}
            >
              {isAdminLogin ? 'Register as Admin' : 'Register'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
