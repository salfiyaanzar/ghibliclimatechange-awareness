const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true
  },
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      },
      message: props => `${props.value} is not a valid email!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    validate: {
      validator: function (value) {
        return /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(value);
      },
      message: props => `Password must be at least 8 characters long and include at least one number and one special character.`
    }
  }
}, {
  timestamps: true
});

// Add auto-increment plugin for userId
userSchema.plugin(AutoIncrement, { inc_field: 'userId' });

// Export User model
const User = mongoose.model('User', userSchema);

module.exports = User;
