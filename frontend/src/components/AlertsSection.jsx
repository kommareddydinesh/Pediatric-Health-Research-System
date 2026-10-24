import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle } from 'lucide-react';

const AlertsSection = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('/records/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error('Error fetching alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="alert-box" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div className="spinner" style={{ width: '30px', height: '30px', borderTopColor: 'var(--danger)' }}></div>
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="glass-card" style={{ background: 'var(--success-bg)', borderColor: 'rgba(16, 185, 129, 0.2)', textAlign: 'center' }}>
        <p style={{ color: 'var(--success-text)', fontWeight: 600 }}>No critical health alerts at this time.</p>
      </div>
    );
  }

  return (
    <div className="alert-box">
      <div className="alert-header">
        <AlertTriangle color="var(--danger)" size={20} />
        <h3>Active Health Alerts</h3>
        <span className="alert-badge">
          {alerts.length} Flagged
        </span>
      </div>
      <ul className="alert-list">
        {alerts.map(record => (
          <li key={record._id} className="alert-item">
            <div className="alert-item-header">
              <span className="alert-item-name">{record.childInfo.name}</span>
              <span className="alert-item-age">{record.childInfo.ageMonths} months old</span>
            </div>
            <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {record.healthMetrics.alertReasons.map((reason, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', color: 'var(--danger)', fontSize: '0.85rem' }}>
                  <span style={{ marginRight: '0.5rem' }}>•</span>
                  <span>{reason}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Mother's Education: <strong style={{ color: 'var(--text-main)' }}>{record.maternalInfluence['mother एजुकेशन'] || record.maternalInfluence.motherEducation}</strong>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AlertsSection;
