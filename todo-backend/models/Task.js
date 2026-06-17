const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Speeds up queries searching by user id
  },
}, {
  timestamps: true // Tracks createdAt and updatedAt automatically
});

module.exports = mongoose.model("Task", taskSchema);