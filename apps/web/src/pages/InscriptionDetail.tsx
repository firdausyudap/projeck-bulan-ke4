import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/client";
import { ArrowLeft, Scroll } from "lucide-react";

export default function InscriptionDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/inscriptions/${slug}`)
      .then((res) => {
        if (res.data.success) setItem(res.data.data);
        else setError(res.data.message || "Data tidak ditemukan");
      })
      .catch(() => setError("Data tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (error || !item) return (
    <div className="container" style={{ padding: "60px 24px", textAlign: "center" }}>
      <h2>{error || "Data tidak ditemukan"}</h2>
      <Link to="/inscriptions" className="btn btn-primary" style={{ marginTop: 16 }}>Kembali</Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 800 }}>
      <Link to="/inscriptions" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali ke Daftar Prasasti
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ color: "var(--color-gold)" }}><Scroll size={40} /></div>
        <h1 style={{ marginBottom: 0 }}>{item.name}</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
        {item.location && <div><strong>Lokasi:</strong> {item.location}</div>}
        {item.discoveryLocation && <div><strong>Tempat Penemuan:</strong> {item.discoveryLocation}</div>}
        {item.dateEstimate && <div><strong>Perkiraan Tanggal:</strong> {item.dateEstimate}</div>}
        {item.script && <div><strong>Aksara:</strong> {item.script}</div>}
        {item.language && <div><strong>Bahasa:</strong> {item.language}</div>}
        {item.category && <div><strong>Kategori:</strong> {item.category.name}</div>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <span className={`verification-badge verification-${item.verificationStatus}`}>{item.verificationStatus}</span>
      </div>

      {item.description && (
        <div style={{ marginBottom: 24 }}>
          <h3>Deskripsi</h3>
          <p>{item.description}</p>
        </div>
      )}

      {item.transliteration && (
        <div style={{ marginBottom: 24 }}>
          <h3>Transliterasi</h3>
          <p style={{ whiteSpace: "pre-line", fontFamily: "monospace", background: "var(--color-cream)", padding: 16, borderRadius: "var(--radius-md)" }}>{item.transliteration}</p>
        </div>
      )}

      {item.translation && (
        <div style={{ marginBottom: 24 }}>
          <h3>Terjemahan</h3>
          <p style={{ whiteSpace: "pre-line" }}>{item.translation}</p>
        </div>
      )}

      {item.historicalContext && (
        <div style={{ marginBottom: 24 }}>
          <h3>Konteks Sejarah</h3>
          <p style={{ whiteSpace: "pre-line" }}>{item.historicalContext}</p>
        </div>
      )}

      {item.sourceNote && (
        <div style={{ marginTop: 24, padding: 16, background: "var(--color-cream)", borderRadius: "var(--radius-md)" }}>
          <strong>Sumber:</strong> {item.sourceNote}
        </div>
      )}
    </div>
  );
}
