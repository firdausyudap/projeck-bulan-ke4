import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminInscriptions() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = () => {
    setLoading(true);
    api.get("/inscriptions", { params: { limit: 50 } })
      .then((res) => {
        if (res.data.success) setItems(res.data.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchItems(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus prasasti ini?")) return;
    try {
      await api.delete(`/inscriptions/${id}`);
      fetchItems();
    } catch {
      alert("Gagal menghapus");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1>Prasasti</h1>
        <Link to="/admin/inscriptions/new" className="btn btn-primary"><Plus size={18} /> Tambah Prasasti</Link>
      </div>

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Lokasi</th>
              <th>Verifikasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((ins) => (
              <tr key={ins.id}>
                <td>{ins.name}</td>
                <td>{ins.location || "-"}</td>
                <td><span className={`verification-badge verification-${ins.verificationStatus}`}>{ins.verificationStatus}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link to={`/admin/inscriptions/${ins.id}/edit`} className="btn btn-outline btn-sm"><Pencil size={14} /></Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(ins.id)}><Trash2 size={14} /></button>
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
