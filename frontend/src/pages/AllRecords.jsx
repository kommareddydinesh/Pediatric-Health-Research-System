import React from 'react';
import RecordsTable from '../components/RecordsTable';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AllRecords = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '3rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={20} color="var(--text-main)" />
        </button>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Full Pediatric Database</h1>
          <p className="page-subtitle">Complete un-filtered ledger of all collected case studies.</p>
        </div>
      </div>

      {/* Render full table without limits */}
      <RecordsTable limit={null} showViewAll={false} />
    </div>
  );
};

export default AllRecords;
