const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// Explicit checking to prevent undefined routing crashes
if (!registerUser || !loginUser) {
  console.error("CRITICAL CONFIG ERROR: authController functions are not exported correctly!");
}

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;