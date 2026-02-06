function normalizeDateKey(dateValue) {
  if (!dateValue) return "";
  if (typeof dateValue === "string") return dateValue.slice(0, 10);
  const d = new Date(dateValue);
  return d.toISOString().slice(0, 10);
}

export default function WeeklyCalendar({
  selectedDate,
  weekTasks,
  search = "", // ✅ NEW
  onClearSearch, // ✅ NEW
  setSelectedDate,
  onAddTask,
  onEditTask,
}) {
  const selected = new Date(selectedDate);

  const start = new Date(selected);
  start.setDate(selected.getDate() - selected.getDay());

  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    days.push(d);
  }

  // ✅ Search filter
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

  // ✅ filter tasks first
  const filteredWeekTasks = (weekTasks || []).filter(matchesSearch);

  // ✅ show this message only when user typed something and no tasks matched
  const noResults = search.trim().length > 0 && filteredWeekTasks.length === 0;

  // ✅ group filtered tasks
  const grouped = {};
  for (const t of filteredWeekTasks) {
    const key = normalizeDateKey(t.date);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  }

  const fmt = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  return (
    <div className="bg-white/60 backdrop-blur-xl border rounded-3xl shadow-md p-4">
      {/* ✅ header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="text-xl font-extrabold text-gray-900">Weekly View</div>

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

      {/* ✅ No results banner */}
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

      {/* ✅ days grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {days.map((d) => {
          const key = fmt(d);
          const tasks = grouped[key] || [];

          return (
            <div
              key={key}
              className="rounded-3xl border bg-white/70 p-3 shadow-sm cursor-pointer"
              onClick={() => setSelectedDate(key)}
            >
              <div className="font-extrabold text-gray-900">
                {d.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="text-xs text-gray-500 mb-2">{key}</div>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task._id}
                    className="rounded-2xl border p-2 text-xs bg-white shadow-sm hover:shadow cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                  >
                    <div className="font-bold truncate">{task.title}</div>
                    <div className="text-[11px] text-gray-600 mt-1">
                      {task.startTime} - {task.endTime}
                    </div>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <div className="text-xs text-gray-400">No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
