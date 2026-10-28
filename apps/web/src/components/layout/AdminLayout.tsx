import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, FileText, Crown, Scroll, Folder, Image, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { to: "/admin", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
    { to: "/admin/articles", label: "Artikel", icon: <FileText size={18} /> },
    { to: "/admin/kings", label: "Raja", icon: <Crown size={18} /> },
    { to: "/admin/inscriptions", label: "Prasasti", icon: <Scroll size={18} /> },
    { to: "/admin/categories", label: "Kategori", icon: <Folder size={18} /> },
    { to: "/admin/media", label: "Media", icon: <Image size={18} /> },
  ];

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h2>Pajajaran Admin</h2>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to || (item.to !== "/admin" && location.pathname.startsWith(item.to)) ? "active" : ""}
            >
              {item.icon} {item.label}
            </Link>
          ))}
          <button
            onClick={() => logout()}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", color: "rgba(255,255,255,0.8)", background: "none", border: "none", cursor: "pointer", width: "100%", textAlign: "left" }}
          >
            <LogOut size={18} /> Keluar
          </button>
        </nav>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
