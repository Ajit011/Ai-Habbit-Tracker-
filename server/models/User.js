const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      lowercase: true, 
      trim: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'] 
    },
  },
  { timestamps: true }
);

// Password hashing middleware before saving (Clean Asynchronous Style)
userSchema.pre('save', async function () {
  // Agar password modify nahi hua hai, toh direct return karke skip karo
  if (!this.isModified('password')) {
    return;
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw error; // Direct throw karne se mongoose next(error) samajh leta hai
  }
});

// Match password methodology
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Prevent model overwrite compiled errors
module.exports = mongoose.models.User || mongoose.model('User', userSchema);