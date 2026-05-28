import { NavLink } from "react-router-dom";

export default function Sidebar({ navItems, title = "Overview" }) {
  return (
    <aside className="hidden w-[220px] shrink-0 border-r border-line bg-canvas lg:block">
      <div className="px-4 py-6">
        <p className="px-4 text-[11px] font-medium uppercase tracking-[0.05em] text-muted">
          {title}
        </p>
        <nav className="mt-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-4 py-2 text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-[#f4f4f5] font-medium text-ink"
                      : "text-body hover:bg-section hover:text-ink"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
