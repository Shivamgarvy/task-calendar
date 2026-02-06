function Card({ title, value, icon, gradient }) {
  return (
    <div className="group rounded-3xl border bg-white/60 backdrop-blur-xl shadow-sm p-4 hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-600">{title}</div>
          <div className="text-2xl font-extrabold text-gray-900 mt-1">
            {value}
          </div>
        </div>

        <div
          className={[
            "h-11 w-11 rounded-2xl flex items-center justify-center text-lg text-white shadow",
            gradient,
          ].join(" ")}
        >
          {icon}
        </div>
      </div>

      <div className="mt-3 h-1 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={[
            "h-full w-2/3 opacity-80 group-hover:w-full transition-all",
            gradient,
          ].join(" ")}
        />
      </div>
    </div>
  );
}

export default function StatCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card
        title="Total Tasks"
        value={stats.total}
        icon="📌"
        gradient="bg-gradient-to-r from-violet-600 to-fuchsia-600"
      />
      <Card
        title="Pending"
        value={stats.pending}
        icon="⏳"
        gradient="bg-gradient-to-r from-yellow-500 to-orange-500"
      />
      <Card
        title="In Progress"
        value={stats.inprogress}
        icon="⚡"
        gradient="bg-gradient-to-r from-blue-600 to-cyan-500"
      />
      <Card
        title="Completed"
        value={stats.completed}
        icon="✅"
        gradient="bg-gradient-to-r from-green-600 to-emerald-500"
      />
      <Card
        title="Overdue"
        value={stats.overdue}
        icon="⛔"
        gradient="bg-gradient-to-r from-red-600 to-rose-500"
      />
    </div>
  );
}
