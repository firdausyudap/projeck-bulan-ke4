import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { FileText, Crown, Scroll, Users, Plus, Activity } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, kings: 0, inscriptions: 0, users: 0 });
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.get("/articles", { params: { limit: 1 } }),
      api.get("/kings", { params: { limit: 1 } }),
      api.get("/inscriptions", { params: { limit: 1 } }),
      api.get("/auth/users"),
      api.get("/articles", { params: { limit: 5 } }),
    ]).then(([a, k, i, u, r]) => {
      setStats({
        articles: a.data.meta?.total || 0,
        kings: k.data.meta?.total || 0,
        inscriptions: i.data.meta?.total || 0,
        users: Array.isArray(u.data.data) ? u.data.data.length : 0,
      });
      setRecent(r.data.data || []);
    }).catch(() => {});
  }, []);

  const cards = [
    { icon: <FileText size={32} />, label: "Artikel", count: stats.articles, link: "/admin/articles", color: "#14213D" },
    { icon: <Crown size={32} />, label: "Raja", count: stats.kings, link: "/admin/kings", color: "#C9A227" },
    { icon: <Scroll size={32} />, label: "Prasasti", count: stats.inscriptions, link: "/admin/inscriptions", color: "#1F3D2B" },
    { icon: <Users size={32} />, label: "Pengguna", count: stats.users, link: "/admin/categories", color: "#8B6F3F" },
  ];

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Dashboard Admin</h1>
      <div className="grid grid-4" style={{ marginBottom: 32 }}>
        {cards.map((c) => (
          <Link to={c.link} key={c.label} className="card" style={{ padding: 24, textAlign: "center" }}>
            <div style={{ color: c.color, marginBottom: 8 }}>{c.icon}</div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--color-primary)" }}>{c.count}</div>
            <div style={{ color: "var(--color-text-light)" }}>{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="grid grid-2" style={{ marginBottom: 32 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
            <Activity size={20} /> Aktivitas Terbaru
          </h3>
          {recent.length === 0 ? (
            <p style={{ color: "var(--color-text-light)" }}>Belum ada aktivitas.</p>
          ) : (
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
              {recent.map((a) => (
                <li key={a.id} style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: 8 }}>
                  <Link to={`/admin/articles/${a.id}/edit`} style={{ fontWeight: 500 }}>{a.title}</Link>
                  <div style={{ fontSize: "0.8rem", color: "var(--color-text-light)" }}>
                    {a.status} · {new Date(a.createdAt).toLocaleDateString("id-ID")}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ marginBottom: 16 }}>Aksi Cepat</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/admin/articles/new" className="btn btn-primary"><Plus size={16} /> Artikel</Link>
            <Link to="/admin/kings/new" className="btn btn-primary"><Plus size={16} /> Raja</Link>
            <Link to="/admin/inscriptions/new" className="btn btn-primary"><Plus size={16} /> Prasasti</Link>
            <Link to="/admin/media/new" className="btn btn-primary"><Plus size={16} /> Media</Link>
            <Link to="/admin/categories" className="btn btn-outline">Kategori</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
