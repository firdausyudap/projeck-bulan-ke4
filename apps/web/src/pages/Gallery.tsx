import { useState, useEffect } from "react";
import api from "../api/client";
import { Play, X } from "lucide-react";

export default function Gallery() {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [lightbox, setLightbox] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api.get("/media", { params: { limit: 50, type: filter || undefined } })
      .then((res) => {
        if (res.data.success) setMedia(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  return (
    <div className="container" style={{ padding: "40px 24px" }}>
      <h1 style={{ marginBottom: 8 }}>Galeri</h1>
      <p style={{ color: "var(--color-text-light)", marginBottom: 32 }}>Koleksi foto dan video dokumenter</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
        {["", "IMAGE", "VIDEO"].map((t) => (
          <button
            key={t}
            className={`btn ${filter === t ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter(t)}
          >
            {t === "" ? "Semua" : t === "IMAGE" ? "Foto" : "Video"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : media.length === 0 ? (
        <div className="empty-state">
          <h3>Tidak ada media</h3>
          <p>Media akan segera tersedia.</p>
        </div>
      ) : (
<div className="grid grid-4">
          {media.map((m) => (
            <div key={m.id} className="card" style={{ cursor: "pointer" }} onClick={() => m.type === "IMAGE" && setLightbox(m.url)}>
              {m.type === "IMAGE" ? (
                <img src={m.url} alt={m.altText || m.title} className="card-img" loading="lazy" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/sunda.jpg"; }} />
              ) : (
                <div style={{ height: 200, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                  <Play size={48} />
                </div>
              )}
              <div className="card-body">
                <h4 style={{ fontSize: "0.95rem", marginBottom: 4 }}>{m.title}</h4>
                {m.isIllustration && <span className="badge" style={{ marginRight: 6 }}>Ilustrasi</span>}
                {m.credit && <p style={{ fontSize: "0.75rem", color: "var(--color-text-light)" }}>Kredit: {m.credit}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}><X size={32} /></button>
          <img src={lightbox} alt="Preview" />
        </div>
      )}
    </div>
  );
}
