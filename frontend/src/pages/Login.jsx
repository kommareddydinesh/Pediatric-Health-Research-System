import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="auth-page animate-fade-in">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="navbar-icon-wrapper" style={{ width: '64px', height: '64px', margin: '0 auto 1.5rem', borderRadius: '20px' }}>
            <Stethoscope size={32} />
          </div>
          <h1 className="page-title" style={{ fontSize: '1.75rem' }}>PediaResearch</h1>
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>Data & Analytics System</p>
        </div>

        {error && (
          <div className="alert-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', textAlign: 'center', borderColor: 'var(--danger-bg)', background: 'var(--danger-bg)' }}>
            <span style={{ color: 'var(--danger-text)', fontWeight: 600, fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        {successMessage && !error && (
          <div className="alert-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', textAlign: 'center', borderColor: '#d1e7dd', background: '#d1e7dd' }}>
            <span style={{ color: '#0f5132', fontWeight: 600, fontSize: '0.9rem' }}>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Researcher Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@greennetspark.in"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Admin@123"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            Access Dashboard
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
