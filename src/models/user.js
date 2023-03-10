const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
