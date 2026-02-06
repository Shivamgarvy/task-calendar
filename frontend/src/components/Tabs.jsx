export default function Tabs({ active, setActive }) {
  const tabs = ["daily", "weekly", "monthly"];

  return (
    <div className="inline-flex bg-white/70 backdrop-blur border rounded-3xl p-1 shadow-sm">
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActive(t)}
          className={[
            "px-5 py-2 rounded-3xl text-sm font-bold capitalize transition",
            active === t
              ? "bg-gradient-to-r from-fuchsia-600 to-violet-600 text-white shadow"
              : "text-gray-700 hover:bg-white",
          ].join(" ")}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
