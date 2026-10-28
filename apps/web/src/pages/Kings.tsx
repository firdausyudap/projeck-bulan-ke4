import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { Crown, Calendar } from "lucide-react";

const kingImage = (k: any) =>
  k.portraitUrl || (k.slug?.includes("siliwangi") ? "/images/king-siliwangi.svg" : "/images/king-jayabhupati.svg");

export default function Kings() {
  const [kings, setKings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    api.get("/kings", { params: { page, limit: 12, search: search || undefined } })
      .then((res) => {
        if (res.data.success) {
          setKings(res.data.data || []);
          setTotalPages(res.data.meta?.totalPages || 1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 8 }}>Raja & Tokoh</h1>
      <p style={{ color: "var(--color-text-light)", marginBottom: 32 }}>Profil raja dan tokoh penting dalam sejarah Sunda</p>

      <input
        className="input"
        placeholder="Cari raja..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{ maxWidth: 300, marginBottom: 32 }}
      />

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : kings.length === 0 ? (
        <div className="empty-state">
          <h3>Tidak ada data raja</h3>
          <p>Data raja akan segera tersedia.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            {kings.map((k) => (
              <Link to={`/kings/${k.slug}`} key={k.id} className="card">
<img
                  src={kingImage(k)}
                  alt={k.name}
                  className="card-img"
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/king-jayabhupati.svg";
                  }}
                />
                <div className="card-body">
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gold)", flexShrink: 0 }}>
                      <Crown size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.1rem", marginBottom: 2 }}>{k.name}</h3>
                      {k.title && <span style={{ color: "var(--color-text-light)", fontSize: "0.85rem" }}>{k.title}</span>}
                    </div>
                  </div>
                  {k.reignStart && (
                    <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                      <Calendar size={14} /> {k.reignStart} — {k.reignEnd || "?"}
                    </p>
                  )}
                  {k.description && (
                    <p style={{ fontSize: "0.9rem", color: "var(--color-text)", marginBottom: 8 }}>{k.description}</p>
                  )}
                  <span className={`verification-badge verification-${k.verificationStatus}`}>
                    {k.verificationStatus}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Berikutnya</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
