import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { success, msg } = await register(name, email, password);
    if (success) {
      navigate('/login', { state: { message: 'Registration successful! Please login.' } });
    } else {
      setError(msg || 'Registration failed');
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
          <p className="page-subtitle" style={{ fontSize: '0.95rem' }}>Create Account</p>
        </div>

        {error && (
          <div className="alert-box" style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', textAlign: 'center', borderColor: 'var(--danger-bg)', background: 'var(--danger-bg)' }}>
            <span style={{ color: 'var(--danger-text)', fontWeight: 600, fontSize: '0.9rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Dr. John Doe"
            />
          </div>
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
            Register
          </button>
        </form>
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500, textDecoration: 'none' }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
