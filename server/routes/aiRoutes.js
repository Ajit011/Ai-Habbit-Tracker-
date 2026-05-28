const express = require('express');
const router = express.Router();
// Top imports statement line ko destructurer array ke sath synchronize karo:
const { getWeeklyReport, getHabitSuggestions, getStreakRecoveryPlan, analyzeHabitChat, getMorningBoost } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// =========================================================================
// AI ENVIRONMENT SECURED CHANNELS
// =========================================================================

// Module 6: Weekly Analytics Stream Report
router.route('/weekly-report').get(protect, getWeeklyReport);

// Module 7: 3-Step Recommendation Wizard Input Channel
router.route('/suggestions-wizard').post(protect, getHabitSuggestions);

// Module 8: Streak Auto-Detection & Recovery Plan
router.route('/streak-recovery').get(protect, getStreakRecoveryPlan);

// Module 9: Natural Language Analysis Chat Pipeline (NEW UPGRADE)
router.route('/chat-analysis').post(protect, analyzeHabitChat);
// Module 10: Morning Boost Mindset Protocol Pipeline
router.route('/morning-boost').get(protect, getMorningBoost);
module.exports = router;