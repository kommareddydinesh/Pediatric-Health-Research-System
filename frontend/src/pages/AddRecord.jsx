import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Calculator } from 'lucide-react';

const AddRecord = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    childInfo: {
      name: '',
      ageMonths: '',
      gender: 'Male',
      weightKg: '',
      heightCm: '',
    },
    immunization: {
      bcg: false,
      polio: false,
      dpt: false,
      measles: false,
    },
    diseaseTracking: {
      recentIllnesses: '', 
      illnessFrequencyPerYear: 0,
    },
    maternalInfluence: {
      motherEducation: 'Primary',
      healthAwarenessLevel: 'Medium',
      decisionMakingRole: true,
      knowledgeScore: 50,
    },
    nutritionAndLifestyle: {
      dietType: 'Balanced',
      breastfeedingHistoryMonths: 0,
      cleanWaterAccess: true,
      sanitationPractices: 'Moderate',
      physicalActivityHoursPerDay: 1,
    }
  });

  const [calcBmi, setCalcBmi] = useState(null);

  const calculateBMI = (weight, height) => {
    if (weight > 0 && height > 0) {
      const heightM = height / 100;
      return (weight / (heightM * heightM)).toFixed(2);
    }
    return null;
  };

  const handleChildInfoChange = (e) => {
    const { name, value } = e.target;
    const newChildInfo = { ...formData.childInfo, [name]: value };
    
    setFormData({ ...formData, childInfo: newChildInfo });

    if (name === 'weightKg' || name === 'heightCm') {
       const w = name === 'weightKg' ? value : formData.childInfo.weightKg;
       const h = name === 'heightCm' ? value : formData.childInfo.heightCm;
       setCalcBmi(calculateBMI(w, h));
    }
  };

  const handleNestedChange = (category, field, value) => {
    setFormData({
      ...formData,
      [category]: {
        ...formData[category],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const processData = JSON.parse(JSON.stringify(formData));
      processData.diseaseTracking.recentIllnesses = processData.diseaseTracking.recentIllnesses
        .split(',')
        .map(i => i.trim())
        .filter(i => i !== '');

      await axios.post('/records', processData);
      navigate('/');
    } catch (err) {
      console.error(err);
      setToastMessage('Error saving record. Please check the connection.');
      setTimeout(() => setToastMessage(''), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', paddingBottom: '3rem' }}>
      
      {toastMessage && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999, background: 'var(--surface)', border: '1px solid var(--danger)', borderLeft: '4px solid var(--danger)', borderRadius: '12px', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.3s ease-out forwards' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{toastMessage}</span>
        </div>
      )}

      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ background: 'transparent', border: '1px solid var(--border)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'var(--transition)' }}
          onMouseOver={(e) => e.currentTarget.style.background = 'var(--surface-hover)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={20} color="var(--text-main)" />
        </button>
        <div>
          <h1 className="page-title" style={{ fontSize: '1.75rem' }}>Add Pediatric Record</h1>
          <p className="page-subtitle">Enter comprehensive data for research analysis</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="form-card">
        
        {/* Basic Info */}
        <div className="form-section">
          <h2 className="form-section-title">1. Child Demographics & Anthropometry</h2>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Child Name</label>
              <input type="text" name="name" required
                className="form-control"
                value={formData.childInfo.name} onChange={handleChildInfoChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Age (Months)</label>
              <input type="number" name="ageMonths" required
                className="form-control"
                value={formData.childInfo.ageMonths} onChange={handleChildInfoChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Gender</label>
              <select name="gender" required
                className="form-control"
                value={formData.childInfo.gender} onChange={handleChildInfoChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid-cols-2" style={{ display: 'grid', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Weight (kg)</label>
                <input type="number" step="0.1" name="weightKg" required
                  className="form-control"
                  value={formData.childInfo.weightKg} onChange={handleChildInfoChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Height (cm)</label>
                <input type="number" step="0.1" name="heightCm" required
                  className="form-control"
                  value={formData.childInfo.heightCm} onChange={handleChildInfoChange} />
              </div>
            </div>
          </div>
          {calcBmi && (
            <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', background: 'var(--primary-light)', color: 'var(--primary-dark)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 500 }}>
              <Calculator size={16} />
              Auto-calculated BMI: <span style={{ fontWeight: 800 }}>{calcBmi}</span>
            </div>
          )}
        </div>

        {/* Immunization & Disease */}
        <div className="form-section" style={{ background: 'var(--surface-hover)' }}>
          <h2 className="form-section-title">2. Immunization & Health History</h2>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Vaccines Received</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', padding: '1rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px' }}>
                {['bcg', 'polio', 'dpt', 'measles'].map(vax => (
                  <label key={vax} className="checkbox-label" style={{ textTransform: 'capitalize' }}>
                    <input type="checkbox" className="checkbox-input"
                      checked={formData.immunization[vax]}
                      onChange={(e) => handleNestedChange('immunization', vax, e.target.checked)} />
                    {vax}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
               <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Illness Frequency (per year)</label>
                  <input type="number" required
                    className="form-control"
                    value={formData.diseaseTracking.illnessFrequencyPerYear} 
                    onChange={(e) => handleNestedChange('diseaseTracking', 'illnessFrequencyPerYear', Number(e.target.value))} />
               </div>
               <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Recent Illnesses</label>
                  <input type="text" placeholder="E.g., Fever, Cold"
                    className="form-control"
                    value={formData.diseaseTracking.recentIllnesses} 
                    onChange={(e) => handleNestedChange('diseaseTracking', 'recentIllnesses', e.target.value)} />
               </div>
            </div>
          </div>
        </div>

        {/* Maternal Influence */}
        <div className="form-section">
          <h2 className="form-section-title">3. Maternal Influence (Core Research Metric)</h2>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">Mother's Education Level</label>
              <select required
                className="form-control" style={{ fontWeight: 600 }}
                value={formData.maternalInfluence.motherEducation} 
                onChange={(e) => handleNestedChange('maternalInfluence', 'motherEducation', e.target.value)}>
                <option value="No Schooling">No Schooling</option>
                <option value="Primary">Primary</option>
                <option value="Secondary">Secondary</option>
                <option value="Higher">Higher</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Health Awareness Level</label>
              <select required
                className="form-control"
                value={formData.maternalInfluence.healthAwarenessLevel} 
                onChange={(e) => handleNestedChange('maternalInfluence', 'healthAwarenessLevel', e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div className="form-group col-span-2" style={{ marginBottom: '0.5rem' }}>
              <label className="form-label">Decision-making Role</label>
              <label className="checkbox-label">
                <input type="checkbox" className="checkbox-input"
                  checked={formData.maternalInfluence.decisionMakingRole}
                  onChange={(e) => handleNestedChange('maternalInfluence', 'decisionMakingRole', e.target.checked)} />
                Is primary healthcare decision maker
              </label>
            </div>
            <div className="form-group col-span-2">
              <label className="form-label">Health Knowledge Score (0-100)</label>
              <input type="number" required min="0" max="100"
                className="form-control"
                value={formData.maternalInfluence.knowledgeScore} 
                onChange={(e) => handleNestedChange('maternalInfluence', 'knowledgeScore', Number(e.target.value))} />
            </div>
          </div>
        </div>

        {/* Nutrition & Lifestyle */}
        <div className="form-section" style={{ background: 'var(--surface-hover)', borderBottom: 'none' }}>
          <h2 className="form-section-title">4. Nutrition & Lifestyle</h2>
          <div className="grid-cols-3">
            <div className="form-group">
              <label className="form-label">Diet Type</label>
              <select required
                className="form-control"
                value={formData.nutritionAndLifestyle.dietType} 
                onChange={(e) => handleNestedChange('nutritionAndLifestyle', 'dietType', e.target.value)}>
                <option value="Balanced">Balanced</option>
                <option value="Malnourished">Malnourished</option>
                <option value="Junk-heavy">Junk-heavy</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Sanitation Practices</label>
              <select required
                className="form-control"
                value={formData.nutritionAndLifestyle.sanitationPractices} 
                onChange={(e) => handleNestedChange('nutritionAndLifestyle', 'sanitationPractices', e.target.value)}>
                <option value="Good">Good</option>
                <option value="Moderate">Moderate</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Breastfeeding (Months)</label>
              <input type="number" required
                className="form-control"
                value={formData.nutritionAndLifestyle.breastfeedingHistoryMonths} 
                onChange={(e) => handleNestedChange('nutritionAndLifestyle', 'breastfeedingHistoryMonths', Number(e.target.value))} />
            </div>
            <div className="col-span-3">
               <label className="checkbox-label" style={{ padding: '0.5rem 0' }}>
                 <input type="checkbox" className="checkbox-input"
                   checked={formData.nutritionAndLifestyle.cleanWaterAccess}
                   onChange={(e) => handleNestedChange('nutritionAndLifestyle', 'cleanWaterAccess', e.target.checked)} />
                 Has access to clean drinking water
               </label>
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn"
            style={{ fontWeight: 600, color: 'var(--text-muted)' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : <><Save size={18} /> Save Record & Calculate Score</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRecord;
