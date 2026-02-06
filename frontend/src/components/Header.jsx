function formatDDMMYYYY(yyyyMMdd) {
  if (!yyyyMMdd) return "";
  const [y, m, d] = yyyyMMdd.split("-");
  return `${d} ${m} ${y}`;
}

function toYYYYMMDD(dateObj) {
  return dateObj.toISOString().slice(0, 10);
}

function getDateLabel(yyyyMMdd) {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const [y, m, d] = yyyyMMdd.split("-").map(Number);
  const sel = new Date(y, m - 1, d);

  const diffDays = Math.round((sel - t) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays === -1) return "Yesterday";
  return null;
}

export default function Header({ selectedDate, setSelectedDate, onAddTask }) {
  const label = getDateLabel(selectedDate);

  return (
    <div className="rounded-3xl border bg-white/60 backdrop-blur-xl shadow-md p-6 flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-700 to-violet-700 bg-clip-text text-transparent">
          Task Calendar
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Plan your day, track task status, and stay productive.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* ✅ Premium Date Chip (clickable) */}
        <div className="relative">
          <div className="px-4 py-2 rounded-2xl border bg-white/80 shadow-sm cursor-pointer select-none flex items-center gap-2">
            <span className="text-lg">🎯</span>

            {label && (
              <span className="text-xs font-extrabold px-2 py-1 rounded-full bg-violet-100 text-violet-700">
                {label}
              </span>
            )}

            <span className="font-extrabold text-gray-900">
              {formatDDMMYYYY(selectedDate)}
            </span>
          </div>

          {/* real date input overlay */}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Select date"
          />
        </div>

        {/* ❌ Clock icon removed */}

        {/* ✅ Add Task */}
        <button
          onClick={onAddTask}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90 shadow font-semibold"
          type="button"
        >
          + Add Task
        </button>

        {/* ✅ OPTIONAL: if you still want "Go to Today" without icon */}
        {/*
        <button
          onClick={() => setSelectedDate(toYYYYMMDD(new Date()))}
          className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50 shadow-sm font-semibold"
          title="Go to today"
          type="button"
        >
          Today
        </button>
        */}
      </div>
    </div>
  );
}
