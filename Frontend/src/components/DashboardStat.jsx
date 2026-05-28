export default function DashboardStat({ label, value, tone }) {
  return (
    <div className="card p-5">
      <p className="text-[28px] font-bold leading-none text-ink">{value}</p>
      <p className="mt-3 text-xs text-muted">{label}</p>
      {tone ? <p className="mt-2 text-xs text-body">{tone}</p> : null}
    </div>
  );
}
