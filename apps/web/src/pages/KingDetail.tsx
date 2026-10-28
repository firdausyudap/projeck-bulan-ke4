import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { ArrowLeft, Crown } from "lucide-react";

export default function KingDetail() {
  const { slug } = useParams();
  const [king, setKing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/kings/${slug}`)
      .then((res) => {
        if (res.data.success) setKing(res.data.data);
        else setError(res.data.message || "Data tidak ditemukan");
      })
      .catch(() => setError("Data tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (error || !king) return (
    <div className="container" style={{ padding: "60px 24px", textAlign: "center" }}>
      <h2>{error || "Data tidak ditemukan"}</h2>
      <Link to="/kings" className="btn btn-primary" style={{ marginTop: 16 }}>Kembali</Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 800 }}>
      <Link to="/kings" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali ke Daftar Raja
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--color-cream)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-gold)" }}>
          <Crown size={40} />
        </div>
        <div>
          <h1 style={{ marginBottom: 4 }}>{king.name}</h1>
          {king.title && <p style={{ color: "var(--color-text-light)" }}>{king.title}</p>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {king.reignStart && <div><strong>Masa Pemerintahan:</strong> {king.reignStart} — {king.reignEnd || "?"}</div>}
        {king.birthYear && <div><strong>Tahun Lahir:</strong> {king.birthYear}</div>}
        {king.deathYear && <div><strong>Tahun Wafat:</strong> {king.deathYear}</div>}
        {king.birthPlace && <div><strong>Tempat Lahir:</strong> {king.birthPlace}</div>}
        {king.deathPlace && <div><strong>Tempat Wafat:</strong> {king.deathPlace}</div>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <span className={`verification-badge verification-${king.verificationStatus}`}>{king.verificationStatus}</span>
      </div>

      {king.description && (
        <div style={{ marginBottom: 24 }}>
          <h3>Deskripsi</h3>
          <p>{king.description}</p>
        </div>
      )}

      {king.biography && (
        <div style={{ marginBottom: 24 }}>
          <h3>Biografi</h3>
          <p style={{ whiteSpace: "pre-line" }}>{king.biography}</p>
        </div>
      )}

      {king.achievements && (
        <div style={{ marginBottom: 24 }}>
          <h3>Prestasi</h3>
          <p style={{ whiteSpace: "pre-line" }}>{king.achievements}</p>
        </div>
      )}

      {king.sourceNote && (
        <div style={{ marginTop: 24, padding: 16, background: "var(--color-cream)", borderRadius: "var(--radius-md)" }}>
          <strong>Sumber:</strong> {king.sourceNote}
        </div>
      )}

      {king.relationsFrom && king.relationsFrom.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Relasi Keluarga (dari)</h3>
          <ul>
            {king.relationsFrom.map((r: any) => (
              <li key={r.id}>{r.relationType} → {r.toKing?.name} {r.sourceNote && `(${r.sourceNote})`}</li>
            ))}
          </ul>
        </div>
      )}

      {king.relationsTo && king.relationsTo.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3>Relasi Keluarga (ke)</h3>
          <ul>
            {king.relationsTo.map((r: any) => (
              <li key={r.id}>{r.fromKing?.name} → {r.relationType} {r.sourceNote && `(${r.sourceNote})`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
