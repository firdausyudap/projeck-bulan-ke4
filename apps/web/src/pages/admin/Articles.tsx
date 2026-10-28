import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminArticles() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const fetchArticles = () => {
    setLoading(true);
    api.get("/articles", { params: { page, limit: 10, search: search || undefined } })
      .then((res) => {
        if (res.data.success) {
          setArticles(res.data.data || []);
          setTotalPages(res.data.meta?.totalPages || 1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchArticles(); }, [page, search]);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus artikel ini?")) return;
    try {
      await api.delete(`/articles/${id}`);
      fetchArticles();
    } catch (err) {
      alert("Gagal menghapus artikel");
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1>Artikel</h1>
        <Link to="/admin/articles/new" className="btn btn-primary"><Plus size={18} /> Tambah Artikel</Link>
      </div>

      <input
        className="input"
        placeholder="Cari artikel..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        style={{ maxWidth: 300, marginBottom: 20 }}
      />

      {loading ? (
        <div className="loading-container"><div className="spinner" /></div>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>Judul</th>
                <th>Status</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((a) => (
                <tr key={a.id}>
                  <td>{a.title}</td>
                  <td><span className={`badge badge-${a.status.toLowerCase()}`}>{a.status}</span></td>
                  <td>{a.category?.name || "-"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Link to={`/admin/articles/${a.id}/edit`} className="btn btn-outline btn-sm"><Pencil size={14} /></Link>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(a.id)}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Sebelumnya</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === page ? "active" : ""} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Berikutnya</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
