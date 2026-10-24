const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const PediatricRecord = require('./models/PediatricRecord');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pediatric_health');
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();

    try {
        await User.deleteMany();
        await PediatricRecord.deleteMany();

        console.log('Cleared existing data.');

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Admin@123', salt);

        const admin = new User({
            name: 'User',
            email: 'admin@greennetspark.in',
            password: hashedPassword,
            role: 'Researcher'
        });

        await admin.save();
        console.log('Admin user created: admin@greennetspark.in / Admin@123');

        const sampleRecords = [
            // HIGH EDUCATION, GOOD CONDITIONS
            {
                childInfo: { name: 'Aarav', ageMonths: 24, gender: 'Male', weightKg: 12.5, heightCm: 88 },
                immunization: { bcg: true, polio: true, dpt: true, measles: true },
                diseaseTracking: { recentIllnesses: ['Cold'], illnessFrequencyPerYear: 1 },
                maternalInfluence: { motherEducation: 'Higher', healthAwarenessLevel: 'High', decisionMakingRole: true, knowledgeScore: 92 },
                nutritionAndLifestyle: { dietType: 'Balanced', breastfeedingHistoryMonths: 14, cleanWaterAccess: true, sanitationPractices: 'Good', physicalActivityHoursPerDay: 3 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Sneha', ageMonths: 48, gender: 'Female', weightKg: 16.2, heightCm: 104 },
                immunization: { bcg: true, polio: true, dpt: true, measles: true },
                diseaseTracking: { recentIllnesses: [], illnessFrequencyPerYear: 0 },
                maternalInfluence: { motherEducation: 'Higher', healthAwarenessLevel: 'High', decisionMakingRole: true, knowledgeScore: 95 },
                nutritionAndLifestyle: { dietType: 'Balanced', breastfeedingHistoryMonths: 18, cleanWaterAccess: true, sanitationPractices: 'Good', physicalActivityHoursPerDay: 3 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Rohan', ageMonths: 36, gender: 'Male', weightKg: 14.5, heightCm: 96 },
                immunization: { bcg: true, polio: true, dpt: true, measles: true },
                diseaseTracking: { recentIllnesses: ['Fever'], illnessFrequencyPerYear: 2 },
                maternalInfluence: { motherEducation: 'Secondary', healthAwarenessLevel: 'High', decisionMakingRole: true, knowledgeScore: 82 },
                nutritionAndLifestyle: { dietType: 'Balanced', breastfeedingHistoryMonths: 12, cleanWaterAccess: true, sanitationPractices: 'Good', physicalActivityHoursPerDay: 2.5 },
                recordedBy: admin._id
            },
            // SECONDARY/PRIMARY ED, MODERATE CONDITIONS
            {
                childInfo: { name: 'Isha', ageMonths: 18, gender: 'Female', weightKg: 10.5, heightCm: 81 },
                immunization: { bcg: true, polio: true, dpt: true, measles: false },
                diseaseTracking: { recentIllnesses: ['Cold', 'Cough'], illnessFrequencyPerYear: 3 },
                maternalInfluence: { motherEducation: 'Secondary', healthAwarenessLevel: 'Medium', decisionMakingRole: false, knowledgeScore: 68 },
                nutritionAndLifestyle: { dietType: 'Balanced', breastfeedingHistoryMonths: 8, cleanWaterAccess: true, sanitationPractices: 'Moderate', physicalActivityHoursPerDay: 1.5 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Rahul', ageMonths: 28, gender: 'Male', weightKg: 11.5, heightCm: 85 },
                immunization: { bcg: true, polio: true, dpt: true, measles: true },
                diseaseTracking: { recentIllnesses: ['Stomach Infection'], illnessFrequencyPerYear: 4 },
                maternalInfluence: { motherEducation: 'Primary', healthAwarenessLevel: 'Medium', decisionMakingRole: true, knowledgeScore: 55 },
                nutritionAndLifestyle: { dietType: 'Junk-heavy', breastfeedingHistoryMonths: 6, cleanWaterAccess: true, sanitationPractices: 'Moderate', physicalActivityHoursPerDay: 2 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Meera', ageMonths: 52, gender: 'Female', weightKg: 14.8, heightCm: 100 },
                immunization: { bcg: true, polio: true, dpt: true, measles: false },
                diseaseTracking: { recentIllnesses: ['Flu', 'Cold'], illnessFrequencyPerYear: 3 },
                maternalInfluence: { motherEducation: 'Primary', healthAwarenessLevel: 'Low', decisionMakingRole: false, knowledgeScore: 45 },
                nutritionAndLifestyle: { dietType: 'Balanced', breastfeedingHistoryMonths: 4, cleanWaterAccess: false, sanitationPractices: 'Moderate', physicalActivityHoursPerDay: 2 },
                recordedBy: admin._id
            },
            // NO SCHOOLING, POOR CONDITIONS (FLAGGED / MALNOURISHED)
            {
                childInfo: { name: 'Priya', ageMonths: 36, gender: 'Female', weightKg: 9.8, heightCm: 90 }, // BMI ~ 12.1 (Severely underweight)
                immunization: { bcg: true, polio: true, dpt: false, measles: false },
                diseaseTracking: { recentIllnesses: ['Fever', 'Diarrhea', 'Pneumonia'], illnessFrequencyPerYear: 6 },
                maternalInfluence: { motherEducation: 'No Schooling', healthAwarenessLevel: 'Low', decisionMakingRole: false, knowledgeScore: 25 },
                nutritionAndLifestyle: { dietType: 'Malnourished', breastfeedingHistoryMonths: 2, cleanWaterAccess: false, sanitationPractices: 'Poor', physicalActivityHoursPerDay: 0.5 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Vikram', ageMonths: 60, gender: 'Male', weightKg: 13, heightCm: 102 }, // BMI ~ 12.5
                immunization: { bcg: true, polio: false, dpt: false, measles: false },
                diseaseTracking: { recentIllnesses: ['Diarrhea', 'Malaria'], illnessFrequencyPerYear: 8 },
                maternalInfluence: { motherEducation: 'No Schooling', healthAwarenessLevel: 'Low', decisionMakingRole: true, knowledgeScore: 15 },
                nutritionAndLifestyle: { dietType: 'Malnourished', breastfeedingHistoryMonths: 1, cleanWaterAccess: false, sanitationPractices: 'Poor', physicalActivityHoursPerDay: 1 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Anita', ageMonths: 22, gender: 'Female', weightKg: 8.5, heightCm: 79 }, // BMI ~ 13.6
                immunization: { bcg: true, polio: true, dpt: false, measles: false },
                diseaseTracking: { recentIllnesses: ['Cough', 'Fever'], illnessFrequencyPerYear: 5 },
                maternalInfluence: { motherEducation: 'No Schooling', healthAwarenessLevel: 'Medium', decisionMakingRole: false, knowledgeScore: 35 },
                nutritionAndLifestyle: { dietType: 'Junk-heavy', breastfeedingHistoryMonths: 3, cleanWaterAccess: false, sanitationPractices: 'Moderate', physicalActivityHoursPerDay: 1 },
                recordedBy: admin._id
            },
            {
                childInfo: { name: 'Karan', ageMonths: 40, gender: 'Male', weightKg: 12.0, heightCm: 94 }, // BMI ~ 13.5
                immunization: { bcg: true, polio: true, dpt: false, measles: false },
                diseaseTracking: { recentIllnesses: ['Diarrhea', 'Cold'], illnessFrequencyPerYear: 7 },
                maternalInfluence: { motherEducation: 'Primary', healthAwarenessLevel: 'Low', decisionMakingRole: true, knowledgeScore: 40 },
                nutritionAndLifestyle: { dietType: 'Junk-heavy', breastfeedingHistoryMonths: 5, cleanWaterAccess: true, sanitationPractices: 'Poor', physicalActivityHoursPerDay: 1.5 },
                recordedBy: admin._id
            }
        ];

        for (let data of sampleRecords) {
            const record = new PediatricRecord(data);
            await record.save(); // Utilizing pre-save hooks for calculations
        }

        console.log('Sample data seeded successfully.');
        process.exit();

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
