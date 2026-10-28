import { Link } from "react-router-dom";
import { BookOpen, Crown, Scroll, Image as ImageIcon, Calendar, ArrowRight } from "lucide-react";
import api from "../api/client";
import { useState, useEffect } from "react";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  status: string;
  createdAt: string;
  category?: { name: string; slug?: string };
}

interface King {
  id: string;
  name: string;
  slug: string;
  title?: string;
  portraitUrl?: string;
  reignStart?: string;
  reignEnd?: string;
  description?: string;
}

const kingFallbackImage = (slug: string) =>
  slug?.includes("siliwangi") ? "/images/king-siliwangi.svg" : "/images/king-jayabhupati.svg";

const articleImage = (slug: string) => {
  if (slug === "pakuan-pajajaran-ibu-kota") return "/images/batutulis.jpg";
  if (slug === "pengantar-kerajaan-sunda") return "/images/sunda.jpg";
  return "/images/sunda.jpg";
};

const categories = [
  { icon: <BookOpen size={24} />, title: "Artikel", desc: "Membaca berbagai artikel sejarah Pajajaran.", link: "/articles", image: "/images/sunda.jpg" },
  { icon: <Crown size={24} />, title: "Raja", desc: "Mengenal para raja yang tercatat dalam sejarah Sunda dan Pajajaran.", link: "/kings", image: "/images/hero-pajajaran.png" },
  { icon: <Scroll size={24} />, title: "Prasasti", desc: "Menelusuri prasasti dan peninggalan sejarah.", link: "/inscriptions", image: "/images/batutulis.jpg" },
  { icon: <ImageIcon size={24} />, title: "Galeri", desc: "Koleksi foto dan video sejarah Pajajaran.", link: "/gallery", image: "/images/hero.jpg" },
];

function KingPortrait({ king }: { king: King }) {
  const [useIllustration, setUseIllustration] = useState(!king.portraitUrl);

  return (
    <div className="relative h-full w-[38%] min-w-[112px] shrink-0 overflow-hidden bg-surface">
      <img
        src={useIllustration ? kingFallbackImage(king.slug) : king.portraitUrl}
        alt={useIllustration ? `Ilustrasi ${king.name}, bukan potret autentik` : king.name}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={() => {
          if (!useIllustration) setUseIllustration(true);
        }}
      />
      {useIllustration && (
        <span className="absolute inset-x-0 bottom-0 bg-background/85 px-1.5 py-1 text-center text-[9px] leading-tight text-cream/90">
          Ilustrasi, bukan potret autentik
        </span>
      )}
    </div>
  );
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [featuredKings, setFeaturedKings] = useState<King[]>([]);
  const [kingsLoading, setKingsLoading] = useState(true);

  useEffect(() => {
    api.get("/articles", { params: { limit: 4 } })
      .then((res) => {
        if (res.data.success) setArticles(res.data.data || []);
      })
      .catch(() => setHasError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    api.get("/kings", { params: { limit: 3 } })
      .then((res) => {
        if (res.data.success) setFeaturedKings(res.data.data || []);
      })
      .catch(() => setFeaturedKings([]))
      .finally(() => setKingsLoading(false));
  }, []);

  return (
    <>
      <section className="relative isolate flex min-h-[390px] items-center overflow-hidden bg-background text-cream sm:h-[410px] sm:min-h-[410px] lg:h-[400px] lg:min-h-[400px]">
        <img
          src="/images/hero-pajajaran.png"
          alt="Lanskap pegunungan berkabut dengan perkampungan dan susunan batu"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[72%_center] brightness-110 motion-safe:animate-slow-zoom sm:object-[58%_center] lg:object-center"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/95 via-background/45 to-background/5" />
        <div className="absolute inset-x-0 bottom-0 z-0 h-20 bg-gradient-to-b from-transparent to-background" />
        <div className="pointer-events-none absolute right-[-8rem] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full border border-gold/20 lg:block" />
        <div className="pointer-events-none absolute right-[-4rem] top-1/2 hidden h-[26rem] w-[26rem] -translate-y-1/2 rounded-full border border-gold/10 lg:block" />
        <div aria-hidden="true" className="pointer-events-none absolute right-5 top-5 hidden h-20 w-20 text-gold/40 sm:block lg:right-12 lg:top-12">
          <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="0.8">
            <path d="M40 2 78 40 40 78 2 40 40 2Zm0 12 26 26-26 26-26-26 26-26ZM40 2v12m0 52v12M2 40h12m52 0h12M14 14l26 26 26-26M14 66l26-26 26 26" />
          </svg>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-7">
          <div className="w-full min-w-0 max-w-3xl">
            <span className="mb-5 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold sm:text-sm">
              <span className="h-px w-10 bg-gold" />
              Warisan Sejarah Nusantara
            </span>
            <h1 className="mb-6 max-w-3xl font-heading text-3xl font-bold leading-tight motion-safe:animate-fade-in sm:text-5xl lg:text-6xl">
              <span className="block text-cream">Menelusuri Jejak</span>
              <span className="block text-gold">Kerajaan Pajajaran</span>
            </h1>
            <p className="w-full min-w-0 max-w-2xl break-words text-base leading-relaxed text-cream/85 motion-safe:animate-fade-in-delayed sm:text-lg">
              Jelajahi kisah Kerajaan Sunda dan Pajajaran melalui sumber sejarah, riwayat para raja,
              prasasti, serta peninggalan budaya yang masih dapat ditelusuri.
            </p>
            <div className="mt-9 flex flex-col gap-3 motion-safe:animate-fade-in-later sm:flex-row sm:gap-4">
              <Link
                to="/articles"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-gold px-5 py-3 font-semibold text-background transition duration-300 hover:bg-gold-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none sm:w-auto"
              >
                Jelajahi Sejarah <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <a
                href="#tentang-pajajaran"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-cream/50 px-5 py-3 font-semibold text-cream transition duration-300 hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none sm:w-auto"
              >
                <BookOpen size={16} aria-hidden="true" /> Tentang Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-2 pt-2 sm:px-6 sm:pb-2 sm:pt-2">
        <div className="mx-auto max-w-[1344px]">
          <div className="mb-2 flex items-center gap-3">
            <span className="h-7 w-1 rounded-full bg-gold" />
            <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">Kategori</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {categories.map((cat) => (
              <Link
                to={cat.link}
                key={cat.title}
                className="group relative flex h-[122px] w-full min-w-0 flex-col justify-between overflow-hidden rounded-lg border border-gold/35 bg-surface p-3.5 text-cream shadow-sm transition duration-300 hover:border-gold/70 hover:shadow-lg motion-safe:hover:-translate-y-1 motion-reduce:transition-none"
              >
                <img src={cat.image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:brightness-110 motion-reduce:transition-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/55 to-background/20" />
                <span className="relative z-10 inline-flex h-8 w-8 items-center justify-center text-gold">
                  {cat.icon}
                </span>
                <div className="relative z-10">
                  <h3 className="font-heading text-lg font-semibold text-cream">{cat.title}</h3>
                  <p className="mt-0.5 w-full min-w-0 break-words line-clamp-2 text-xs leading-snug text-cream/80">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background px-4 pb-2 pt-0 sm:px-6 sm:pb-2 sm:pt-0">
        <div className="mx-auto max-w-[1344px]">
          <div className="mb-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-7 w-1 rounded-full bg-gold" />
              <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">Artikel Terbaru</h2>
            </div>
            <Link to="/articles" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-light">
              Lihat Semua <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-10" role="status" aria-label="Memuat artikel">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted/30 border-t-gold motion-reduce:animate-none" />
            </div>
          ) : hasError ? (
            <div className="rounded-lg border border-white/10 bg-surface px-6 py-8 text-center">
              <h3 className="font-heading text-xl font-semibold text-cream">Artikel belum dapat dimuat</h3>
              <p className="mt-2 text-muted">Silakan coba kembali beberapa saat lagi.</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-surface px-6 py-8 text-center">
              <h3 className="font-heading text-xl font-semibold text-cream">Belum ada artikel</h3>
              <p className="mt-2 text-muted">Artikel akan segera tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {articles.map((article) => (
                <Link
                  to={`/articles/${article.slug}`}
                  key={article.id}
                  className="group overflow-hidden rounded-lg border border-gold/20 bg-surface transition duration-300 hover:border-gold/50 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                  <div className="relative aspect-[3.7/1] overflow-hidden bg-surface">
                    <img
                      src={article.coverImage || articleImage(article.slug)}
                      alt={article.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105 motion-reduce:transition-none"
                      onError={(event) => {
                        (event.currentTarget as HTMLImageElement).src = "/images/sunda.jpg";
                      }}
                    />
                    {article.category?.name && (
                      <span className="absolute left-3 top-3 inline-flex rounded-full bg-gold px-2 py-0.5 text-[11px] font-semibold text-background">
                        {article.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-2.5">
                    <h3 className="line-clamp-1 font-heading text-sm font-semibold leading-snug text-cream transition-colors group-hover:text-gold">
                      {article.title}
                    </h3>
                    {article.excerpt && <p className="mt-1 line-clamp-2 text-[13px] leading-snug text-muted">{article.excerpt}</p>}
                    {article.createdAt && (
                      <div className="mt-1.5 flex items-center gap-2 text-xs text-muted">
                        <Calendar size={14} aria-hidden="true" />
                        {new Date(article.createdAt).toLocaleDateString("id-ID")}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {!kingsLoading && featuredKings.length > 0 && (
        <section className="bg-background px-4 pb-7 pt-3 sm:px-6 sm:pb-8 sm:pt-3">
          <div className="mx-auto max-w-[1344px]">
            <div className="mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="h-7 w-1 rounded-full bg-gold" />
                <h2 className="font-heading text-2xl font-semibold text-cream sm:text-3xl">Raja-Raja Pajajaran</h2>
              </div>
              <Link to="/kings" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-gold-light">
                Lihat Semua <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {featuredKings.map((king) => (
                <Link
                  to={`/kings/${king.slug}`}
                  key={king.id}
                  className="group flex min-h-[122px] overflow-hidden rounded-lg border border-gold/20 bg-surface transition duration-300 hover:border-gold/50 motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none"
                >
                  <KingPortrait king={king} />
                  <div className="min-w-0 self-center p-3 sm:p-3.5">
                    {king.title && <p className="mb-1 line-clamp-1 text-xs font-medium text-gold">{king.title}</p>}
                    <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug text-cream transition-colors group-hover:text-gold sm:text-lg">{king.name}</h3>
                    {king.reignStart && (
                      <p className="mt-1 text-xs text-gold-light">
                        {king.reignStart}{king.reignEnd ? ` - ${king.reignEnd}` : ""}
                      </p>
                    )}
                    {king.description && <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-muted">{king.description}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="tentang-pajajaran" className="border-t border-gold/15 bg-background px-4 py-7 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-[1344px] border-l-2 border-gold/60 pl-4 sm:pl-6">
          <h2 className="font-heading text-xl font-semibold text-cream">Tentang Pajajaran Digital</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            Pajajaran Digital menghadirkan sumber dan kisah sejarah Kerajaan Sunda dan Pajajaran, dari para raja hingga prasasti dan peninggalan budaya.
          </p>
        </div>
      </section>
    </>
  );
}
