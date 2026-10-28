import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminMedia() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    api.get("/media", { params: { limit: 50 } })
      .then((res) => {
        if (res.data.success) setItems(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus media ini?")) return;
    try {
      await api.delete(`/media/${id}`);
      fetchItems();
    } catch {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1>Media</h1>
        <Link to="/admin/media/new" className="btn btn-primary"><Plus size={18} /> Tambah Media</Link>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Judul</th>
              <th>Tipe</th>
              <th>URL</th>
              <th>Ilustrasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((m) => (
              <tr key={m.id}>
                <td>{m.title}</td>
                <td>{m.type}</td>
                <td style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.url}</td>
                <td>{m.isIllustration ? "Ya" : "Tidak"}</td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to={`/admin/media/${m.id}/edit`} className="btn btn-outline btn-sm"><Pencil size={14} /></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
