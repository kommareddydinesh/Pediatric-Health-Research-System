import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import AlertsSection from '../components/AlertsSection';
import InsightsPanel from '../components/InsightsPanel';
import RecordsTable from '../components/RecordsTable';
import { Users, Activity, ShieldCheck, HeartPulse } from 'lucide-react';

const Dashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/analytics');
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getHealthStatusPieData = () => {
    if (!analyticsData) return [];
    
    let good = 0, mod = 0, poor = 0;
    analyticsData.data.forEach(d => {
      good += d.healthStatusDistribution?.Good || 0;
      mod += d.healthStatusDistribution?.Moderate || 0;
      poor += d.healthStatusDistribution?.Poor || 0;
    });

    return [
      { name: 'Good', value: good, color: '#10B981' }, 
      { name: 'Moderate', value: mod, color: '#F59E0B' }, 
      { name: 'Poor', value: poor, color: '#EF4444' } 
    ];
  };

  const pieData = getHealthStatusPieData();
  const totalRecords = pieData.reduce((acc, curr) => acc + curr.value, 0);
  
  const avgTotalScore = analyticsData && totalRecords > 0 
    ? Math.round(analyticsData.data.reduce((acc, curr) => acc + (curr.avgHealthScore * curr.count), 0) / totalRecords)
    : 0;

  if (loading) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1 className="page-title">Pediatric Analytics</h1>
        <p className="page-subtitle">Impact of Maternal Education on Child Health Outcomes</p>
      </div>

      <div className="stats-row">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper blue">
            <Users size={24} />
          </div>
          <div>
            <p className="stat-label">Total Records</p>
            <p className="stat-value">{totalRecords}</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper green">
            <Activity size={24} />
          </div>
          <div>
            <p className="stat-label">Avg Health Score</p>
            <p className="stat-value">{avgTotalScore}/100</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper purple">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="stat-label">Fully Vaccinated</p>
            <p className="stat-value">
               {analyticsData && Math.round(
                 (analyticsData.data.reduce((acc, curr) => acc + (curr.vaxRate * curr.count / 100), 0) / totalRecords) * 100
               ) || 0}%
            </p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper red">
            <HeartPulse size={24} />
          </div>
          <div>
            <p className="stat-label">Avg Illness/Yr</p>
            <p className="stat-value">
               {analyticsData && totalRecords > 0 
                  ? (analyticsData.data.reduce((acc, curr) => acc + (curr.avgIllnessFrequency * curr.count), 0) / totalRecords).toFixed(1)
                  : 0}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card">
            <h3 className="section-title">Health Score & Vaccination by Education</h3>
            <div style={{ height: '320px', width: '100%' }}>
              {analyticsData && analyticsData.data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis dataKey="education" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                    <YAxis yAxisId="left" orientation="left" stroke="var(--secondary)" axisLine={false} tickLine={false} domain={[0, 100]} />
                    <YAxis yAxisId="right" orientation="right" stroke="var(--success)" axisLine={false} tickLine={false} domain={[0, 100]} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }}
                      cursor={{ fill: 'var(--surface-hover)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    <Bar yAxisId="left" dataKey="avgHealthScore" name="Avg Health Score (0-100)" fill="var(--secondary)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                    <Bar yAxisId="right" dataKey="vaxRate" name="Vaccination Rate (%)" fill="var(--success)" radius={[6, 6, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-light)' }}>No data available</div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '2rem' }}>
            <div className="glass-card">
              <h3 className="section-title" style={{ marginBottom: '0.5rem' }}>Overall Health Status</h3>
              <div style={{ height: '260px', width: '100%' }}>
                 <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ height: '100%' }}>
              <InsightsPanel insights={analyticsData?.insights} />
            </div>
          </div>
        </div>

        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <AlertsSection />
        </div>
      </div>

      <RecordsTable limit={6} showViewAll={true} />
    </div>
  );
};

export default Dashboard;
