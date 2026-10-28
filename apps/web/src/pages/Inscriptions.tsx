import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { Scroll, MapPin, Calendar } from "lucide-react";

const inscriptionImage = (slug: string) =>
  slug === "prasasti-kawali" ? "/images/kawali.jpg" : "/images/batutulis.jpg";

export default function Inscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.success) setCategories(res.data.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get("/inscriptions", { params: { page, limit: 12, search: search || undefined, category: category || undefined } })
      .then((res) => {
        if (res.data.success) {
          setItems(res.data.data || []);
          setTotalPages(res.data.meta?.totalPages || 1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, category]);

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 8 }}>Prasasti</h1>
      <p style={{ color: "var(--color-text-light)", marginBottom: 32 }}>Kumpulan prasasti dan inskripsi bersejarah</p>

      <div style={{ display: "flex", gap: 12, marginBottom: 32, flexWrap: "wrap" }}>
        <input
          className="input"
          placeholder="Cari prasasti..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ maxWidth: 300 }}
        />
        <select
          className="input"
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          style={{ maxWidth: 200 }}
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>Tidak ada prasasti</h3>
          <p>Data prasasti akan segera tersedia.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-3">
            {items.map((ins) => {
              const img = (ins.media && ins.media[0]?.url && !String(ins.media[0].url).includes("placehold.co"))
                ? ins.media[0].url
                : inscriptionImage(ins.slug);
              return (
                <Link to={`/inscriptions/${ins.slug}`} key={ins.id} className="card">
                  <img src={img} alt={ins.name} className="card-img" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/batutulis.jpg"; }} />
                  <div className="card-body">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <Scroll size={18} color="var(--color-gold)" />
                      <h3 style={{ fontSize: "1.1rem" }}>{ins.name}</h3>
                    </div>
                    {ins.location && (
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: 4, display: "flex", alignItems: "center", gap: 6 }}>
                        <MapPin size={14} /> {ins.location}
                      </p>
                    )}
                    {ins.dateEstimate && (
                      <p style={{ fontSize: "0.85rem", color: "var(--color-text-light)", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={14} /> {ins.dateEstimate}
                      </p>
                    )}
                    {ins.description && (
                      <p style={{ fontSize: "0.9rem", color: "var(--color-text)", marginBottom: 8 }}>{ins.description}</p>
                    )}
                    <span className={`verification-badge verification-${ins.verificationStatus}`}>{ins.verificationStatus}</span>
                  </div>
                </Link>
              );
            })}
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
