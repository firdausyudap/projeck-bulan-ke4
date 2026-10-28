import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import { Calendar, Search, RotateCcw } from "lucide-react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: string;
  category?: { name: string; slug: string };
  createdAt: string;
}

const articleImage = (slug: string) =>
  slug === "pakuan-pajajaran-ibu-kota" ? "/images/batutulis.jpg" : "/images/sunda.jpg";

export default function Articles() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("desc");

  useEffect(() => {
    api.get("/categories").then((res) => {
      if (res.data.success) setCategories(res.data.data || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.get("/articles", { params: { page, limit: 8, search: search || undefined, category: category || undefined, sort } })
      .then((res) => {
        if (res.data.success) {
          setArticles(res.data.data || []);
          setTotalPages(res.data.meta?.totalPages || 1);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search, category, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleReset = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setSort("desc");
    setPage(1);
  };

  return (
    <>
      <section className="articles-hero">
        <div className="container articles-hero-content">
          <span className="hero-label">ARTIKEL & PUSTAKA</span>
          <h1>Artikel Sejarah</h1>
          <p>
            Temukan berbagai artikel menarik tentang sejarah, raja-raja, prasasti, dan peninggalan
            Kerajaan Sunda dan Pajajaran.
          </p>
        </div>
      </section>

      <section className="articles-toolbar-section">
        <div className="container">
          <form className="articles-toolbar" onSubmit={handleSearch}>
            <div className="toolbar-search">
              <Search size={16} />
              <input
                className="input"
                placeholder="Cari artikel..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <select
              className="input toolbar-select"
              value={category}
              onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            >
              <option value="">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            <select
              className="input toolbar-select"
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
            >
              <option value="desc">Terbaru</option>
              <option value="asc">Terlama</option>
            </select>
            <button type="submit" className="btn btn-gold toolbar-btn">Cari</button>
            <button type="button" className="btn btn-outline toolbar-btn" onClick={handleReset}>
              <RotateCcw size={16} /> Reset
            </button>
          </form>
        </div>
      </section>

      <section className="articles-content">
        <div className="container">
          {loading ? (
            <div className="loading-container"><div className="spinner" /></div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <h3>Tidak ada artikel ditemukan</h3>
              <p>Coba ubah kata kunci atau filter.</p>
            </div>
          ) : (
            <>
              <div className="articles-grid">
                {articles.map((a) => (
                  <Link to={`/articles/${a.slug}`} key={a.id} className="article-card">
                    <div className="article-card-media">
                      <img
                        src={a.coverImage || articleImage(a.slug)}
                        alt={a.title}
                        loading="lazy"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = "/images/sunda.jpg";
                        }}
                      />
                    </div>
                    <div className="card-body">
                      {a.category?.name && (
                        <span className="article-badge">{a.category.name}</span>
                      )}
                      <h3 className="card-title">{a.title}</h3>
                      {a.excerpt && <p className="article-excerpt">{a.excerpt}</p>}
                      <div className="card-meta" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Calendar size={14} /> {new Date(a.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

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
      </section>
    </>
  );
}
