import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Save, ArrowLeft } from "lucide-react";

const verificationOptions = ["VERIFIED", "INTERPRETED", "ORAL_TRADITION", "LEGEND", "DISPUTED", "NEEDS_RESEARCH"];

export default function AdminInscriptionForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [location, setLocation] = useState("");
  const [discoveryLocation, setDiscoveryLocation] = useState("");
  const [dateEstimate, setDateEstimate] = useState("");
  const [script, setScript] = useState("");
  const [language, setLanguage] = useState("");
  const [transliteration, setTransliteration] = useState("");
  const [translation, setTranslation] = useState("");
  const [description, setDescription] = useState("");
  const [historicalContext, setHistoricalContext] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("NEEDS_RESEARCH");
  const [sourceNote, setSourceNote] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.success) setCategories(res.data.data || []);
    }).catch(() => {});

    if (isEdit) {
      setLoading(true);
      api.get(`/inscriptions/${id}`).then((res) => {
        if (res.data.success) {
          const ins = res.data.data;
          setName(ins.name); setSlug(ins.slug); setLocation(ins.location || "");
          setDiscoveryLocation(ins.discoveryLocation || ""); setDateEstimate(ins.dateEstimate || "");
          setScript(ins.script || ""); setLanguage(ins.language || "");
          setTransliteration(ins.transliteration || ""); setTranslation(ins.translation || "");
          setDescription(ins.description); setHistoricalContext(ins.historicalContext || "");
          setVerificationStatus(ins.verificationStatus); setSourceNote(ins.sourceNote || "");
          setCategoryId(ins.categoryId || "");
        }
      }).catch(() => setError("Gagal memuat data"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = { name, slug: slug || undefined, location, discoveryLocation, dateEstimate, script, language, transliteration, translation, description, historicalContext, verificationStatus, sourceNote, categoryId: categoryId || null };
      if (isEdit) {
        await api.patch(`/inscriptions/${id}`, data);
      } else {
        await api.post("/inscriptions", data);
      }
      navigate("/admin/inscriptions");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/admin/inscriptions" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 style={{ marginBottom: 24 }}>{isEdit ? "Edit Prasasti" : "Tambah Prasasti"}</h1>

      {error && <div style={{ background: "#f8d7da", color: "#721c24", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group"><label className="label">Nama</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="form-group"><label className="label">Slug (opsional)</label><input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        <div className="form-group"><label className="label">Lokasi</label><input className="input" value={location} onChange={(e) => setLocation(e.target.value)} /></div>
        <div className="form-group"><label className="label">Tempat Penemuan</label><input className="input" value={discoveryLocation} onChange={(e) => setDiscoveryLocation(e.target.value)} /></div>
        <div className="form-group"><label className="label">Perkiraan Tanggal</label><input className="input" value={dateEstimate} onChange={(e) => setDateEstimate(e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group"><label className="label">Aksara</label><input className="input" value={script} onChange={(e) => setScript(e.target.value)} /></div>
          <div className="form-group"><label className="label">Bahasa</label><input className="input" value={language} onChange={(e) => setLanguage(e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="label">Transliterasi</label><textarea className="input" value={transliteration} onChange={(e) => setTransliteration(e.target.value)} rows={4} /></div>
        <div className="form-group"><label className="label">Terjemahan</label><textarea className="input" value={translation} onChange={(e) => setTranslation(e.target.value)} rows={4} /></div>
        <div className="form-group"><label className="label">Deskripsi</label><textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required /></div>
        <div className="form-group"><label className="label">Konteks Sejarah</label><textarea className="input" value={historicalContext} onChange={(e) => setHistoricalContext(e.target.value)} rows={4} /></div>
        <div className="form-group">
          <label className="label">Kategori</label>
          <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Pilih kategori</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Status Verifikasi</label>
          <select className="input" value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value)}>
            {verificationOptions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="label">Catatan Sumber</label><textarea className="input" value={sourceNote} onChange={(e) => setSourceNote(e.target.value)} rows={2} /></div>
        <button className="btn btn-primary" disabled={saving}><Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}</button>
      </form>
    </div>
  );
}

