import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Save, ArrowLeft } from "lucide-react";

const verificationOptions = ["VERIFIED", "INTERPRETED", "ORAL_TRADITION", "LEGEND", "DISPUTED", "NEEDS_RESEARCH"];

export default function AdminKingForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [reignStart, setReignStart] = useState("");
  const [reignEnd, setReignEnd] = useState("");
  const [birthYear, setBirthYear] = useState("");
  const [deathYear, setDeathYear] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [deathPlace, setDeathPlace] = useState("");
  const [description, setDescription] = useState("");
  const [biography, setBiography] = useState("");
  const [achievements, setAchievements] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("NEEDS_RESEARCH");
  const [sourceNote, setSourceNote] = useState("");
  const [portraitUrl, setPortraitUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/kings/${id}`).then((res) => {
        if (res.data.success) {
          const k = res.data.data;
          setName(k.name); setTitle(k.title || ""); setSlug(k.slug);
          setReignStart(k.reignStart || ""); setReignEnd(k.reignEnd || "");
          setBirthYear(k.birthYear || ""); setDeathYear(k.deathYear || "");
          setBirthPlace(k.birthPlace || ""); setDeathPlace(k.deathPlace || "");
          setDescription(k.description); setBiography(k.biography || "");
          setAchievements(k.achievements || ""); setVerificationStatus(k.verificationStatus);
          setSourceNote(k.sourceNote || ""); setPortraitUrl(k.portraitUrl || "");
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
      const data = { name, title, slug: slug || undefined, reignStart, reignEnd, birthYear, deathYear, birthPlace, deathPlace, description, biography, achievements, verificationStatus, sourceNote, portraitUrl: portraitUrl || undefined };
      if (isEdit) {
        await api.patch(`/kings/${id}`, data);
      } else {
        await api.post("/kings", data);
      }
      navigate("/admin/kings");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/admin/kings" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 style={{ marginBottom: 24 }}>{isEdit ? "Edit Raja" : "Tambah Raja"}</h1>

      {error && <div style={{ background: "#f8d7da", color: "#721c24", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group"><label className="label">Nama</label><input className="input" value={name} onChange={(e) => setName(e.target.value)} required /></div>
        <div className="form-group"><label className="label">Gelar/Judul</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div className="form-group"><label className="label">Slug (opsional)</label><input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group"><label className="label">Masa Pemerintahan (mulai)</label><input className="input" value={reignStart} onChange={(e) => setReignStart(e.target.value)} /></div>
          <div className="form-group"><label className="label">Masa Pemerintahan (akhir)</label><input className="input" value={reignEnd} onChange={(e) => setReignEnd(e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group"><label className="label">Tahun Lahir</label><input className="input" value={birthYear} onChange={(e) => setBirthYear(e.target.value)} /></div>
          <div className="form-group"><label className="label">Tahun Wafat</label><input className="input" value={deathYear} onChange={(e) => setDeathYear(e.target.value)} /></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div className="form-group"><label className="label">Tempat Lahir</label><input className="input" value={birthPlace} onChange={(e) => setBirthPlace(e.target.value)} /></div>
          <div className="form-group"><label className="label">Tempat Wafat</label><input className="input" value={deathPlace} onChange={(e) => setDeathPlace(e.target.value)} /></div>
        </div>
        <div className="form-group"><label className="label">Deskripsi</label><textarea className="input" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} required /></div>
        <div className="form-group"><label className="label">Biografi</label><textarea className="input" value={biography} onChange={(e) => setBiography(e.target.value)} rows={5} /></div>
        <div className="form-group"><label className="label">Prestasi</label><textarea className="input" value={achievements} onChange={(e) => setAchievements(e.target.value)} rows={3} /></div>
        <div className="form-group">
          <label className="label">Status Verifikasi</label>
          <select className="input" value={verificationStatus} onChange={(e) => setVerificationStatus(e.target.value)}>
            {verificationOptions.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="label">Catatan Sumber</label><textarea className="input" value={sourceNote} onChange={(e) => setSourceNote(e.target.value)} rows={2} /></div>
        <div className="form-group"><label className="label">URL Potret</label><input className="input" value={portraitUrl} onChange={(e) => setPortraitUrl(e.target.value)} /></div>
        <button className="btn btn-primary" disabled={saving}><Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}</button>
      </form>
    </div>
  );
}

