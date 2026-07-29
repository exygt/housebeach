# HOUSE BEACH — Menü Web Sitesi

Mobil uyumlu, Türkçe/İngilizce destekli plaj menüsü + yönetim paneli.

## Özellikler

- **Dil seçimi**: İlk açılışta Türkçe / English seçimi, tüm sayfa seçilen dile göre gösterilir.
- **Bölümler**: Aparatifler, Pizza, Mantı, Hamburger, İçecekler.
- **Ürün detayı**: Ürüne dokununca "İçindekiler" penceresi açılır.
- **WhatsApp sipariş hattı**: Menüyü aşağı kaydırınca çıkan buton, doğrudan `wa.me/905332333524` adresine yönlendirir.
- **Yönetim paneli** (`/admin`): ürün ekleme, silme, fiyat ve içindekiler düzenleme.
  - Kullanıcı adı: `exxx`
  - Şifre: `xxxe`
- Menü verileri **veritabanında** tutulur; panelden yapılan değişiklikler tüm ziyaretçilere anında yansır.

## Teknoloji

React + Vite (frontend), Hono + tRPC (backend), MySQL + Drizzle ORM (veritabanı).

## Kendi sunucunuzda çalıştırma

Gereksinimler: **Node.js 20+** ve bir **MySQL** veritabanı.

1. Paketleri kurun:
   ```bash
   npm install
   ```
2. `.env.example` dosyasını `.env` olarak kopyalayın ve `DATABASE_URL` satırına kendi MySQL bağlantınızı yazın:
   ```bash
   cp .env.example .env
   ```
   Örnek: `DATABASE_URL=mysql://kullanici:sifre@sunucu:3306/veritabani`
3. Tabloları oluşturun ve örnek menüyü yükleyin:
   ```bash
   npm run db:push
   npx tsx db/seed.ts
   ```
4. Derleyin ve başlatın:
   ```bash
   npm run build
   npm start
   ```
   Site `http://localhost:3000` adresinde çalışır. Yönetim paneli: `http://localhost:3000/admin`

Geliştirme için: `npm run dev`

## Dosya yapısı

| Klasör / Dosya | Açıklama |
|---|---|
| `src/pages/Home.tsx` | Menü sayfası + dil seçimi |
| `src/pages/Admin.tsx` | Yönetim paneli |
| `src/lib/i18n.ts` | Arayüz metinleri (TR/EN) |
| `contracts/menu.ts` | Bölümler ve WhatsApp linki (ortak sabitler) |
| `api/menuRouter.ts` | Menü API'si ve admin girişi (kullanıcı adı/şifre burada) |
| `db/schema.ts` | Veritabanı tablosu |
| `db/seed.ts` | Örnek menü verileri |

## Sık yapılan değişiklikler

- **WhatsApp numarası**: `contracts/menu.ts` içindeki `WHATSAPP_URL`.
- **Admin kullanıcı adı / şifre**: `api/menuRouter.ts` içindeki `ADMIN_USERNAME` ve `ADMIN_PASSWORD`.
- **Renkler**: `src/pages/Home.tsx` üstündeki `SAND`, `CARD`, `INK`, `ACCENT` sabitleri.
