import { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;


export default function TaskModal({ close, date, editTask, refresh }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");

  const [status, setStatus] = useState("pending");
  const [type, setType] = useState("other");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || "");
      setDescription(editTask.description || "");
      setStartTime(editTask.startTime || "09:00");
      setEndTime(editTask.endTime || "10:00");
      setStatus(editTask.status || "pending");
      setType(editTask.type || "other");
    } else {
      setTitle("");
      setDescription("");
      setStartTime("09:00");
      setEndTime("10:00");
      setStatus("pending");
      setType("other");
    }
  }, [editTask]);

  const handleSave = async () => {
    if (!title.trim()) return alert("Title is required");

    const payload = {
      title,
      description,
      date,
      startTime,
      endTime,
      status,
      type,
    };

    try {
      if (editTask) {
        await axios.put(`${API_URL}/${editTask._id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }

      await refresh();
      close();
    } catch (err) {
      console.log(err);
      alert("Error saving task");
    }
  };

  const handleDelete = async () => {
    if (!editTask?._id) return;

    const ok = confirm("Delete this task?");
    if (!ok) return;

    try {
      await axios.delete(`${API_URL}/${editTask._id}`);
      await refresh();
      close();
    } catch (err) {
      console.log(err);
      alert("Failed to delete task!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border bg-white shadow-xl overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-gray-900">
              {editTask ? "Edit Task" : "Add Task"}
            </div>
            <div className="text-sm text-gray-500">
              Date: <span className="font-semibold">{date}</span>
            </div>
          </div>

          <button
            onClick={close}
            className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 font-bold"
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-bold text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Eg. Gym / Submission / Meeting..."
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 w-full px-4 py-2 rounded-2xl border bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
              placeholder="Optional notes..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-gray-700">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-2xl border bg-white"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">End Time</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-2xl border bg-white"
              />
            </div>
          </div>

          {/* ✅ Status + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-bold text-gray-700">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-2xl border bg-white font-semibold"
              >
                <option value="pending">Pending</option>
                <option value="inprogress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 w-full px-4 py-2 rounded-2xl border bg-white font-semibold"
              >
                <option value="work">Work</option>
                <option value="study">Study</option>
                <option value="health">Health</option>
                <option value="personal">Personal</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="p-5 border-t flex justify-between gap-3">
          {/* Delete */}
          {editTask ? (
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-2xl border border-red-200 text-red-600 hover:bg-red-50 font-bold"
              type="button"
            >
              Delete
            </button>
          ) : (
            <div />
          )}

          {/* Cancel + Save */}
          <div className="flex gap-3">
            <button
              onClick={close}
              className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50 font-semibold"
              type="button"
            >
              Cancel
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90 shadow font-bold"
              type="button"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
