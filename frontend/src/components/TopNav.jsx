export default function TopNav({ search, setSearch }) {
  return (
    <div className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 pt-5">
        <div className="rounded-3xl border bg-white/60 backdrop-blur-xl shadow-md px-5 py-3 flex items-center justify-between gap-4">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-r from-fuchsia-600 to-violet-600 shadow flex items-center justify-center text-white font-extrabold">
              TC
            </div>
            <div>
              <div className="font-extrabold text-gray-900 leading-5">
                Task Calendar
              </div>
              <div className="text-xs text-gray-500">MERN Scheduler</div>
            </div>
          </div>

          {/* ✅ Search (NOW ALWAYS VISIBLE) */}
          <div className="flex flex-1 justify-center px-6">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, desc, type, status..."
              className="w-full max-w-md px-4 py-2 rounded-2xl border bg-white/80 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 rounded-2xl border bg-white hover:bg-gray-50 font-semibold shadow-sm">
              Help
            </button>

            <div className="h-10 w-10 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold flex items-center justify-center shadow">
              S
            </div>
          </div>
        </div>
      </div>

      <div className="h-5" />
    </div>
  );
}
