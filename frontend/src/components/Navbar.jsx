import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, Activity, FilePlus, LogOut, Users, Apple, Home, AlertTriangle, FileText, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className="navbar">
      <div className="navbar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link to="/" className="navbar-brand">
          <div className="navbar-icon-wrapper" style={{ width: '32px', height: '32px' }}>
            <Stethoscope size={18} />
          </div>
          <span style={{ fontSize: '1.1rem' }}>PediaResearch</span>
        </Link>
        <button 
           className="mobile-menu-btn no-print" 
           onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div className={`navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`}>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <Activity size={16} /> Dashboard
          </Link>
          <Link to="/mothers" className={`nav-link ${isActive('/mothers') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <Users size={16} /> Mothers
          </Link>
          <Link to="/nutrition" className={`nav-link ${isActive('/nutrition') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <Apple size={16} /> Nutrition
          </Link>
          <Link to="/hygiene" className={`nav-link ${isActive('/hygiene') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <Home size={16} /> Hygiene
          </Link>
          <Link to="/alerts" className={`nav-link ${isActive('/alerts') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <AlertTriangle size={16} /> Alerts
          </Link>
          <Link to="/reports" className={`nav-link ${isActive('/reports') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <FileText size={16} /> Reports
          </Link>
          <div className="nav-divider" style={{ width: '1px', height: '24px', background: 'var(--border)' }}></div>
          <Link to="/add-record" className={`nav-link ${isActive('/add-record') ? 'active' : ''}`} style={{ fontSize: '0.85rem' }}>
            <FilePlus size={16} /> Add Record
          </Link>
        </div>
        
        <div className="navbar-user-info" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Logged in as: <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{user?.role || 'Researcher'}</span>
          </div>
          <button
            onClick={logout}
            className="btn btn-danger-outline"
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
