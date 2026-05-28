const Habit = require('../models/Habit');

// @desc    Get all active habits for logged-in user
// @route   GET /api/habits
const getHabits = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: 'Server error retrieving habit streams.', error: error.message });
  }
};

// @desc    Create a new advanced habit protocol pipeline
// @route   POST /api/habits
const createHabit = async (req, res) => {
  try {
    const { name, description, category, frequency, color, icon } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Habit name is fundamentally required.' });
    }

    const newHabit = new Habit({
      user: req.user._id,
      name,
      description: description || '',
      category: category || 'Other',
      frequency: frequency || 'Daily',
      color: color || '#6366f1',
      icon: icon || '🎯',
      weeklyLogs: []
    });

    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    res.status(500).json({ message: 'Failed to deploy system habit stream.', error: error.message });
  }
};

// @desc    Toggle dynamic completion status for a specific date grid checkbox (Horizontal Row View)
// @route   POST /api/habits/:id/toggle-date
const toggleDateStatus = async (req, res) => {
  try {
    const { dateStr } = req.body; // Expects YYYY-MM-DD
    if (!dateStr) return res.status(400).json({ message: 'Target date string parameters missing.' });

    const habit = await Habit.findOne({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit tracking target link dropped.' });

    const existingLogIndex = habit.weeklyLogs.findIndex(log => log.dateStr === dateStr);

    if (existingLogIndex > -1) {
      const currentStatus = habit.weeklyLogs[existingLogIndex].status;
      habit.weeklyLogs[existingLogIndex].status = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    } else {
      habit.weeklyLogs.push({ dateStr, status: 'Completed' });
    }

    // Dynamic Streak Core Re-calculation Engine
    const completedDates = habit.weeklyLogs
      .filter(log => log.status === 'Completed')
      .map(log => log.dateStr)
      .sort();

    let streak = 0;
    if (completedDates.length > 0) {
      let temporaryStreak = 1;
      let calculatedMax = 1;
      
      for (let i = 1; i < completedDates.length; i++) {
        const d1 = new Date(completedDates[i - 1]);
        const d2 = new Date(completedDates[i]);
        const diffTime = Math.abs(d2 - d1);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          temporaryStreak++;
        } else if (diffDays > 1) {
          if (temporaryStreak > calculatedMax) calculatedMax = temporaryStreak;
          temporaryStreak = 1;
        }
      }
      streak = Math.max(temporaryStreak, calculatedMax);
    }

    habit.currentStreak = streak;
    if (streak > habit.longestStreak) habit.longestStreak = streak;

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: 'Grid compilation toggle failed.', error: error.message });
  }
};

// @desc    Legacy system checkoff for today's snapshot block (Backup channel)
// @route   POST /api/habits/:id/checkoff
const checkOffHabit = async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];
    req.body.dateStr = todayStr;
    return toggleDateStatus(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Checkoff runtime error.', error: error.message });
  }
};

// @desc    Archive a habit string layer block
// @route   PUT /api/habits/:id/archive
const archiveHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isArchived: true },
      { new: true }
    );
    if (!habit) return res.status(404).json({ message: 'Habit vector target not found.' });
    res.json({ message: 'Habit protocol archived successfully.', habit });
  } catch (error) {
    res.status(500).json({ message: 'Archive operational crash.', error: error.message });
  }
};

// @desc    Remove a habit permanently from database cluster
// @route   DELETE /api/habits/:id
const deleteHabit = async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!habit) return res.status(404).json({ message: 'Habit execution target missing.' });
    res.json({ message: 'Permanent deletion execution complete.' });
  } catch (error) {
    res.status(500).json({ message: 'Deletion operational error.', error: error.message });
  }
};

// @desc    Get Compiled Heatmap Grid Analytics (90-Day Production Array)
// @route   GET /api/habits/stats/heatmap
const getHeatmapStats = async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user._id, isArchived: false });
    
    // Hash map compilation tracker
    const dateCounts = {};
    
    habits.forEach(habit => {
      habit.weeklyLogs.forEach(log => {
        if (log.status === 'Completed') {
          dateCounts[log.dateStr] = (dateCounts[log.dateStr] || 0) + 1;
        }
      });
    });

    // Output formatted directly into mapping array cluster
    const formattedStats = Object.keys(dateCounts).map(date => ({
      date,
      count: dateCounts[date]
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Heatmap matrix calculation failure.', error: error.message });
  }
};

module.exports = { 
  getHabits, 
  createHabit, 
  toggleDateStatus, 
  checkOffHabit, 
  archiveHabit, 
  deleteHabit, 
  getHeatmapStats 
};