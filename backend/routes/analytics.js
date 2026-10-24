const express = require('express');
const router = express.Router();
const PediatricRecord = require('../models/PediatricRecord');
const auth = require('../middleware/authMiddleware');

// @route   GET api/analytics
// @desc    Get aggregated research data
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const educationLevels = ['No Schooling', 'Primary', 'Secondary', 'Higher'];
    
    const analytics = await Promise.all(educationLevels.map(async (level) => {
      const records = await PediatricRecord.find({ 'maternalInfluence.motherEducation': level });
      
      const count = records.length;
      if (count === 0) return { education: level, count: 0 };

      // Calculate averages and percentages
      const avgHealthScore = records.reduce((acc, r) => acc + (r.healthMetrics.healthScore || 0), 0) / count;
      const fullyVaccinated = records.filter(r => r.immunization.completenessStatus === 'Complete').length;
      const vaxRate = (fullyVaccinated / count) * 100;
      
      const totalIllnesses = records.reduce((acc, r) => acc + (r.diseaseTracking.illnessFrequencyPerYear || 0), 0);
      const avgIllnessFrequency = totalIllnesses / count;

      // Group by health status
      const goodStatus = records.filter(r => r.healthMetrics.healthStatus === 'Good').length;
      const modStatus = records.filter(r => r.healthMetrics.healthStatus === 'Moderate').length;
      const poorStatus = records.filter(r => r.healthMetrics.healthStatus === 'Poor').length;

      return {
        education: level,
        count,
        avgHealthScore: Math.round(avgHealthScore),
        vaxRate: Math.round(vaxRate),
        avgIllnessFrequency: parseFloat(avgIllnessFrequency.toFixed(1)),
        healthStatusDistribution: {
           Good: goodStatus,
           Moderate: modStatus,
           Poor: poorStatus
        }
      };
    }));

    // Generate specific insights based on the aggregated data
    const insights = generateInsights(analytics);

    res.json({ data: analytics, insights });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

function generateInsights(data) {
    const insights = [];
    const validData = data.filter(d => d.count > 0);
    
    if(validData.length === 0) return ["No data available yet to generate insights."];

    const higherEd = validData.find(d => d.education === 'Higher' || d.education === 'Secondary');
    const lowerEd = validData.find(d => d.education === 'No Schooling' || d.education === 'Primary');

    if (higherEd && lowerEd) {
        if (higherEd.vaxRate > lowerEd.vaxRate) {
            insights.push(`Children of mothers with ${higherEd.education} education show a ${(higherEd.vaxRate - lowerEd.vaxRate).toFixed(0)}% higher vaccination completeness compared to those with ${lowerEd.education}.`);
        }
        
        if (higherEd.avgIllnessFrequency < lowerEd.avgIllnessFrequency) {
            insights.push(`Lower maternal education correlates with higher illness frequency. (${lowerEd.avgIllnessFrequency} vs ${higherEd.avgIllnessFrequency} times/year).`);
        }

        if (higherEd.avgHealthScore > lowerEd.avgHealthScore) {
            insights.push(`Maternal education is strongly associated with overall child health outcomes, displaying an average score increase of ${higherEd.avgHealthScore - lowerEd.avgHealthScore} points for higher education levels.`);
        }
    }
    
    if(insights.length === 0) insights.push("Collect more varied data to unlock deeper insights.");

    return insights;
}

module.exports = router;
