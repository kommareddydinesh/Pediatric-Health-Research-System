const express = require('express');
const router = express.Router();
const PediatricRecord = require('../models/PediatricRecord');
const auth = require('../middleware/authMiddleware');

// @route   POST api/records
// @desc    Add new pediatric record
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newRecord = new PediatricRecord({
      ...req.body,
      recordedBy: req.user.id
    });

    const record = await newRecord.save();
    res.json(record);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/records
// @desc    Get all records
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { education, search } = req.query;
    
    let query = {};
    
    if (education && education !== 'All') {
      query['maternalInfluence.motherEducation'] = education;
    }
    
    if (search) {
      query['childInfo.name'] = { $regex: search, $options: 'i' };
    }

    const records = await PediatricRecord.find(query).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/records/alerts
// @desc    Get flagged records
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = await PediatricRecord.find({ 'healthMetrics.isFlagged': true }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/records/:id
// @desc    Get record by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const record = await PediatricRecord.findById(req.params.id);
    if (!record) return res.status(404).json({ msg: 'Record not found' });
    res.json(record);
  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({ msg: 'Record not found' });
    res.status(500).send('Server Error');
  }
});

module.exports = router;
