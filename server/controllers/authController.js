const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret_key_9988', { expiresIn: '7d' });
};

// @desc    Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log("-> Backend received data for register:", { name, email, hasPassword: !!password });

  try {
    // 1. Check database connectivity
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // 2. Insert record
    const user = await User.create({ name, email, password });
    
    console.log("-> User created successfully in DB:", user._id);

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    // YEH LINE TERMINAL PAR ROCKET LOG PRINT KAREGI
    console.error('====== CRITICAL BACKEND ERROR TRACE ======');
    console.error(error);
    console.error('==========================================');
    
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('CRITICAL LOGIN ERROR:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { registerUser, loginUser };