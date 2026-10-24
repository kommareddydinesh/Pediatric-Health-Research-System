import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Apple, Droplet, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

const Nutrition = () => {
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

  const calculateDietStats = () => {
    const counts = { Balanced: 0, Malnourished: 0, 'Junk-heavy': 0 };
    records.forEach(r => {
      if (counts[r.nutritionAndLifestyle.dietType] !== undefined) {
        counts[r.nutritionAndLifestyle.dietType]++;
      }
    });
    return [
      { name: 'Balanced Diet', value: counts.Balanced, color: '#10B981' },
      { name: 'Malnourished', value: counts.Malnourished, color: '#EF4444' },
      { name: 'Junk-heavy', value: counts['Junk-heavy'], color: '#F59E0B' },
    ].filter(d => d.value > 0);
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  const dietData = calculateDietStats();
  const avgBreastfeeding = records.reduce((acc, curr) => acc + curr.nutritionAndLifestyle.breastfeedingHistoryMonths, 0) / (records.length || 1);
  const avgCleanWater = records.filter(r => r.nutritionAndLifestyle.cleanWaterAccess).length / (records.length || 1) * 100;

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1 className="page-title">Nutrition & Lifestyle Analysis</h1>
        <p className="page-subtitle">Impact of Diet and Feeding Habits on Child Health</p>
      </div>

      <div className="stats-row">
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper green">
            <Apple size={24} />
          </div>
          <div>
            <p className="stat-label">Balanced Diets</p>
            <p className="stat-value">{dietData.find(d => d.name === 'Balanced Diet')?.value || 0}</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper purple">
            <Activity size={24} />
          </div>
          <div>
            <p className="stat-label">Avg Breastfeeding</p>
            <p className="stat-value">{Math.round(avgBreastfeeding * 10)/10} months</p>
          </div>
        </div>
        <div className="glass-card stat-card">
          <div className="stat-icon-wrapper blue">
            <Droplet size={24} />
          </div>
          <div>
            <p className="stat-label">Clean Water Access</p>
            <p className="stat-value">{Math.round(avgCleanWater)}%</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div style={{ gridColumn: 'span 12', display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)', gap: '2rem' }}>
          
          <div className="glass-card">
            <h3 className="section-title">Diet Type Distribution</h3>
            <div style={{ height: '300px', width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dietData}
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={90}
                    paddingAngle={5}
                    dataKey="value" stroke="none"
                  >
                    {dietData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-sm)' }} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card">
            <h3 className="section-title">Detailed Nutrition Ledger</h3>
            <div className="table-container" style={{ marginTop: 0, maxHeight: '300px', overflowY: 'auto' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Child Name</th>
                    <th>Diet Type</th>
                    <th>Breastfed (mo)</th>
                    <th>Clean Water?</th>
                    <th>Malnutrition Risk (BMI)</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map(r => (
                    <tr key={r._id}>
                      <td style={{ fontWeight: 600 }}>{r.childInfo.name}</td>
                      <td>
                        <span className={`badge ${r.nutritionAndLifestyle.dietType === 'Balanced' ? 'badge-success' : r.nutritionAndLifestyle.dietType === 'Malnourished' ? 'badge-danger' : 'badge-warning'}`}>
                          {r.nutritionAndLifestyle.dietType}
                        </span>
                      </td>
                      <td>{r.nutritionAndLifestyle.breastfeedingHistoryMonths} mo</td>
                      <td>{r.nutritionAndLifestyle.cleanWaterAccess ? 'Yes' : 'No'}</td>
                      <td>
                        {r.childInfo.bmi ? (
                          <span style={{ color: r.childInfo.bmi < 15 ? 'var(--danger)' : 'var(--text-main)', fontWeight: r.childInfo.bmi < 15 ? 700 : 400 }}>
                            {r.childInfo.bmi} {r.childInfo.bmi < 15 && '(Risk)'}
                          </span>
                        ) : 'N/A'}
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

export default Nutrition;
