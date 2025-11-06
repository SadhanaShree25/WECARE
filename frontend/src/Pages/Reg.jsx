import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';

// ... your getFriendlyErrorMessage function ...

function Reg() {
  const location = useLocation();
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [isRegistering, setIsRegistering] = useState(location.pathname === '/register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Sync form mode with URL path
  useEffect(() => {
    setIsRegistering(location.pathname === '/register');
  }, [location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering) {
        if (!username.trim()) {
          setError('Please choose a username.');
          setLoading(false);
          return;
        }
        await register(email, password, username);
      } else {
        await login(email, password);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(getFriendlyErrorMessage(err.code));
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="card login-box">
        <h1>{isRegistering ? 'Create Your Account' : 'Welcome Back'}</h1>
        <p>
          {isRegistering
            ? 'Create an account to get started.'
            : 'Log in to access your dashboard.'}
        </p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <input
              type="text"
              className="form-input"
              placeholder="Choose a Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          )}
          <input
            type="email"
            className="form-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            className="form-input"
            placeholder="Password (6+ characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Processing...' : isRegistering ? 'Register' : 'Login'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => {
              const targetPath = isRegistering ? '/login' : '/register';
              navigate(targetPath);
            }}
            disabled={loading}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-color)',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            {isRegistering
              ? 'Already have an account? Log In'
              : "Don't have an account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reg;