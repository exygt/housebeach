import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/providers/trpc";
import { CATEGORIES, CATEGORY_LABELS, WHATSAPP_URL } from "@contracts/menu";
import type { MenuItem } from "@db/schema";
import { ui, LANG_KEY, type Lang } from "@/lib/i18n";

const SAND = "#F5EFE4";
const CARD = "#FCFAF4";
const INK = "#211D17";
const ACCENT = "#0E6B60";
const WA_GREEN = "#1FA855";

function formatPrice(price: string | number) {
  const n = typeof price === "string" ? parseFloat(price) : price;
  const str = Number.isInteger(n) ? String(n) : n.toFixed(2);
  return `₺${str}`;
}

/* ---------------- Language selection screen ---------------- */
function LanguageSelect({ onPick }: { onPick: (l: Lang) => void }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ backgroundColor: SAND, color: INK }}
    >
      <div className="w-full max-w-sm text-center">
        <div
          className="text-xs tracking-[0.45em] mb-3"
          style={{ color: ACCENT }}
        >
          HOUSE BEACH
        </div>
        <div className="border-y-2 py-4 mb-10" style={{ borderColor: INK }}>
          <h1 className="text-2xl font-bold tracking-[0.25em]">
            {ui.tr.selectLanguage}
          </h1>
          <p className="text-sm tracking-[0.2em] mt-1 opacity-60">
            {ui.tr.selectLanguageSub}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => onPick("tr")}
            className="w-full py-5 text-lg font-bold tracking-[0.3em] border-2 rounded-none transition-colors active:scale-[0.99]"
            style={{ borderColor: INK, backgroundColor: INK, color: SAND }}
          >
            TÜRKÇE
          </button>
          <button
            onClick={() => onPick("en")}
            className="w-full py-5 text-lg font-bold tracking-[0.3em] border-2 rounded-none transition-colors active:scale-[0.99]"
            style={{ borderColor: INK, backgroundColor: CARD, color: INK }}
          >
            ENGLISH
          </button>
        </div>

        <div className="mt-14 text-[10px] tracking-[0.35em] opacity-50">
          EST. SUMMER
        </div>
      </div>
    </div>
  );
}

/* ---------------- Ingredients modal ---------------- */
function ItemModal({
  item,
  lang,
  onClose,
}: {
  item: MenuItem;
  lang: Lang;
  onClose: () => void;
}) {
  const t = ui[lang];
  const name = lang === "tr" ? item.nameTr : item.nameEn;
  const ingredients =
    (lang === "tr" ? item.ingredientsTr : item.ingredientsEn) || "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(20,17,12,0.6)" }}
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-md border-2 rounded-none"
        style={{ backgroundColor: CARD, borderColor: INK }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-start justify-between px-5 pt-5 pb-4 border-b-2"
          style={{ borderColor: INK }}
        >
          <div>
            <h3 className="text-xl font-bold tracking-wide uppercase">
              {name}
            </h3>
            <div
              className="text-lg font-bold mt-1"
              style={{ color: ACCENT }}
            >
              {formatPrice(item.price)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 border-2 rounded-none text-lg font-bold leading-none"
            style={{ borderColor: INK }}
            aria-label={t.close}
          >
            ×
          </button>
        </div>
        <div className="px-5 py-5">
          <div
            className="text-xs font-bold tracking-[0.3em] mb-2"
            style={{ color: ACCENT }}
          >
            {t.ingredients.toLocaleUpperCase(lang === "tr" ? "tr" : "en")}
          </div>
          <p className="text-base leading-relaxed">
            {ingredients || "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Menu page ---------------- */
function MenuPage({ lang, onChangeLang }: { lang: Lang; onChangeLang: () => void }) {
  const t = ui[lang];
  const [selected, setSelected] = useState<MenuItem | null>(null);
  const [showWa, setShowWa] = useState(false);
  const menuQuery = trpc.menu.list.useQuery();

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    const onScroll = () => setShowWa(window.scrollY > 160);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const grouped = useMemo(() => {
    const items = menuQuery.data ?? [];
    return CATEGORIES.map((cat) => ({
      cat,
      label: CATEGORY_LABELS[cat][lang],
      items: items.filter((i) => i.category === cat),
    })).filter((g) => g.items.length > 0);
  }, [menuQuery.data, lang]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: SAND, color: INK }}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        {/* Header */}
        <header
          className="sticky top-0 z-40 border-b-2"
          style={{ backgroundColor: SAND, borderColor: INK }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <div
                className="text-[10px] tracking-[0.45em]"
                style={{ color: ACCENT }}
              >
                {t.tagline}
              </div>
              <div className="text-xl font-bold tracking-[0.25em]">
                HOUSE BEACH
              </div>
            </div>
            <button
              onClick={onChangeLang}
              className="px-3 h-10 border-2 rounded-none text-xs font-bold tracking-[0.2em]"
              style={{ borderColor: INK }}
            >
              {lang === "tr" ? "EN" : "TR"}
            </button>
          </div>

          {/* Category nav */}
          {grouped.length > 0 && (
            <nav className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {grouped.map((g) => (
                <a
                  key={g.cat}
                  href={`#cat-${g.cat}`}
                  className="shrink-0 px-4 py-2 border-2 rounded-none text-xs font-bold tracking-[0.15em] uppercase"
                  style={{ borderColor: INK, backgroundColor: CARD }}
                >
                  {g.label}
                </a>
              ))}
            </nav>
          )}
        </header>

        {/* Content */}
        <main className="flex-1 px-4 pb-32">
          {menuQuery.isLoading && (
            <p className="text-center py-16 tracking-[0.2em] opacity-60">
              {t.loading}
            </p>
          )}
          {menuQuery.isError && (
            <p className="text-center py-16 tracking-wide">{t.error}</p>
          )}

          {grouped.map((g) => (
            <section key={g.cat} id={`cat-${g.cat}`} className="scroll-mt-32">
              <div className="flex items-center gap-3 mt-8 mb-3">
                <div
                  className="w-3 h-3"
                  style={{ backgroundColor: ACCENT }}
                />
                <h2 className="text-lg font-bold tracking-[0.25em] uppercase">
                  {g.label}
                </h2>
                <div
                  className="flex-1 border-t-2"
                  style={{ borderColor: INK }}
                />
              </div>

              <div
                className="border-2 rounded-none divide-y-2"
                style={{ borderColor: INK, backgroundColor: CARD }}
              >
                {g.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelected(item)}
                    className="w-full flex items-baseline justify-between gap-4 px-4 py-4 text-left active:opacity-70"
                    style={{ borderColor: INK }}
                  >
                    <span className="text-base font-bold uppercase tracking-wide">
                      {lang === "tr" ? item.nameTr : item.nameEn}
                    </span>
                    <span
                      className="text-base font-bold shrink-0"
                      style={{ color: ACCENT }}
                    >
                      {formatPrice(item.price)}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}

          <footer className="mt-12 text-center text-[10px] tracking-[0.35em] opacity-50">
            <div>HOUSE BEACH — {t.menu}</div>
            <a href="/admin" className="inline-block mt-4 underline">
              {t.admin}
            </a>
          </footer>
        </main>
      </div>

      {/* WhatsApp order button — appears after scrolling */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 px-4 pb-4 transition-transform duration-300 ${
          showWa ? "translate-y-0" : "translate-y-24"
        }`}
      >
        <div className="max-w-md mx-auto">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 rounded-none text-sm font-bold tracking-[0.2em] text-white shadow-lg active:scale-[0.99]"
            style={{ backgroundColor: WA_GREEN }}
          >
            <svg
              viewBox="0 0 24 24"
              className="w-5 h-5 fill-current"
              aria-hidden="true"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.186 8.186 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.39-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24M8.53 7.33c-.16 0-.43.06-.66.31-.22.25-.87.86-.87 2.07 0 1.22.89 2.39 1 2.56.14.17 1.76 2.67 4.25 3.73.59.27 1.05.42 1.41.53.59.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.16-.48-.27-.25-.14-1.47-.74-1.69-.82-.23-.08-.37-.12-.56.12-.16.25-.64.81-.78.97-.15.17-.29.19-.53.07-.26-.13-1.06-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.12-.24-.01-.39.11-.5.11-.11.27-.29.37-.44.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.44-.06-.11-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.43-.14 0-.3-.01-.47-.01z" />
            </svg>
            {t.order}
          </a>
        </div>
      </div>

      {selected && (
        <ItemModal item={selected} lang={lang} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

export default function Home() {
  const [lang, setLang] = useState<Lang | null>(() => {
    const saved = localStorage.getItem(LANG_KEY);
    return saved === "tr" || saved === "en" ? saved : null;
  });

  const pick = (l: Lang) => {
    localStorage.setItem(LANG_KEY, l);
    setLang(l);
  };

  if (!lang) return <LanguageSelect onPick={pick} />;
  return <MenuPage lang={lang} onChangeLang={() => setLang(null)} />;
}
