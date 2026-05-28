export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      {Icon ? (
        <Icon size={20} strokeWidth={1.8} className="mb-3 text-muted" />
      ) : null}
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
