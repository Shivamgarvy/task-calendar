export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50" />

      {/* blobs */}
      <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-fuchsia-400/30 to-violet-400/30 blur-3xl" />
      <div className="absolute top-40 -right-40 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-emerald-400/25 to-cyan-400/25 blur-3xl" />
      <div className="absolute bottom-[-160px] left-1/3 h-[34rem] w-[34rem] rounded-full bg-gradient-to-br from-orange-400/25 to-rose-400/25 blur-3xl" />

      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </div>
  );
}
