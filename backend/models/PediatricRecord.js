const mongoose = require('mongoose');

const PediatricRecordSchema = new mongoose.Schema({
  childInfo: {
    name: String,
    ageMonths: { type: Number, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    weightKg: { type: Number, required: true },
    heightCm: { type: Number, required: true },
    bmi: { type: Number } // Auto calculated on input
  },
  immunization: {
    bcg: { type: Boolean, default: false },
    polio: { type: Boolean, default: false },
    dpt: { type: Boolean, default: false },
    measles: { type: Boolean, default: false },
    completenessStatus: { type: String } // 'Complete', 'Partial', 'None'
  },
  diseaseTracking: {
    recentIllnesses: [{ type: String }], // 'Fever', 'Diarrhea', 'Cold' etc
    illnessFrequencyPerYear: { type: Number, default: 0 }
  },
  maternalInfluence: {
    motherEducation: { 
      type: String, 
      enum: ['No Schooling', 'Primary', 'Secondary', 'Higher'], 
      required: true 
    },
    healthAwarenessLevel: { 
      type: String, 
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium'
    },
    decisionMakingRole: { type: Boolean, default: true }, // true if mother is the primary decision maker
    knowledgeScore: { type: Number, default: 50 }, // Out of 100 based on some questionnaire
  },
  nutritionAndLifestyle: {
    dietType: { type: String, enum: ['Balanced', 'Malnourished', 'Junk-heavy'], required: true },
    breastfeedingHistoryMonths: { type: Number, default: 0 },
    cleanWaterAccess: { type: Boolean, default: false },
    sanitationPractices: { type: String, enum: ['Good', 'Moderate', 'Poor'], default: 'Moderate' },
    physicalActivityHoursPerDay: { type: Number, default: 1 }
  },
  healthMetrics: {
    healthScore: { type: Number }, // 0 - 100
    healthStatus: { type: String, enum: ['Good', 'Moderate', 'Poor'] },
    isFlagged: { type: Boolean, default: false },
    alertReasons: [{ type: String }]
  },
  recordedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// Pre-save hook to calculate BMI and Health Score
PediatricRecordSchema.pre('save', function() {
  // 1. BMI Calculation (Weight in kg / (Height in m)^2)
  const heightM = this.childInfo.heightCm / 100;
  if(heightM > 0) {
     this.childInfo.bmi = parseFloat((this.childInfo.weightKg / (heightM * heightM)).toFixed(2));
  }

  // 2. Immunization Status
  let vaccines = [this.immunization.bcg, this.immunization.polio, this.immunization.dpt, this.immunization.measles];
  let vaxCount = vaccines.filter(Boolean).length;
  if (vaxCount === 4) this.immunization.completenessStatus = 'Complete';
  else if (vaxCount > 0) this.immunization.completenessStatus = 'Partial';
  else this.immunization.completenessStatus = 'None';

  let vaxScore = (vaxCount / 4) * 25; // 25 points max

  // 3. Nutrition Score (25 pts max)
  let nutScore = 0;
  if(this.nutritionAndLifestyle.dietType === 'Balanced') nutScore += 15;
  if(this.nutritionAndLifestyle.dietType === 'Junk-heavy') nutScore += 5;
  if(this.nutritionAndLifestyle.breastfeedingHistoryMonths >= 6) nutScore += 5;
  if(this.nutritionAndLifestyle.cleanWaterAccess) nutScore += 5;
  
  nutScore = Math.min(25, nutScore);

  // 4. Hygiene / Awareness Score (25 pts max)
  let hygScore = 0;
  if(this.maternalInfluence.healthAwarenessLevel === 'High') hygScore += 15;
  if(this.maternalInfluence.healthAwarenessLevel === 'Medium') hygScore += 7;
  if(this.nutritionAndLifestyle.sanitationPractices === 'Good') hygScore += 10;
  if(this.nutritionAndLifestyle.sanitationPractices === 'Moderate') hygScore += 5;
  
  hygScore = Math.min(25, hygScore);

  // 5. Illness Score (25 pts max - lower frequency = higher score)
  let illnessScore = 25 - (this.diseaseTracking.illnessFrequencyPerYear * 5);
  if(illnessScore < 0) illnessScore = 0;

  this.healthMetrics.healthScore = Math.round(vaxScore + nutScore + hygScore + illnessScore);

  // Status mapping
  if (this.healthMetrics.healthScore >= 75) this.healthMetrics.healthStatus = 'Good';
  else if (this.healthMetrics.healthScore >= 50) this.healthMetrics.healthStatus = 'Moderate';
  else this.healthMetrics.healthStatus = 'Poor';

  // Alerts logic (Simplified BMI threshold and vax check)
  this.healthMetrics.alertReasons = [];
  this.healthMetrics.isFlagged = false;

  // Simple BMI check for underweight (highly simplified threshold for demonstration)
  // For ages under 5, simplified threshold
  if (this.childInfo.bmi < 14) {
    this.healthMetrics.alertReasons.push(`Low BMI (${this.childInfo.bmi}) indicating severe underweight.`);
  }

  if (vaxCount < 2 && this.childInfo.ageMonths > 12) {
    this.healthMetrics.alertReasons.push(`Incomplete vaccination for age > 1 yr.`);
  }

  if (this.diseaseTracking.illnessFrequencyPerYear > 5) {
     this.healthMetrics.alertReasons.push(`High illness frequency (>5/yr).`);
  }

  if (this.healthMetrics.alertReasons.length > 0) {
    this.healthMetrics.isFlagged = true;
  }
});

module.exports = mongoose.model('PediatricRecord', PediatricRecordSchema);
