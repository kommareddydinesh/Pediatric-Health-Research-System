import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BookOpen, Users, Brain, Heart } from 'lucide-react';

const MothersProfile = () => {
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

  const calculateAverages = () => {
    const stats = {
      'No Schooling': { count: 0, score: 0 },
      'Primary': { count: 0, score: 0 },
      'Secondary': { count: 0, score: 0 },
      'Higher': { count: 0, score: 0 }
    };
    records.forEach(r => {
      const edu = r.maternalInfluence.motherEducation;
      if (stats[edu]) {
        stats[edu].count++;
        stats[edu].score += r.healthMetrics.healthScore;
      }
    });
    return Object.entries(stats).map(([level, data]) => ({
      level,
      count: data.count,
      avgScore: data.count > 0 ? Math.round(data.score / data.count) : 0
    }));
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  const eduStats = calculateAverages();
  const decisionMakers = records.filter(r => r.maternalInfluence.decisionMakingRole).length;
  const avgKnowledge = records.reduce((acc, curr) => acc + curr.maternalInfluence.knowledgeScore, 0) / (records.length || 1);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1 className="page-title">Mother Profile Analysis</h1>
        <p className="page-subtitle">Impact of Maternal Education & Background on Child Health</p>
      </div>

      <div className="stats-row">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper purple">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="stat-label">Total Mothers</p>
            <p className="stat-value">{records.length}</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper blue">
            <Brain size={24} />
          </div>
          <div>
            <p className="stat-label">Avg Knowledge Score</p>
            <p className="stat-value">{Math.round(avgKnowledge)}/100</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper green">
            <Users size={24} />
          </div>
          <div>
            <p className="stat-label">Decision Makers</p>
            <p className="stat-value">{decisionMakers} <span style={{fontSize: '1rem', fontWeight: 'normal', color: 'var(--text-muted)'}}>({Math.round(decisionMakers/(records.length||1)*100)}%)</span></p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 12' }}>
          <div className="glass-card">
            <h3 className="section-title">Education Level Breakdown vs Health Score</h3>
            <div className="table-container" style={{ marginTop: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Education Level</th>
                    <th>Number of Mothers</th>
                    <th>Average Child Health Score</th>
                    <th>Health Impact Correlator</th>
                  </tr>
                </thead>
                <tbody>
                  {eduStats.map(stat => (
                    <tr key={stat.level}>
                      <td style={{ fontWeight: 600 }}>{stat.level}</td>
                      <td>{stat.count} records</td>
                      <td>{stat.avgScore}/100</td>
                      <td>
                        <div className="progress-wrapper">
                          <div className="progress-track" style={{ width: '120px' }}>
                            <div className="progress-fill" style={{ width: `${stat.avgScore}%`, background: 'var(--primary)' }}></div>
                          </div>
                          <span>{stat.avgScore}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 12' }}>
          <div className="glass-card">
            <h3 className="section-title">Detailed Maternal Profiles Database</h3>
            <div className="table-container" style={{ marginTop: 0 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Mother's Education</th>
                    <th>Health Awareness</th>
                    <th>Decision-making Role</th>
                    <th>Knowledge Score</th>
                    <th>Child Health</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600 }}>{r.childInfo.name}</td>
                      <td><span className="badge badge-warning">{r.maternalInfluence.motherEducation}</span></td>
                      <td>{r.maternalInfluence.healthAwarenessLevel}</td>
                      <td>{r.maternalInfluence.decisionMakingRole ? 'Yes' : 'No'}</td>
                      <td>{r.maternalInfluence.knowledgeScore}/100</td>
                      <td>
                        <span className={`badge ${r.healthMetrics.healthStatus === 'Good' ? 'badge-success' : r.healthMetrics.healthStatus === 'Moderate' ? 'badge-warning' : 'badge-danger'}`}>
                          {r.healthMetrics.healthStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MothersProfile;
