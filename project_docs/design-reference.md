# Dizayn referensi — "Darken" admin dashboard

> Manba: `demo.templatemonster.com/demo/430969.html` ("Darken" Bootstrap 5 Admin
> Dashboard Template), skrinshotlar orqali tahlil qilingan (2026-07-26).
> Bu hujjat — zdes-frontend'ga shu dizaynni **Tailwind CSS v4** bilan qo'llash
> uchun yagona manba (source of truth). Har bir AGY task shu faylga havola
> beradi, ranglar/patternlarni qayta tasvirlamaydi.

## 1. Mavjud infratuzilma (o'zgartirilmaydi, kengaytiriladi)

Loyihada allaqachon token-asosli tema tizimi bor — buni buzmaslik, ustiga
qurish kerak:

- `src/styles.css` — `@theme` bloki (Tailwind v4 CSS-first config) +
  `:root` / `:root[data-theme="dark"]` orqali light/dark token almashinuvi.
- Mavjud tokenlar: `--color-bg-primary`, `--color-bg-secondary`,
  `--color-text-primary`, `--color-text-secondary`, `--color-border`,
  `--color-primary`, `--color-primary-hover`, `--color-danger`,
  `--color-success`, `--color-overlay`, `--shadow-color`.
- Tema almashtirish `data-theme` atributi orqali ishlaydi (`:root[data-theme="dark"]`).

**Qoida:** yangi ranglar shu token tizimiga **qo'shiladi** (yangi CSS
custom property + Tailwind `@theme` orqali), alohida hardcoded hex qiymatlar
komponent shablonlariga yozilmaydi.

## 2. Rang palitrasi (Darken referensidan)

### Fon (dark variant — asosiy nishon)
- Asosiy fon: chuqur ko'k-binafsha gradient — `radial-gradient` yoki
  `linear-gradient(135deg, #0f0a2e 0%, #1a1442 50%, #0f0a2e 100%)` uslubida
  (skrinshotdagi chuqur navy→purple o'tish).
- Karta foni (`--color-bg-secondary` dark variant): yarim shaffof to'q
  binafsha, masalan `rgba(30, 20, 60, 0.6)` + `backdrop-blur` — kartalar fon
  ustida "suzayotgan shisha" effekti beradi.

### Aksent ranglar (grafikalar/statuslar uchun — yangi tokenlar sifatida qo'shiladi)
| Token nomi | Qiymat (taxminiy) | Ishlatilishi |
|---|---|---|
| `--color-chart-purple` | `#a855f7` | Sales sparkline, bar chart 1-seriya |
| `--color-chart-pink` | `#ec4899` | Bar chart 2-seriya (Sales) |
| `--color-chart-green` | `#22c55e` | Bar chart (Views), success holatlar |
| `--color-chart-yellow` | `#eab308` | Accounts sparkline |
| `--color-chart-blue` | `#38bdf8` | Average sales sparkline |
| `--color-status-completed` | `--color-success` (mavjud) | Jadval status badge |
| `--color-status-pending` | `--color-chart-yellow` | Jadval status badge |
| `--color-status-canceled` | `--color-danger` (mavjud) | Jadval status badge |

Statistika o'zgarish badge'lari (masalan "↓ 8.6%"): yashil = ijobiy,
qizil = salbiy — mavjud `--color-success`/`--color-danger` ishlatiladi,
yangi token kerak emas.

## 3. Layout patternlari

### Sidebar
- To'q fon, ikonka + matn qatorlari, accordion (ichma-ich) bo'limlar:
  masalan "Dashboard" ochilganda "Analysis" pastda ko'rinadi.
- Bo'lim sarlavhalari (masalan "UI ELEMENTS", "FORMS & TABLES", "PAGES")
  kichik, kulrang, uppercase, letter-spacing — Tailwind:
  `text-xs uppercase tracking-wide text-[--color-text-secondary]`.
- Aktiv menyu band: chapdan aksent chiziq yoki fon highlight
  (`bg-[--color-primary]/10 border-l-2 border-[--color-primary]`).

### Topbar
- Chapda qidiruv input (to'liq kenglik, ichida katta bo'sh joy), o'ngda
  ikonka klasteri: til, xabar, bildirishnoma (badge bilan), savat (badge
  bilan), profil avatar.
- Bildirishnoma/profil bosilganda o'ngdan slide-in panel ochiladi (mavjud
  loyihada shunga o'xshash panel/modal pattern bo'lsa o'shani qayta
  ishlatish, aks holda oddiy `absolute right-0` dropdown).

### Stat karta (Dashboard)
- 3 ustunli grid (`grid grid-cols-1 md:grid-cols-3 gap-4`).
- Har birida: katta raqam (`text-2xl font-bold`) + foiz badge (yashil/qizil,
  yumaloq pill) + label + pastida gradient sparkline (SVG yoki chart
  kutubxonasi orqali, mavjud chart komponentidan foydalanish kerak bo'lsa
  loyihada mavjudini tekshirish, yo'q bo'lsa oddiy inline SVG path bilan
  yasash — yangi og'ir chart kutubxonasi qo'shmaslik, `package.json`ga
  yangi dependency talab qilinadigan komponent alohida muhokama qilinadi).

### Jadval status badge
- Pill shakl (`rounded-full px-2 py-0.5 text-xs font-medium`), fon rangi
  status'ga qarab yuqoridagi `--color-status-*` tokenlaridan (10-15%
  o'pacity fon + to'liq o'pacity matn rangi — masalan
  `bg-[--color-status-completed]/15 text-[--color-status-completed]`).

## 4. Amalga oshirish tartibi (Tailwind, mavjud token tizimi ustida)

1. `src/styles.css`dagi `@theme` va `:root[data-theme="dark"]` bloklariga
   yuqoridagi yangi tokenlarni qo'shish (mavjud light tema **buzilmaydi** —
   faqat dark variant va yangi aksent tokenlar kengaytiriladi).
2. Sidebar/header/main-layout komponentlarini yangi tokenlar bilan qayta
   stillashtirish (mavjud struktura/markup saqlanadi, faqat Tailwind
   class'lari va CSS custom property qiymatlari yangilanadi).
3. Dashboard sahifasiga stat-karta + sparkline pattern qo'shish.
4. DataTable/jadval sahifalariga status-badge pattern qo'llash.
5. Har bir bosqichdan keyin `npm run build` bilan tekshirish (CSS-only
   o'zgarishlar bo'lsa ham, template'dagi noto'g'ri Tailwind class yoki
   binding xatosini ushlab qolish uchun).

## 5. Constraints (barcha tasklar uchun umumiy)

- Yangi npm dependency qo'shishdan oldin so'rash (og'ir chart kutubxonalari,
  UI kit'lar kabi) — mavjud imkoniyatlar (Tailwind utility, oddiy SVG)
  bilan cheklanish afzal.
- Backend (`~/Desktop/zdes/zdes_backend`) kodiga hech qachon tegilmaydi —
  faqat integratsiyani tekshirish uchun ishga tushiriladi.
- Mavjud komponent fayl strukturasi (`.ts`/`.html`/`.css` alohida fayllar)
  va nomlash uslubi saqlanadi.
- Har bir o'zgarishdan keyin `npm run build` xatosiz o'tishi shart.
