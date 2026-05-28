import { ClipboardList, LayoutDashboard, PlusSquare } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../hooks/useAuth.js";

const getNavItems = (role) => {
  if (role === "student") {
    return [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        to: "/submit-complaint",
        label: "New Complaint",
        icon: PlusSquare,
      },
    ];
  }

  return [
    {
      to: "/admin",
      label: "Complaints",
      icon: ClipboardList,
    },
  ];
};

export const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = getNavItems(user?.role);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-section">
      <Navbar navItems={navItems} user={user} onLogout={handleLogout} />

      <div className="border-b border-line bg-canvas px-4 py-2 md:hidden">
        <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-sm transition-colors duration-150 ${
                    isActive
                      ? "border-primary bg-primary text-white"
                      : "border-line bg-canvas text-body hover:bg-section hover:text-ink"
                  }`
                }
              >
                <Icon size={16} strokeWidth={1.8} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>

      <div className="mx-auto flex min-h-[calc(100vh-56px)] w-full max-w-[1440px]">
        <Sidebar
          navItems={navItems}
          title={user?.role === "student" ? "Student" : "Workspace"}
        />
        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-section px-4 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md items-center justify-center">
        {children}
      </div>
    </div>
  );
};
