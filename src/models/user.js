const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    trim: true,
  },

  roles: {
    user: {
      type: Number,
      default: 6703,
    },
    editor: Number,
    admin: Number,
  },

  refreshToken: [String],

  resetPasswordToken: {
    type: String,
    default: null,
  },

  resetPasswordExpires: {
    type: Date,
    default: null,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;