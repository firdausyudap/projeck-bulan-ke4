import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminKings() {
  const [kings, setKings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchKings = () => {
    setLoading(true);
    api.get("/kings", { params: { limit: 50 } })
      .then((res) => {
        if (res.data.success) setKings(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchKings(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus data raja ini?")) return;
    try {
      await api.delete(`/kings/${id}`);
      fetchKings();
    } catch {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1>Raja & Tokoh</h1>
        <Link to="/admin/kings/new" className="btn btn-primary"><Plus size={18} /> Tambah Raja</Link>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Judul</th>
              <th>Verifikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {kings.map((k) => (
              <tr key={k.id}>
                <td>{k.name}</td>
                <td>{k.title || "-"}</td>
                <td><span className={`verification-badge verification-${k.verificationStatus}`}>{k.verificationStatus}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to={`/admin/kings/${k.id}/edit`} className="btn btn-outline btn-sm"><Pencil size={14} /></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(k.id)}><Trash2 size={14} /></button>
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
