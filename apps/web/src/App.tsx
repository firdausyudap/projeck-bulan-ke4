import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Articles from "./pages/Articles";
import ArticleDetail from "./pages/ArticleDetail";
import Kings from "./pages/Kings";
import KingDetail from "./pages/KingDetail";
import Inscriptions from "./pages/Inscriptions";
import InscriptionDetail from "./pages/InscriptionDetail";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminArticles from "./pages/admin/Articles";
import AdminArticleForm from "./pages/admin/ArticleForm";
import AdminKings from "./pages/admin/Kings";
import AdminKingForm from "./pages/admin/KingForm";
import AdminInscriptions from "./pages/admin/Inscriptions";
import AdminInscriptionForm from "./pages/admin/InscriptionForm";
import AdminCategories from "./pages/admin/Categories";
import AdminMedia from "./pages/admin/Media";
import AdminMediaForm from "./pages/admin/MediaForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/layout/AdminLayout";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          <Route path="/kings" element={<Kings />} />
          <Route path="/kings/:slug" element={<KingDetail />} />
          <Route path="/inscriptions" element={<Inscriptions />} />
          <Route path="/inscriptions/:slug" element={<InscriptionDetail />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Admin routes */}
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="articles" element={<AdminArticles />} />
            <Route path="articles/new" element={<AdminArticleForm />} />
            <Route path="articles/:id/edit" element={<AdminArticleForm />} />
            <Route path="kings" element={<AdminKings />} />
            <Route path="kings/new" element={<AdminKingForm />} />
            <Route path="kings/:id/edit" element={<AdminKingForm />} />
            <Route path="inscriptions" element={<AdminInscriptions />} />
            <Route path="inscriptions/new" element={<AdminInscriptionForm />} />
            <Route path="inscriptions/:id/edit" element={<AdminInscriptionForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="media/new" element={<AdminMediaForm />} />
            <Route path="media/:id/edit" element={<AdminMediaForm />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
