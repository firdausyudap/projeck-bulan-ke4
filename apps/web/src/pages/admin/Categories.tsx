import { useState, useEffect } from "react";
import api from "../../api/client";
import { Plus, Trash2 } from "lucide-react";

export default function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    api.get("/categories")
      .then((res) => {
        if (res.data.success) setCategories(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/categories", { name, slug: slug || undefined, description, color });
      setName(""); setSlug(""); setDescription(""); setColor("");
      fetchCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal membuat kategori");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus kategori ini?")) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Kategori</h1>

      <div className="card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ marginBottom: 16 }}>Tambah Kategori</h3>
        <form onSubmit={handleCreate} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 12, alignItems: "end" }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Nama</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Slug</label>
            <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Deskripsi</label>
            <input className="input" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="label">Warna</label>
            <input className="input" value={color} onChange={(e) => setColor(e.target.value)} placeholder="#102B20" />
          </div>
          <button className="btn btn-primary" type="submit"><Plus size={18} /></button>
        </form>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Slug</th>
              <th>Deskripsi</th>
              <th>Warna</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.description || "-"}</td>
                <td>
                  {c.color && <span style={{ display: "inline-block", width: 20, height: 20, background: c.color, borderRadius: 4 }} />}
                </td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
