function normalizeDateKey(dateValue) {
  if (!dateValue) return "";
  if (typeof dateValue === "string") return dateValue.slice(0, 10);
  const d = new Date(dateValue);
  return d.toISOString().slice(0, 10);
}

export default function DailyCalendar({
  selectedDate,
  dayTasks,
  search = "", // ✅ NEW
  onClearSearch, // ✅ NEW
  onAddTask,
  onEditTask,
}) {
  const matchesSearch = (t) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;

    return (
      (t.title || "").toLowerCase().includes(q) ||
      (t.description || "").toLowerCase().includes(q) ||
      (t.type || "").toLowerCase().includes(q) ||
      (t.status || "").toLowerCase().includes(q)
    );
  };

  // ✅ tasks for selected date
  const todaysTasks = (dayTasks || []).filter(
    (t) => normalizeDateKey(t.date) === selectedDate
  );

  // ✅ search filtered tasks
  const filteredTodayTasks = todaysTasks.filter(matchesSearch);

  // ✅ show only when user typed search and no tasks match
  const noResults = search.trim().length > 0 && filteredTodayTasks.length === 0;

  return (
    <div className="bg-white/60 backdrop-blur-xl border rounded-3xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <div className="text-xl font-extrabold text-gray-900">Daily View</div>
          <div className="text-sm text-gray-500">{selectedDate}</div>
        </div>

        <div className="flex items-center gap-2">
          {noResults && (
            <button
              type="button"
              onClick={onClearSearch}
              className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50 font-bold shadow-sm"
            >
              Clear Search
            </button>
          )}

          <button
            onClick={onAddTask}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90 shadow font-semibold"
            type="button"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* ✅ No results banner (only when search typed) */}
      {noResults && (
        <div className="mb-4 px-4 py-3 rounded-3xl border bg-white/70 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold text-gray-800">
              No tasks matched your search 🥲
            </div>
            <div className="text-xs text-gray-500">
              Try searching by title, status, or type.
            </div>
          </div>

          <button
            type="button"
            onClick={onClearSearch}
            className="px-3 py-2 rounded-2xl border bg-white hover:bg-gray-50 font-bold text-sm"
          >
            Clear
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filteredTodayTasks.map((task) => (
          <div
            key={task._id}
            className="rounded-3xl border bg-white/80 p-4 shadow-sm hover:shadow cursor-pointer"
            onClick={() => onEditTask(task)}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="font-extrabold text-gray-900 truncate">
                {task.title}
              </div>
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                {task.status}
              </div>
            </div>

            <div className="text-sm text-gray-600 mt-1">
              {task.startTime} - {task.endTime}
            </div>

            {task.description && (
              <div className="text-sm text-gray-500 mt-2">
                {task.description}
              </div>
            )}
          </div>
        ))}

        {/* ✅ normal empty message (when no tasks exist for the day AND no search typed) */}
        {filteredTodayTasks.length === 0 && search.trim().length === 0 && (
          <div className="text-sm text-gray-400 font-semibold">
            No tasks for this day.
          </div>
        )}
      </div>
    </div>
  );
}
