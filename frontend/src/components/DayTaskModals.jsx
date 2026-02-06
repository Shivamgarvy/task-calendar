function statusPill(status) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-700 border-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "inprogress":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "overdue":
      return "bg-red-100 text-red-700 border-red-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

export default function DayTaskModals({
  date,
  tasks,
  close,
  onEditTask,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="w-full max-w-xl rounded-3xl border bg-white shadow-xl overflow-hidden">
        <div className="p-5 border-b flex items-center justify-between">
          <div>
            <div className="text-lg font-extrabold text-gray-900">
              Tasks on {date}
            </div>
            <div className="text-sm text-gray-500">
              Total: {tasks.length}
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

        <div className="p-5 space-y-3 max-h-[65vh] overflow-auto">
          {tasks.map((t) => (
            <div
              key={t._id}
              className="rounded-2xl border p-4 hover:shadow-md transition cursor-pointer bg-white"
              onClick={() => onEditTask(t)}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-extrabold text-gray-900 truncate">
                  {t.title}
                </div>

                <span
                  className={[
                    "text-xs px-2 py-1 rounded-full border font-bold",
                    statusPill(t.status),
                  ].join(" ")}
                >
                  {t.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {t.startTime} - {t.endTime} • <span className="font-semibold">{t.type}</span>
              </div>

              {t.description ? (
                <div className="text-sm text-gray-500 mt-2">
                  {t.description}
                </div>
              ) : null}
            </div>
          ))}
        </div>

        <div className="p-5 border-t flex justify-end">
          <button
            onClick={close}
            className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50 font-semibold"
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
