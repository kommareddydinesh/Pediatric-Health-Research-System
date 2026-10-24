import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const Alerts = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/records');
      setRecords(res.data.filter(r => r.healthMetrics.isFlagged));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitiateFollowUp = () => {
    setToastMessage(`Medical Follow-up marked initiated for ${selectedCase.childInfo.name}`);
    setSelectedCase(null);
    setTimeout(() => setToastMessage(''), 4000);
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, background: 'var(--surface)', border: '1px solid var(--success)', borderLeft: '4px solid var(--success)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.3s ease-out forwards' }}>
          <CheckCircle size={20} color="var(--success)" />
          <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{toastMessage}</span>
        </div>
      )}

      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'var(--danger)', color: 'white', padding: '1rem', borderRadius: '16px', boxShadow: '0 10px 25px rgba(239, 68, 68, 0.4)' }}>
          <AlertTriangle size={32} />
        </div>
        <div>
          <h1 className="page-title">Risk Detection Ledger</h1>
          <p className="page-subtitle">Real-time tracking of unhealthy children with critical health alerts</p>
        </div>
      </div>

      <div className="stats-row" style={{ marginBottom: '2rem' }}>
        <div className="glass-card stat-card" style={{ borderColor: 'var(--danger-bg)' }}>
          <div className="stat-icon-wrapper red">
             <AlertCircle size={24} />
          </div>
          <div>
            <p className="stat-label">Total Flagged Children</p>
            <p className="stat-value text-danger" style={{ margin: 0, textAlign: 'left', fontSize: '1.75rem' }}>{records.length}</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper purple">
            <Activity size={24} />
          </div>
          <div>
            <p className="stat-label">Critical Review Needed</p>
            <p className="stat-value">{records.filter(r => r.healthMetrics.alertReasons.length >= 2).length}</p>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="section-title">Children Requiring Immediate Medical Attention</h3>
        
        {records.length === 0 ? (
          <div className="empty-state">No children currently flagged with critical risks.</div>
        ) : (
          <div className="table-container" style={{ marginTop: 0 }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Child Name</th>
                  <th>Age (mos)</th>
                  <th>Health Score</th>
                  <th>Mother Edu</th>
                  <th>Critical Risk Factors (Alerts)</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map(r => (
                  <tr key={r._id} style={{ background: 'var(--danger-bg)' }}>
                    <td style={{ fontWeight: 700, color: 'var(--danger-text)' }}>{r.childInfo.name}</td>
                    <td>{r.childInfo.ageMonths}</td>
                    <td>
                      <span className="badge badge-danger text-lg">{r.healthMetrics.healthScore}</span>
                    </td>
                    <td>{r.maternalInfluence.motherEducation}</td>
                    <td>
                      <ul style={{ paddingLeft: '1.2rem', color: 'var(--danger)', fontSize: '0.9rem', margin: 0 }}>
                        {r.healthMetrics.alertReasons.map((reason, i) => (
                          <li key={i} style={{ marginBottom: '0.25rem' }}>{reason}</li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <button 
                         onClick={() => setSelectedCase(r)} 
                         className="btn btn-danger-outline" 
                         style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', background: '#fff' }}
                      >
                         Review Case
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCase && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '500px', background: 'var(--surface)', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: 'var(--danger-text)', fontSize: '1.5rem', fontWeight: 800 }}>Case Review: {selectedCase.childInfo.name}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem', background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: '16px' }}>
               <div>
                  <p className="stat-label">Age</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedCase.childInfo.ageMonths} months</p>
               </div>
               <div>
                  <p className="stat-label">BMI</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedCase.childInfo.bmi || 'N/A'}</p>
               </div>
               <div>
                  <p className="stat-label">Mother's Education</p>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>{selectedCase.maternalInfluence.motherEducation}</p>
               </div>
               <div>
                  <p className="stat-label">Health Score</p>
                  <p style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '1.25rem' }}>{selectedCase.healthMetrics.healthScore}/100</p>
               </div>
            </div>

            <h4 style={{ marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 700 }}>Diagnostic Flags:</h4>
            <ul style={{ paddingLeft: '1.5rem', color: 'var(--danger-text)', fontSize: '0.95rem', marginBottom: '2.5rem', background: 'var(--danger-bg)', padding: '1rem 1rem 1rem 2.5rem', borderRadius: '12px' }}>
              {selectedCase.healthMetrics.alertReasons.map((r, i) => <li key={i} style={{ marginBottom: '0.5rem', fontWeight: 500 }}>{r}</li>)}
            </ul>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button onClick={() => setSelectedCase(null)} className="btn" style={{ border: '2px solid var(--border)' }}>Cancel</button>
              <button 
                 onClick={handleInitiateFollowUp} 
                 className="btn btn-primary" 
                 style={{ background: 'var(--danger)', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)' }}
              >
                 Initiate Medical Follow-up
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;
