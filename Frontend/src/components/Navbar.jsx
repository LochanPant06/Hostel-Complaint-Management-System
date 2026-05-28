import { NavLink } from "react-router-dom";

const linkBase =
  "inline-flex h-14 items-center border-b-2 px-1 text-sm transition-colors duration-150";

export default function Navbar({ navItems, user, onLogout }) {
  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-canvas">
      <div className="mx-auto flex h-14 w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-8">
          <NavLink
            to={user?.role === "student" ? "/dashboard" : "/admin"}
            className="truncate text-sm font-semibold text-ink"
          >
            Hostel Complaint System
          </NavLink>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `${linkBase} ${
                    isActive
                      ? "border-primary text-ink font-semibold"
                      : "border-transparent text-body hover:text-ink"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-section text-sm font-semibold text-ink">
              {initial}
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-ink">{user?.name}</p>
              <p className="text-xs capitalize text-muted">{user?.role}</p>
            </div>
          </div>

          <button type="button" onClick={onLogout} className="button-ghost">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
