import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: "60px 24px", maxWidth: 480 }}>
      <div className="card" style={{ padding: 32 }}>
        <h1 style={{ textAlign: "center", marginBottom: 8 }}>Masuk</h1>
        <p style={{ textAlign: "center", color: "var(--color-text-light)", marginBottom: 24 }}>Masuk ke akun Anda</p>

        {error && (
          <div style={{ background: "#f8d7da", color: "#721c24", padding: 12, borderRadius: "var(--radius-md)", marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
            <LogIn size={18} /> {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: 16, color: "var(--color-text-light)" }}>
          Belum punya akun? <Link to="/register" style={{ color: "var(--color-gold)" }}>Daftar</Link>
        </p>
      </div>
    </div>
  );
}
