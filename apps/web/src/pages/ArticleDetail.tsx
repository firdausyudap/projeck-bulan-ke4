import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import api from "../api/client";
import { ArrowLeft, Calendar, User } from "lucide-react";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/articles/${slug}`)
      .then((res) => {
        if (res.data.success) setArticle(res.data.data);
        else setError(res.data.message || "Artikel tidak ditemukan");
      })
      .catch(() => setError("Artikel tidak ditemukan"))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="loading-container"><div className="spinner" /></div>;
  if (error || !article) return (
    <div className="container" style={{ padding: "60px 24px", textAlign: "center" }}>
      <h2>{error || "Artikel tidak ditemukan"}</h2>
      <Link to="/articles" className="btn btn-primary" style={{ marginTop: 16 }}>Kembali ke Artikel</Link>
    </div>
  );

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 800 }}>
      <Link to="/articles" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 24, color: "var(--color-text-light)" }}>
        <ArrowLeft size={16} /> Kembali ke Artikel
      </Link>

      {article.coverImage && (
        <img src={article.coverImage} alt={article.title} style={{ width: "100%", height: 400, objectFit: "cover", borderRadius: "var(--radius-lg)", marginBottom: 24 }} />
      )}

      <h1 style={{ marginBottom: 12 }}>{article.title}</h1>

      <div style={{ display: "flex", gap: 16, color: "var(--color-text-light)", fontSize: "0.9rem", marginBottom: 24, flexWrap: "wrap" }}>
        {article.author && <span><User size={14} style={{ verticalAlign: "middle" }} /> {article.author.name}</span>}
        {article.createdAt && <span><Calendar size={14} style={{ verticalAlign: "middle" }} /> {new Date(article.createdAt).toLocaleDateString("id-ID")}</span>}
        {article.category && <span className="badge badge-published">{article.category.name}</span>}
      </div>

      <div className="article-content">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      {article.tags && article.tags.length > 0 && (
        <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid var(--color-border)" }}>
          <strong>Tag:</strong>{" "}
          {article.tags.map((t: any) => (
            <span key={t.id} className="badge" style={{ background: "var(--color-cream)", color: "var(--color-text)", marginRight: 8 }}>
              {t.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
