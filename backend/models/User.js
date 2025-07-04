const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Cada email deve ser único
  },
  password: {
    type: String,
    required: true, // A password será "hashed" (encriptada)
  },
  role: {
    type: String,
    enum: ['employee', 'manager', 'admin'],
    default: 'employee',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', UserSchema);