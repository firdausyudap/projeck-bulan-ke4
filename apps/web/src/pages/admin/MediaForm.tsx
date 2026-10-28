import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Save, ArrowLeft } from "lucide-react";

export default function AdminMediaForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("IMAGE");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [credit, setCredit] = useState("");
  const [source, setSource] = useState("");
  const [license, setLicense] = useState("");
  const [isIllustration, setIsIllustration] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      setLoading(true);
      api.get(`/media/${id}`).then((res) => {
        if (res.data.success) {
          const m = res.data.data;
          setTitle(m.title); setUrl(m.url); setType(m.type);
          setAltText(m.altText || ""); setCaption(m.caption || "");
          setCredit(m.credit || ""); setSource(m.source || "");
          setLicense(m.license || ""); setIsIllustration(m.isIllustration);
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
      const data = { title, url, type, altText, caption, credit, source, license, isIllustration };
      if (isEdit) {
        await api.patch(`/media/${id}`, data);
      } else {
        await api.post("/media", data);
      }
      navigate("/admin/media");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/admin/media" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 style={{ marginBottom: 24 }}>{isEdit ? "Edit Media" : "Tambah Media"}</h1>

      {error && <div style={{ background: "#f8d7da", color: "#721c24", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 16 }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group"><label className="label">Judul</label><input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
        <div className="form-group"><label className="label">URL</label><input className="input" value={url} onChange={(e) => setUrl(e.target.value)} required /></div>
        <div className="form-group">
          <label className="label">Tipe</label>
          <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
            <option value="IMAGE">Image</option>
            <option value="VIDEO">Video</option>
            <option value="DOCUMENT">Document</option>
            <option value="AUDIO">Audio</option>
          </select>
        </div>
        <div className="form-group"><label className="label">Alt Text</label><input className="input" value={altText} onChange={(e) => setAltText(e.target.value)} /></div>
        <div className="form-group"><label className="label">Caption</label><textarea className="input" value={caption} onChange={(e) => setCaption(e.target.value)} rows={2} /></div>
        <div className="form-group"><label className="label">Kredit</label><input className="input" value={credit} onChange={(e) => setCredit(e.target.value)} /></div>
        <div className="form-group"><label className="label">Sumber</label><input className="input" value={source} onChange={(e) => setSource(e.target.value)} /></div>
        <div className="form-group"><label className="label">Lisensi</label><input className="input" value={license} onChange={(e) => setLicense(e.target.value)} /></div>
        <div className="form-group">
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input type="checkbox" checked={isIllustration} onChange={(e) => setIsIllustration(e.target.checked)} />
            Ilustrasi
          </label>
        </div>
        <button className="btn btn-primary" disabled={saving}><Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}</button>
      </form>
    </div>
  );
}
