import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="container" style={{ padding: "40px 24px", maxWidth: 600 }}>
      <h1 style={{ marginBottom: 24 }}>Profil Saya</h1>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ marginBottom: 16 }}>
          <strong>Nama:</strong> {user?.name}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Email:</strong> {user?.email}
        </div>
        <div style={{ marginBottom: 16 }}>
          <strong>Role:</strong> {user?.role}
        </div>
        {user?.bio && (
          <div style={{ marginBottom: 16 }}>
            <strong>Bio:</strong> {user.bio}
          </div>
        )}
      </div>
    </div>
  );
}
