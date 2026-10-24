import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Printer, FileText, Download, LayoutTemplate } from 'lucide-react';

const Reports = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState('comprehensive');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('/analytics');
      setAnalyticsData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const reportConfig = {
    comprehensive: {
      title: 'Comprehensive Research Summary',
      subtitle: 'The Role of Mothers\' Education in Child Health Outcomes',
      execSummary: 'This pedagogical research evaluates the direct and indirect correlations between maternal educational attainment and pediatric health indices. The metrics collected consist of immunization completeness, nutritional balance, illness frequency, and sanitation practices. The data strongly suggests that elevated levels of maternal education directly correlate with improved health scores and lower malnourishment rates in children.',
    },
    nutrition: {
      title: 'Nutritional Assessment Report',
      subtitle: 'Dietary Habits & Malnutrition Risks',
      execSummary: 'This specialized report focuses primarily on the dietary habits, breastfeeding history, and resultant BMI profiles of the pediatric cohort. The analysis specifically highlights how different levels of maternal education influence choices between balanced diets, junk-heavy dependencies, and malnourishment outcomes.',
    },
    immunization: {
      title: 'Immunization Compliance Ledger',
      subtitle: 'Vaccination vs. Illness Frequency Tracking',
      execSummary: 'This analytical document extracts the relationship between vaccination compliance rates (BCG, Polio, DPT, Measles) and the frequency of recorded generic pediatric illnesses per year. The correlations track whether maternal health awareness fundamentally improves immunological outcomes in the tested localities.',
    }
  };

  if (loading) return <div className="loader-container"><div className="spinner"></div></div>;

  const currentReport = reportConfig[reportType];

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <div className="page-header no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title">Research Reports & Export</h1>
          <p className="page-subtitle">Configure dynamically and export to PDF</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', background: 'var(--surface)', padding: '0.5rem', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setReportType('comprehensive')} 
              className="btn" 
              style={{ background: reportType === 'comprehensive' ? 'var(--primary-light)' : 'transparent', color: reportType === 'comprehensive' ? 'var(--primary-dark)' : 'var(--text-muted)', boxShadow: 'none' }}>
              Comprehensive
            </button>
            <button 
              onClick={() => setReportType('nutrition')} 
              className="btn" 
              style={{ background: reportType === 'nutrition' ? 'var(--primary-light)' : 'transparent', color: reportType === 'nutrition' ? 'var(--primary-dark)' : 'var(--text-muted)', boxShadow: 'none' }}>
              Nutrition
            </button>
            <button 
              onClick={() => setReportType('immunization')} 
              className="btn" 
              style={{ background: reportType === 'immunization' ? 'var(--primary-light)' : 'transparent', color: reportType === 'immunization' ? 'var(--primary-dark)' : 'var(--text-muted)', boxShadow: 'none' }}>
              Immunization
            </button>
          </div>

          <button onClick={handlePrint} className="btn btn-primary" style={{ gap: '0.5rem' }}>
            <Printer size={18} />
            Export Document
          </button>
        </div>
      </div>

      {/* Printable A4 Report Container */}
      <div className="print-container glass-card" style={{ background: '#fff', border: '1px solid #e2e8f0', margin: '0 auto', maxWidth: '800px', padding: '3rem 4rem', animation: 'fadeIn 0.5s ease-out' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem', borderBottom: '2px solid var(--text-main)', paddingBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', color: 'var(--primary)' }}>
            <FileText size={48} />
          </div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-main)', margin: 0, textTransform: 'uppercase', letterSpacing: '1px' }}>{currentReport.title}</h1>
          <h2 style={{ fontSize: '1.1rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '0.5rem' }}>{currentReport.subtitle}</h2>
          <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-light)' }}>Report Generated: {new Date().toLocaleDateString()}</p>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Executive Summary</h3>
          <p style={{ lineHeight: 1.8, color: 'var(--text-main)' }}>
            {currentReport.execSummary}
          </p>
        </div>

        <div style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Data Architecture & Averages</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
            <thead>
              <tr style={{ background: 'var(--surface-hover)', textAlign: 'left' }}>
                <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>Maternal Cohort</th>
                {reportType === 'immunization' ? null : <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>Avg. Health Score</th>}
                {reportType === 'nutrition' ? null : <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>Vaccination Rate</th>}
                {reportType === 'nutrition' ? null : <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>Avg. Illnesses (Yr)</th>}
                {reportType === 'nutrition' ? <th style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>Junk / Malnourished Data</th> : null}
              </tr>
            </thead>
            <tbody>
              {analyticsData && analyticsData.data.map((cohort, i) => (
                <tr key={i}>
                  <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)', fontWeight: 600 }}>{cohort.education}</td>
                  
                  {reportType === 'immunization' ? null : <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>{cohort.avgHealthScore}</td>}
                  {reportType === 'nutrition' ? null : <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>{Math.round(cohort.vaxRate)}%</td>}
                  {reportType === 'nutrition' ? null : <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)' }}>{cohort.avgIllnessFrequency.toFixed(1)}</td>}
                  {reportType === 'nutrition' ? <td style={{ padding: '0.75rem 1rem', border: '1px solid var(--border)', fontStyle: 'italic', color: 'var(--text-muted)' }}>Assessed relative to score</td> : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reportType === 'comprehensive' && (
          <div>
            <h3 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)' }}>Key AI Insights</h3>
            <ul style={{ paddingLeft: '1.5rem', lineHeight: 1.8, color: 'var(--text-main)' }}>
              {analyticsData && analyticsData.insights.map((insight, idx) => (
                <li key={idx} style={{ marginBottom: '0.75rem' }}>{insight}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <p>Official Pediatric Health Documentation</p>
          <p>End of {currentReport.title}</p>
        </div>
      </div>
    </div>
  );
};

export default Reports;
