export type Lang = "tr" | "en";

export const LANG_KEY = "beach-menu-lang";

export const ui = {
  tr: {
    selectLanguage: "Dil Seçiniz",
    selectLanguageSub: "Please select your language",
    tagline: "PLAJ MENÜSÜ",
    menu: "MENÜ",
    ingredients: "İçindekiler",
    close: "Kapat",
    order: "WHATSAPP SİPARİŞ HATTI",
    loading: "Menü yükleniyor...",
    error: "Menü yüklenemedi. Lütfen sayfayı yenileyin.",
    empty: "Bu bölümde henüz ürün bulunmuyor.",
    admin: "Yönetim",
  },
  en: {
    selectLanguage: "Select Language",
    selectLanguageSub: "Lütfen dilinizi seçin",
    tagline: "BEACH MENU",
    menu: "MENU",
    ingredients: "Ingredients",
    close: "Close",
    order: "WHATSAPP ORDER LINE",
    loading: "Loading menu...",
    error: "Menu could not be loaded. Please refresh the page.",
    empty: "No items in this section yet.",
    admin: "Admin",
  },
} as const;
