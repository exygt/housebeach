// Shared menu constants used by both frontend and backend

export const CATEGORIES = [
  "aparatif",
  "pizza",
  "manti",
  "hamburger",
  "icecek",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_LABELS: Record<Category, { tr: string; en: string }> = {
  aparatif: { tr: "Aparatifler", en: "Appetizers" },
  pizza: { tr: "Pizza", en: "Pizza" },
  manti: { tr: "Mantı", en: "Manti" },
  hamburger: { tr: "Hamburger", en: "Hamburgers" },
  icecek: { tr: "İçecekler", en: "Drinks" },
};

export const WHATSAPP_URL = "https://wa.me/905332333524";
