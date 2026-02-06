const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },

    date: { type: String, required: true }, // YYYY-MM-DD
    startTime: { type: String, required: true }, // HH:mm
    endTime: { type: String, required: true }, // HH:mm

    status: {
      type: String,
      enum: ["pending", "inprogress", "completed", "overdue"],
      default: "pending",
    },

    type: {
      type: String,
      enum: ["work", "study", "health", "personal", "other"],
      default: "other",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
