const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET TASKS OF A DATE
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date query is required" });

    const tasks = await Task.find({ date }).sort({ startTime: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET TASKS OF A MONTH
router.get("/month", async (req, res) => {
  try {
    const { year, month } = req.query; // month = 1..12
    if (!year || !month) {
      return res.status(400).json({ error: "year and month required" });
    }

    const y = Number(year);
    const m = Number(month);

    const startDate = `${y}-${String(m).padStart(2, "0")}-01`;
    const endDate = `${y}-${String(m).padStart(2, "0")}-31`;

    const tasks = await Task.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1, startTime: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET TASKS IN RANGE (WEEK)
router.get("/range", async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) {
      return res.status(400).json({ error: "start and end are required" });
    }

    const tasks = await Task.find({
      date: { $gte: start, $lte: end },
    }).sort({ date: 1, startTime: 1 });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted ✅" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
