import React from 'react';
import { Lightbulb } from 'lucide-react';

const InsightsPanel = ({ insights }) => {
  return (
    <div className="insights-panel">
      <div className="insights-header">
        <Lightbulb color="#FCD34D" size={24} />
        <h3>AI Research Insights</h3>
      </div>
      <div className="insights-list">
        {insights && insights.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {insights.map((insight, index) => (
              <li key={index} className="insight-card">
                <strong>Observation {index + 1}</strong>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.6)' }}>
            <p>Gathering enough data to generate insights...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsPanel;
