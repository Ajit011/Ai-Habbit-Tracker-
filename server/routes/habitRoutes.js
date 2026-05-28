const express = require('express');
const router = express.Router();

const { 
  createHabit, 
  getHabits, 
  archiveHabit, 
  deleteHabit, 
  checkOffHabit, 
  toggleDateStatus, // 🔥 New explicit structural row checkbox route imported
  getHeatmapStats 
} = require('../controllers/habitController');

const { protect } = require('../middleware/authMiddleware');

// 1. Base routes (Get habits and create habit)
router.route('/')
  .post(protect, createHabit)
  .get(protect, getHabits);

// 2. Heatmap Stats Route (CRITICAL: Maintained safe above dynamic /:id mapping constraint)
router.route('/stats/heatmap')
  .get(protect, getHeatmapStats);

// 3. Dynamic ID route for deleting a habit permanently
router.route('/:id')
  .delete(protect, deleteHabit);

// 4. Dynamic ID route for archiving a habit
router.route('/:id/archive')
  .put(protect, archiveHabit);

// 5. Dynamic ID route for checking off a habit for today (Legacy shortcut layer)
router.route('/:id/checkoff')
  .post(protect, checkOffHabit);

// 6. NEW CRITICAL ROUTE: Horizontal Row Matrix day toggler view trigger
router.route('/:id/toggle-date')
  .post(protect, toggleDateStatus);

module.exports = router;