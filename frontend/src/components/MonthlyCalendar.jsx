import { useMemo, useState } from "react";
import DayTaskModals from "./DayTaskModals";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDateYYYYMMDD(dateObj) {
  return `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(
    dateObj.getDate()
  )}`;
}

function sameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function statusClass(status) {
  switch (status) {
    case "completed":
      return "border-green-200 bg-green-50/80 text-green-800";
    case "pending":
      return "border-yellow-200 bg-yellow-50/80 text-yellow-800";
    case "inprogress":
      return "border-blue-200 bg-blue-50/80 text-blue-800";
    case "overdue":
      return "border-red-200 bg-red-50/80 text-red-800";
    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

function typeBadge(type) {
  switch (type) {
    case "work":
      return "bg-violet-100 text-violet-700";
    case "study":
      return "bg-indigo-100 text-indigo-700";
    case "health":
      return "bg-emerald-100 text-emerald-700";
    case "personal":
      return "bg-orange-100 text-orange-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function normalizeDateKey(dateValue) {
  if (!dateValue) return "";
  if (typeof dateValue === "string") return dateValue.slice(0, 10);
  const d = new Date(dateValue);
  return d.toISOString().slice(0, 10);
}

export default function MonthlyCalendar({
  activeMonth,
  setActiveMonth,
  selectedDate,
  setSelectedDate,
  monthTasks,
  search = "",
  onClearSearch,
  onAddTask,
  onEditTask,
}) {
  const [openDayModal, setOpenDayModal] = useState(false);
  const [modalDate, setModalDate] = useState("");
  const [modalTasks, setModalTasks] = useState([]);

  const monthYearLabel = activeMonth.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const firstDayOfMonth = new Date(
    activeMonth.getFullYear(),
    activeMonth.getMonth(),
    1
  );

  const startDay = new Date(firstDayOfMonth);
  startDay.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  const days = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    days.push(d);
  }

  const selected = new Date(selectedDate);

  const map = useMemo(() => {
    const grouped = {};
    for (const t of monthTasks || []) {
      const key = normalizeDateKey(t.date);
      if (!key) continue;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(t);
    }
    return grouped;
  }, [monthTasks]);

  const goPrev = () => {
    const prev = new Date(activeMonth);
    prev.setMonth(prev.getMonth() - 1);
    setActiveMonth(new Date(prev.getFullYear(), prev.getMonth(), 1));
  };

  const goNext = () => {
    const next = new Date(activeMonth);
    next.setMonth(next.getMonth() + 1);
    setActiveMonth(new Date(next.getFullYear(), next.getMonth(), 1));
  };

  // ✅ show only when search typed
  const noResults = search.trim().length > 0 && (monthTasks || []).length === 0;

  return (
    <div className="bg-white/60 backdrop-blur-xl border rounded-3xl shadow-md overflow-hidden">
      {/* header */}
      <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={goPrev}
            className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 font-bold shadow-sm"
            type="button"
          >
            ‹
          </button>

          <button
            onClick={goNext}
            className="h-10 w-10 rounded-2xl border bg-white hover:bg-gray-50 font-bold shadow-sm"
            type="button"
          >
            ›
          </button>

          <div className="ml-2">
            <div className="text-xl font-extrabold text-gray-900">
              {monthYearLabel}
            </div>
            <div className="text-sm text-gray-500">
              Dots show status • Badge shows task count
            </div>
          </div>
        </div>

        <button
          onClick={() => onAddTask()}
          className="px-4 py-2 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white hover:opacity-90 shadow font-semibold"
          type="button"
        >
          + Add Task
        </button>
      </div>

      {/* ✅ no results banner */}
      {noResults && (
        <div className="px-4 py-3 border-b bg-white/70 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-extrabold text-gray-800">
              No tasks matched your search 🥲
            </div>
            <div className="text-xs text-gray-500">
              Try another keyword like title, status or type.
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

      {/* weekday labels */}
      <div className="grid grid-cols-7 text-xs font-bold text-gray-500 border-b bg-gray-50/70">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
          <div key={d} className="p-3">
            {d}
          </div>
        ))}
      </div>

      {/* calendar */}
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === activeMonth.getMonth();
          const isSelected = sameDay(day, selected);

          const dayStr = formatDateYYYYMMDD(day);
          const tasks = map[dayStr] || [];

          const hasTasks = tasks.length > 0;

          const hasPending = tasks.some((t) => t.status === "pending");
          const hasInProgress = tasks.some((t) => t.status === "inprogress");
          const hasCompleted = tasks.some((t) => t.status === "completed");
          const hasOverdue = tasks.some((t) => t.status === "overdue");

          return (
            <div
              key={dayStr}
              onClick={() => setSelectedDate(dayStr)}
              className={[
                "min-h-[150px] border-b border-r p-2 cursor-pointer transition relative",
                isCurrentMonth ? "bg-white/50" : "bg-gray-50/70",
                "hover:bg-white",
                hasTasks ? "hover:ring-2 hover:ring-violet-200" : "",
                isSelected ? "ring-2 ring-violet-500 relative z-10" : "",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <div
                  className={[
                    "text-sm font-extrabold",
                    isCurrentMonth ? "text-gray-900" : "text-gray-400",
                  ].join(" ")}
                >
                  {day.getDate()}
                </div>

                <div className="flex items-center gap-2">
                  {hasTasks && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-900 text-white font-bold shadow">
                      {tasks.length}
                    </span>
                  )}

                  <button
                    className="text-xs px-2 py-1 rounded-xl border bg-white hover:bg-gray-50 shadow-sm"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedDate(dayStr);
                      onAddTask(dayStr);
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {hasTasks && (
                <div className="mt-1 flex gap-1">
                  {hasPending && (
                    <span className="h-2 w-2 rounded-full bg-yellow-500" />
                  )}
                  {hasInProgress && (
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                  )}
                  {hasCompleted && (
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                  )}
                  {hasOverdue && (
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
              )}

              <div className="mt-2 space-y-2">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    className={[
                      "rounded-2xl border p-2 text-xs shadow-sm",
                      "hover:scale-[1.02] hover:shadow transition",
                      statusClass(task.status),
                    ].join(" ")}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditTask(task);
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-extrabold truncate">
                        {task.title}
                      </div>

                      <span
                        className={[
                          "text-[10px] px-2 py-0.5 rounded-full font-bold",
                          typeBadge(task.type),
                        ].join(" ")}
                      >
                        {task.type}
                      </span>
                    </div>

                    <div className="opacity-80 mt-0.5">
                      {task.startTime} - {task.endTime}
                    </div>
                  </div>
                ))}

                {tasks.length > 3 && (
                  <button
                    type="button"
                    className="text-xs text-violet-700 font-extrabold hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalDate(dayStr);
                      setModalTasks(tasks);
                      setOpenDayModal(true);
                    }}
                  >
                    +{tasks.length - 3} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {openDayModal && (
        <DayTaskModals
          date={modalDate}
          tasks={modalTasks}
          close={() => setOpenDayModal(false)}
          onEditTask={(task) => {
            setOpenDayModal(false);
            onEditTask(task);
          }}
        />
      )}
    </div>
  );
}
