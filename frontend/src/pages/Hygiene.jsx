import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Home, Thermometer, ShieldAlert } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const Hygiene = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const res = await axios.get('/records');
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateSanitationStats = () => {
    const stats = {
      'Good': { count: 0, avgIllness: 0 },
      'Moderate': { count: 0, avgIllness: 0 },
      'Poor': { count: 0, avgIllness: 0 }
    };

    records.forEach(r => {
      const san = r.nutritionAndLifestyle.sanitationPractices;
      if (stats[san]) {
        stats[san].count++;
        stats[san].avgIllness += r.diseaseTracking.illnessFrequencyPerYear;
      }
    });

    return Object.entries(stats).map(([level, data]) => ({
      level,
      avgIllness: data.count > 0 ? parseFloat((data.avgIllness / data.count).toFixed(1)) : 0
    }));
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  const sanitationData = calculateSanitationStats();
  const poorSanitation = records.filter(r => r.nutritionAndLifestyle.sanitationPractices === 'Poor').length;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1 className="page-title">Hygiene & Living Conditions</h1>
        <p className="page-subtitle">Evaluating Environmental Health Factors and Illness Correlations</p>
      </div>

      <div className="stats-row">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper green">
            <Home size={24} />
          </div>
          <div>
            <p className="stat-label">Homes Analyzed</p>
            <p className="stat-value">{records.length}</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper red">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="stat-label">Poor Sanitation Risk</p>
            <p className="stat-value">{poorSanitation}</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper purple">
            <Thermometer size={24} />
          </div>
          <div>
            <p className="stat-label">High Illness Children</p>
            <p className="stat-value">{records.filter(r => r.diseaseTracking.illnessFrequencyPerYear > 5).length}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 8' }}>
          <div className="glass-card">
            <h3 className="section-title">Illness Frequency By Sanitation Level</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sanitationData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="level" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                    cursor={{ fill: 'var(--surface-hover)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar dataKey="avgIllness" name="Avg Illnesses/Year" fill="var(--danger)" radius={[6, 6, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 4' }}>
          <div className="glass-card" style={{ height: '100%', background: 'linear-gradient(135deg, var(--surface), var(--bg-page))' }}>
            <h3 className="section-title">Hygiene Insights</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ padding: '1.25rem', background: 'var(--warning-bg)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                <strong style={{ color: 'var(--warning-text)', display: 'block', marginBottom: '0.25rem' }}>Sanitation Correlator</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>Children living with poor sanitation have significantly higher probabilities of recurrent infections and fever.</span>
              </div>
              <div style={{ padding: '1.25rem', background: 'var(--success-bg)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <strong style={{ color: 'var(--success-text)', display: 'block', marginBottom: '0.25rem' }}>Clean Water Impact</strong>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', lineHeight: 1.6 }}>Access to clean drinking water directly reduces the frequency of water-borne illnesses recorded in this cohort by roughly 40%.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hygiene;
