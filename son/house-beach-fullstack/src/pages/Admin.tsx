import { useEffect, useMemo, useState } from "react";
import { trpc } from "@/providers/trpc";
import { CATEGORIES, CATEGORY_LABELS, type Category } from "@contracts/menu";
import type { MenuItem } from "@db/schema";

const SAND = "#F5EFE4";
const CARD = "#FCFAF4";
const INK = "#211D17";
const ACCENT = "#0E6B60";
const TOKEN_KEY = "beach-admin-token";

const inputCls =
  "w-full px-3 py-3 border-2 rounded-none text-base bg-transparent outline-none focus:opacity-80";

type FormState = {
  category: Category;
  nameTr: string;
  nameEn: string;
  price: string;
  ingredientsTr: string;
  ingredientsEn: string;
};

const emptyForm: FormState = {
  category: "aparatif",
  nameTr: "",
  nameEn: "",
  price: "",
  ingredientsTr: "",
  ingredientsEn: "",
};

/* ---------------- Login ---------------- */
function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const login = trpc.menu.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem(TOKEN_KEY, data.token);
      onLogin(data.token);
    },
  });

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: SAND, color: INK }}
    >
      <form
        className="w-full max-w-sm border-2 p-6 rounded-none"
        style={{ borderColor: INK, backgroundColor: CARD }}
        onSubmit={(e) => {
          e.preventDefault();
          login.mutate({ username, password });
        }}
      >
        <div
          className="text-xs tracking-[0.45em] mb-1"
          style={{ color: ACCENT }}
        >
          HOUSE BEACH
        </div>
        <h1 className="text-xl font-bold tracking-[0.25em] mb-6">
          YÖNETİM PANELİ
        </h1>

        <label className="block text-xs font-bold tracking-[0.2em] mb-1">
          KULLANICI ADI
        </label>
        <input
          className={inputCls}
          style={{ borderColor: INK }}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />

        <label className="block text-xs font-bold tracking-[0.2em] mt-4 mb-1">
          ŞİFRE
        </label>
        <input
          type="password"
          className={inputCls}
          style={{ borderColor: INK }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        {login.isError && (
          <p className="mt-3 text-sm font-bold text-red-700">
            {login.error.message}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full mt-6 py-4 text-sm font-bold tracking-[0.3em] rounded-none disabled:opacity-50"
          style={{ backgroundColor: INK, color: SAND }}
        >
          {login.isPending ? "GİRİLİYOR..." : "GİRİŞ YAP"}
        </button>

        <a
          href="/"
          className="block text-center mt-4 text-xs tracking-[0.2em] underline opacity-60"
        >
          ← Menüye dön
        </a>
      </form>
    </div>
  );
}

/* ---------------- Item form (add / edit) ---------------- */
function ItemForm({
  token,
  initial,
  editingId,
  onDone,
}: {
  token: string;
  initial: FormState;
  editingId: number | null;
  onDone: () => void;
}) {
  const [form, setForm] = useState<FormState>(initial);
  const utils = trpc.useUtils();
  const opts = {
    onSuccess: () => {
      utils.menu.list.invalidate();
      onDone();
    },
  };
  const add = trpc.menu.add.useMutation(opts);
  const update = trpc.menu.update.useMutation(opts);
  const pending = add.isPending || update.isPending;
  const error = add.error || update.error;

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ backgroundColor: "rgba(20,17,12,0.6)" }}
      onClick={onDone}
    >
      <form
        className="w-full sm:max-w-md max-h-[92vh] overflow-y-auto border-2 p-5 rounded-none"
        style={{ backgroundColor: CARD, borderColor: INK }}
        onClick={(e) => e.stopPropagation()}
        onSubmit={(e) => {
          e.preventDefault();
          const payload = { token, ...form };
          if (editingId) update.mutate({ ...payload, id: editingId });
          else add.mutate(payload);
        }}
      >
        <h2 className="text-lg font-bold tracking-[0.2em] mb-4">
          {editingId ? "ÜRÜNÜ DÜZENLE" : "YENİ ÜRÜN"}
        </h2>

        <label className="block text-xs font-bold tracking-[0.15em] mb-1">
          BÖLÜM
        </label>
        <select
          className={inputCls}
          style={{ borderColor: INK }}
          value={form.category}
          onChange={(e) => set("category", e.target.value as Category)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c].tr}
            </option>
          ))}
        </select>

        <label className="block text-xs font-bold tracking-[0.15em] mt-4 mb-1">
          ÜRÜN ADI (TÜRKÇE)
        </label>
        <input
          required
          className={inputCls}
          style={{ borderColor: INK }}
          value={form.nameTr}
          onChange={(e) => set("nameTr", e.target.value)}
        />

        <label className="block text-xs font-bold tracking-[0.15em] mt-4 mb-1">
          ÜRÜN ADI (İNGİLİZCE)
        </label>
        <input
          required
          className={inputCls}
          style={{ borderColor: INK }}
          value={form.nameEn}
          onChange={(e) => set("nameEn", e.target.value)}
        />

        <label className="block text-xs font-bold tracking-[0.15em] mt-4 mb-1">
          FİYAT (₺)
        </label>
        <input
          required
          inputMode="decimal"
          placeholder="örn: 250"
          className={inputCls}
          style={{ borderColor: INK }}
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
        />

        <label className="block text-xs font-bold tracking-[0.15em] mt-4 mb-1">
          İÇİNDEKİLER (TÜRKÇE)
        </label>
        <textarea
          rows={3}
          className={inputCls}
          style={{ borderColor: INK }}
          value={form.ingredientsTr}
          onChange={(e) => set("ingredientsTr", e.target.value)}
        />

        <label className="block text-xs font-bold tracking-[0.15em] mt-4 mb-1">
          İÇİNDEKİLER (İNGİLİZCE)
        </label>
        <textarea
          rows={3}
          className={inputCls}
          style={{ borderColor: INK }}
          value={form.ingredientsEn}
          onChange={(e) => set("ingredientsEn", e.target.value)}
        />

        {error && (
          <p className="mt-3 text-sm font-bold text-red-700">{error.message}</p>
        )}

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onDone}
            className="flex-1 py-3 border-2 rounded-none text-sm font-bold tracking-[0.2em]"
            style={{ borderColor: INK }}
          >
            VAZGEÇ
          </button>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 py-3 rounded-none text-sm font-bold tracking-[0.2em] disabled:opacity-50"
            style={{ backgroundColor: ACCENT, color: "#fff" }}
          >
            {pending ? "KAYDEDİLİYOR..." : "KAYDET"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ---------------- Admin panel ---------------- */
function Panel({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [activeCat, setActiveCat] = useState<Category>("aparatif");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const utils = trpc.useUtils();
  const menuQuery = trpc.menu.list.useQuery();
  const remove = trpc.menu.remove.useMutation({
    onSuccess: () => utils.menu.list.invalidate(),
  });

  const items = useMemo(
    () =>
      (menuQuery.data ?? []).filter((i) => i.category === activeCat),
    [menuQuery.data, activeCat]
  );

  const openEdit = (item: MenuItem) => {
    setEditing(item);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: SAND, color: INK }}>
      <div className="max-w-md mx-auto px-4 pb-16">
        <header
          className="flex items-center justify-between py-4 border-b-2 mb-4"
          style={{ borderColor: INK }}
        >
          <div>
            <div
              className="text-[10px] tracking-[0.45em]"
              style={{ color: ACCENT }}
            >
              HOUSE BEACH
            </div>
            <h1 className="text-lg font-bold tracking-[0.25em]">
              YÖNETİM PANELİ
            </h1>
          </div>
          <div className="flex gap-2">
            <a
              href="/"
              className="px-3 h-10 flex items-center border-2 rounded-none text-xs font-bold tracking-[0.15em]"
              style={{ borderColor: INK }}
            >
              MENÜ
            </a>
            <button
              onClick={onLogout}
              className="px-3 h-10 border-2 rounded-none text-xs font-bold tracking-[0.15em]"
              style={{ borderColor: INK }}
            >
              ÇIKIŞ
            </button>
          </div>
        </header>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCat(c)}
              className="shrink-0 px-4 py-2 border-2 rounded-none text-xs font-bold tracking-[0.15em] uppercase"
              style={{
                borderColor: INK,
                backgroundColor: activeCat === c ? INK : CARD,
                color: activeCat === c ? SAND : INK,
              }}
            >
              {CATEGORY_LABELS[c].tr}
            </button>
          ))}
        </div>

        {/* Add button */}
        <button
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="w-full mt-4 py-4 rounded-none text-sm font-bold tracking-[0.25em]"
          style={{ backgroundColor: ACCENT, color: "#fff" }}
        >
          + YENİ ÜRÜN EKLE
        </button>

        {/* Items */}
        <div
          className="mt-4 border-2 rounded-none divide-y-2"
          style={{ borderColor: INK, backgroundColor: CARD }}
        >
          {menuQuery.isLoading && (
            <p className="p-6 text-center opacity-60">Yükleniyor...</p>
          )}
          {!menuQuery.isLoading && items.length === 0 && (
            <p className="p-6 text-center opacity-60">
              Bu bölümde ürün yok.
            </p>
          )}
          {items.map((item) => (
            <div key={item.id} className="p-4" style={{ borderColor: INK }}>
              <div className="flex items-baseline justify-between gap-3">
                <div>
                  <div className="font-bold uppercase tracking-wide">
                    {item.nameTr}
                  </div>
                  <div className="text-sm opacity-60 uppercase">
                    {item.nameEn}
                  </div>
                </div>
                <div
                  className="font-bold shrink-0"
                  style={{ color: ACCENT }}
                >
                  ₺{parseFloat(item.price)}
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => openEdit(item)}
                  className="flex-1 py-2 border-2 rounded-none text-xs font-bold tracking-[0.2em]"
                  style={{ borderColor: INK }}
                >
                  DÜZENLE
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`"${item.nameTr}" silinsin mi?`))
                      remove.mutate({ token, id: item.id });
                  }}
                  className="flex-1 py-2 border-2 rounded-none text-xs font-bold tracking-[0.2em] text-red-700"
                  style={{ borderColor: "#b91c1c" }}
                >
                  SİL
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {formOpen && (
        <ItemForm
          token={token}
          editingId={editing?.id ?? null}
          initial={
            editing
              ? {
                  category: editing.category as Category,
                  nameTr: editing.nameTr,
                  nameEn: editing.nameEn,
                  price: String(parseFloat(editing.price)),
                  ingredientsTr: editing.ingredientsTr ?? "",
                  ingredientsEn: editing.ingredientsEn ?? "",
                }
              : { ...emptyForm, category: activeCat }
          }
          onDone={() => {
            setFormOpen(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY)
  );

  useEffect(() => {
    document.documentElement.lang = "tr";
  }, []);

  if (!token) return <Login onLogin={setToken} />;
  return (
    <Panel
      token={token}
      onLogout={() => {
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }}
    />
  );
}
