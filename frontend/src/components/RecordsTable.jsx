import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, AlertTriangle } from 'lucide-react';

const RecordsTable = ({ limit, showViewAll }) => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [educationFilter, setEducationFilter] = useState('All');

  useEffect(() => {
    fetchRecords();
  }, [search, educationFilter]);

  const fetchRecords = async () => {
    try {
      const res = await axios.get(`/records?search=${search}&education=${educationFilter}`);
      setRecords(res.data);
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Good': return 'badge-success';
      case 'Moderate': return 'badge-warning';
      case 'Poor': return 'badge-danger';
      default: return 'badge';
    }
  };

  const displayedRecords = limit ? records.slice(0, limit) : records;

  return (
    <div className="table-container animate-fade-in">
      <div className="table-toolbar">
        <h3>Pediatric Records Database</h3>
        
        <div className="table-filters">
          <div className="form-group" style={{ marginBottom: 0 }}>
            <Search className="form-icon" size={16} style={{ top: '0.85rem' }} />
            <input
              type="text"
              placeholder="Search by name..."
              className="form-control has-icon"
              style={{ width: '250px', padding: '0.6rem 1rem 0.6rem 2.8rem' }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <Filter className="form-icon" size={16} style={{ top: '0.85rem' }} />
            <select
              className="form-control has-icon"
              style={{ width: '200px', padding: '0.6rem 1.5rem 0.6rem 2.8rem' }}
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
            >
              <option value="All">All Education Levels</option>
              <option value="No Schooling">No Schooling</option>
              <option value="Primary">Primary</option>
              <option value="Secondary">Secondary</option>
              <option value="Higher">Higher</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Child Name</th>
              <th>Age (mo)</th>
              <th>Mother's Edu</th>
              <th>Vaccines</th>
              <th>Health Score</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">
                  <div className="loader-container" style={{ minHeight: '20vh' }}>
                    <div className="spinner"></div>
                  </div>
                </td>
              </tr>
              ) : displayedRecords.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">No records found matching your criteria.</td>
              </tr>
            ) : (
              displayedRecords.map(r => (
                <tr key={r._id}>
                  <td style={{ fontWeight: 600 }}>{r.childInfo.name}</td>
                  <td>{r.childInfo.ageMonths}</td>
                  <td>{r.maternalInfluence.motherEducation}</td>
                  <td>{r.immunization.completenessStatus}</td>
                  <td>
                    <div className="progress-wrapper">
                      <div className="progress-track">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: `${r.healthMetrics.healthScore}%`,
                            background: r.healthMetrics.healthScore >= 75 ? 'var(--success)' : r.healthMetrics.healthScore >= 50 ? 'var(--warning)' : 'var(--danger)'
                          }}
                        ></div>
                      </div>
                      <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{r.healthMetrics.healthScore}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className={`badge ${getStatusColor(r.healthMetrics.healthStatus)}`}>
                        {r.healthMetrics.healthStatus}
                      </span>
                      {r.healthMetrics.isFlagged && (
                        <AlertTriangle size={16} color="var(--danger)" title="Flagged for risk" />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {showViewAll && records.length > (limit || 0) && (
        <div style={{ padding: '1.25rem', textAlign: 'center', borderTop: '1px solid var(--border)', background: 'var(--surface-hover)' }}>
          <button 
            className="btn" 
            onClick={() => navigate('/all-records')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: '700', borderRadius: '12px' }}
          >
            View All Records <AlertTriangle size={1} style={{display:'none'}} />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default RecordsTable;
