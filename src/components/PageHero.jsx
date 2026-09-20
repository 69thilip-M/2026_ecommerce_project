// src/components/PageHero.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { FaLeaf } from "react-icons/fa";

/* Gentle floating motion (switched off for "reduce motion") */
const HERO_CSS = `
@keyframes phFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
@keyframes phFloatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-5px)}}
.ph-float{animation:phFloat 6s ease-in-out infinite}
.ph-float-slow{animation:phFloatSlow 5s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.ph-float,.ph-float-slow{animation:none}}
`;

/* Fan layout for the photo collage */
const TILES = [
  { left: "0%", top: "16%", rot: -6, delay: "0s" },
  { left: "23%", top: "0%", rot: 4, delay: "0.7s" },
  { left: "48%", top: "17%", rot: -3, delay: "1.4s" },
  { left: "72%", top: "2%", rot: 6, delay: "2.1s" },
];

/* Picks up to `count` different photos: items = [{ src, name }] */
// eslint-disable-next-line react-refresh/only-export-components
export const pickHeroPhotos = (items = [], count = 4) => {
  const seen = new Set();
  const out = [];

  items.forEach((item) => {
    if (!item?.src || seen.has(item.src) || out.length >= count) return;
    seen.add(item.src);
    out.push(item);
  });

  return out;
};

/* Image with a friendly fallback tile */
export function Photo({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-gradient-to-br from-[#eaf5e5] to-[#d6ecce] text-[#158447] ${className}`}
      >
        <FaLeaf className="text-3xl opacity-70" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

/* =====================================================
   PAGE HERO
===================================================== */
function PageHero({
  badge,
  // eslint-disable-next-line no-unused-vars
  BadgeIcon = FaLeaf,
  title,
  subtitle,
  crumbs = [],
  photos = [],
  chipA,
  chipB,
  children,
}) {
  const hasPhotos = photos.length > 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#06472a] via-[#075c35] to-[#0b7040] text-white">
      <style>{HERO_CSS}</style>

      {/* dot pattern + soft glows */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.10) 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="pointer-events-none absolute -left-20 -top-28 h-72 w-72 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-64 w-64 rounded-full bg-[#9bdd45]/15 blur-2xl" />

      <div
        className={`relative mx-auto grid max-w-7xl items-center gap-8 px-5 pb-16 pt-9 sm:px-8 ${
          hasPhotos ? "md:grid-cols-[1fr_minmax(280px,44%)]" : ""
        }`}
      >
        {/* ---------- TEXT ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0"
        >
          {crumbs.length > 0 && (
            <nav className="mb-4 flex flex-wrap items-center gap-2 text-xs font-medium text-green-100/80">
              {crumbs.map((crumb, i) => (
                <span key={crumb.label} className="flex items-center gap-2">
                  {i > 0 && <span>/</span>}
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>
          )}

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold tracking-wide">
            <BadgeIcon />
            {badge}
          </div>

          <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-green-100 md:text-base">
              {subtitle}
            </p>
          )}

          {children && <div className="mt-6">{children}</div>}
        </motion.div>

        {/* ---------- PHOTO COLLAGE ---------- */}
        {hasPhotos && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto hidden aspect-[600/270] w-full max-w-[600px] md:block"
          >
            <div className="absolute inset-x-8 inset-y-6 rounded-full bg-[#9bdd45]/20 blur-2xl" />

            {photos.map((photo, i) => {
              const t = TILES[i];
              if (!t) return null;

              return (
                <div
                  key={photo.src}
                  className="absolute w-[27%]"
                  style={{
                    left: t.left,
                    top: t.top,
                    transform: `rotate(${t.rot}deg)`,
                  }}
                >
                  <div className="ph-float" style={{ animationDelay: t.delay }}>
                    <Photo
                      src={photo.src}
                      alt={photo.name}
                      className="aspect-[3/4] w-full rounded-[1.6rem] border-4 border-white object-cover shadow-2xl shadow-black/30"
                    />
                  </div>
                </div>
              );
            })}

            {chipA && (
              <div className="ph-float-slow absolute left-[2%] top-[2%] z-10 flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-[#075c35] shadow-lg">
                <FaLeaf className="text-[#158447]" />
                {chipA}
              </div>
            )}

            {chipB && (
              <div
                className="ph-float-slow absolute bottom-[2%] right-[3%] z-10 rounded-full bg-[#9bdd45] px-3.5 py-1.5 text-xs font-extrabold text-[#06472a] shadow-lg"
                style={{ animationDelay: "1s" }}
              >
                {chipB}
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* curved bottom edge */}
      <svg
        viewBox="0 0 1440 40"
        preserveAspectRatio="none"
        className="absolute -bottom-px left-0 h-6 w-full text-[#f7fbf4]"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M0,40 C360,0 1080,0 1440,40 L1440,40 L0,40 Z" />
      </svg>
    </section>
  );
}

export default PageHero;
