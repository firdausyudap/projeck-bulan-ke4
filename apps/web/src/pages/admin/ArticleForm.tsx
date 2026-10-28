import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/client";
import { Save, ArrowLeft } from "lucide-react";

export default function AdminArticleForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("DRAFT");
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
      api.get(`/articles/${id}`).then((res) => {
        if (res.data.success) {
          const a = res.data.data;
          setTitle(a.title);
          setSlug(a.slug);
          setExcerpt(a.excerpt || "");
          setContent(a.content);
          setCoverImage(a.coverImage || "");
          setStatus(a.status);
          setCategoryId(a.categoryId || "");
        }
      }).catch(() => setError("Gagal memuat artikel"))
        .finally(() => setLoading(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const data = { title, slug: slug || undefined, excerpt, content, coverImage: coverImage || undefined, status, categoryId: categoryId || null };
      if (isEdit) {
        await api.patch(`/articles/${id}`, data);
      } else {
        await api.post("/articles", data);
      }
      navigate("/admin/articles");
    } catch (err: any) {
      setError(err.response?.data?.message || "Gagal menyimpan artikel");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;

  return (
    <div>
      <Link to="/admin/articles" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali
      </Link>
      <h1 style={{ marginBottom: 24 }}>{isEdit ? "Edit Artikel" : "Tambah Artikel"}</h1>

      {error && (
        <div style={{ background: "#f8d7da", color: "#721c24", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 16 }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Judul</label>
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Slug (opsional)</label>
          <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Excerpt</label>
          <textarea className="input" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2} />
        </div>
        <div className="form-group">
          <label className="label">Konten (Markdown)</label>
          <textarea className="input" value={content} onChange={(e) => setContent(e.target.value)} rows={12} required />
        </div>
        <div className="form-group">
          <label className="label">Cover Image URL</label>
          <input className="input" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="label">Kategori</label>
          <select className="input" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Pilih kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="label">Status</label>
          <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
        <button className="btn btn-primary" disabled={saving}>
          <Save size={18} /> {saving ? "Menyimpan..." : "Simpan"}
        </button>
      </form>
    </div>
  );
}
