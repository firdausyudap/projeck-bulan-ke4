import { Outlet, Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, User, Shield, Crown } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Beranda" },
    { to: "/articles", label: "Artikel" },
    { to: "/kings", label: "Raja" },
    { to: "/inscriptions", label: "Prasasti" },
    { to: "/gallery", label: "Galeri" },
  ];

  const isActiveLink = (to: string) =>
    location.pathname === to || (to !== "/" && location.pathname.startsWith(to));

  const closeMobileMenu = () => setMobileOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-50 bg-background text-cream shadow-md">
        <div className="relative mx-auto flex h-[72px] w-full max-w-[1280px] items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2 font-heading text-xl font-bold text-gold transition-colors hover:text-gold-light sm:text-2xl">
            <Crown size={24} className="shrink-0" aria-hidden="true" />
            <span>
              <span className="text-cream">Pajajaran</span>{" "}
              <span className="text-gold">Digital</span>
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-cream transition-colors hover:bg-surface hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold md:hidden"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={mobileOpen}
            aria-controls="primary-navigation"
          >
            {mobileOpen ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>

          <div
            id="primary-navigation"
            className={`absolute left-0 right-0 top-full z-50 flex-col gap-2 border-t border-white/10 bg-background p-4 shadow-lg md:static md:z-auto md:flex md:flex-row md:items-center md:gap-6 md:border-0 md:bg-transparent md:p-0 md:shadow-none ${mobileOpen ? "flex" : "hidden"}`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded px-2 py-2 font-medium transition-colors hover:text-gold md:px-0 md:py-1 ${isActiveLink(link.to) ? "text-gold" : "text-cream"}`}
                aria-current={isActiveLink(link.to) ? "page" : undefined}
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center gap-1 rounded px-2 py-2 font-medium text-cream transition-colors hover:text-gold md:px-0 md:py-1" onClick={closeMobileMenu}>
                    <Shield size={16} className="shrink-0" aria-hidden="true" />
                    Admin
                  </Link>
                )}
                <Link to="/profile" className="flex items-center gap-1 rounded px-2 py-2 font-medium text-cream transition-colors hover:text-gold md:px-0 md:py-1" onClick={closeMobileMenu}>
                  <User size={16} className="shrink-0" aria-hidden="true" />
                  {user.name}
                </Link>
                <button
                  type="button"
                  className="flex items-center gap-1 rounded px-2 py-2 text-left font-medium text-cream transition-colors hover:text-gold md:px-0 md:py-1"
                  onClick={() => { logout(); closeMobileMenu(); }}
                >
                  <LogOut size={16} aria-hidden="true" /> Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="rounded-md bg-gold px-4 py-2 text-center font-semibold text-background transition-colors hover:bg-gold-light" onClick={closeMobileMenu}>Masuk</Link>
                <Link to="/register" className="rounded px-2 py-2 font-medium text-cream transition-colors hover:text-gold md:px-0 md:py-1" onClick={closeMobileMenu}>Daftar</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="mt-10 bg-background py-12 text-cream">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="mb-4 font-heading text-lg font-semibold text-gold">Pajajaran Digital</h4>
              <p className="text-sm leading-relaxed text-muted">
                Ensiklopedia digital tentang sejarah Kerajaan Sunda dan Pajajaran.
              </p>
            </div>
            <div>
              <h4 className="mb-4 font-heading text-lg font-semibold text-gold">Navigasi</h4>
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="w-fit text-sm text-muted transition-colors hover:text-gold">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="mb-4 font-heading text-lg font-semibold text-gold">Sumber</h4>
              <p className="text-sm leading-relaxed text-muted">
                Data sejarah didasarkan pada sumber-sumber yang tersedia secara publik.
                Fakta yang belum terverifikasi ditandai dengan status verifikasi.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-white/10 pt-6 text-center text-sm text-muted">
            &copy; {new Date().getFullYear()} Pajajaran Digital. Ensiklopedia Sejarah Sunda.
          </div>
        </div>
      </footer>
    </>
  );
}
