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

> **MUHIM CHEKLOV (2026-07-26):** Darken referensidagi "Total Sales",
> "Total Accounts", "Sales & Views" bar chart, "Order Status" donut,
> "Popular Products", "Top Vendors", "Country Sales" — bularning barchasi
> **e-commerce domenига tegishli** va bizning backend'da (HR/davomat
> tizimi) mos ma'lumot yo'q. Bularni **hech qachon o'ylab topilgan/soxta
> data bilan** qayta yaratmaslik kerak — bu backend'da bo'lmagan ishni
> talab qilib qo'yadi. Faqat loyihada **haqiqatda mavjud** bo'lgan
> ma'lumotlar ustida ishlash kerak.
>
> Hozirgi haqiqiy dashboard statistikasi (`dashboard.ts`, real endpoint'lar
> orqali hisoblanadi): **Jami xodimlar**, **Bugungi davomat %**, **Ochiq
> ta'til so'rovlari**, **O'qilmagan bildirishnomalar** — bor-yo'g'i 4 ta
> son, trend/tarix ma'lumoti yo'q.

- Grid layout (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4` —
  4 ta karta uchun, Darken'dagi 3 ustunli emas).
- Har birida: katta raqam (`text-2xl font-bold`) + label + metrikaga mos
  aksent rang/ikonka (`--color-chart-*` tokenlaridan bittasi, dekorativ
  chap chiziq yoki icon fon sifatida) — **foiz o'zgarish badge yoki
  sparkline QO'SHILMAYDI**, chunki buning uchun tarixiy/trend ma'lumot
  backend'da yo'q va uni o'ylab topish taqiqlanadi.
- Faqat "shisha karta" fon effekti (`--color-bg-primary` + `backdrop-blur`,
  T-001'da tayyor) va aksent rang bilan Darken vizual uslubini beriladi —
  mazmun (raqamlar) o'zgarmaydi.

### Jadval status badge
- Pill shakl (`rounded-full px-2 py-0.5 text-xs font-medium`), fon rangi
  status'ga qarab yuqoridagi `--color-status-*` tokenlaridan (10-15%
  o'pacity fon + to'liq o'pacity matn rangi — masalan
  `bg-[--color-status-completed]/15 text-[--color-status-completed]`).

## 3.1. Amal tugmalari va alert ranglar xaritasi (2026-07-26, T-007)

Ko'p feature'larning list/form CSS fayllarida `.btn-edit`, `.btn-delete`,
`.alert-success`, `.alert-error` klasslari deyarli bir xil hardcoded hex
qiymatlar bilan takrorlangan. Quyidagi xarita — mexanik almashtirish
uchun yagona manba (har bir fayl aynan shu qiymatlarni ishlatmasligi
mumkin, yaqin variantlar ham shu tokenga tushadi):

| Element | Eski hex (variantlar) | Yangi token |
|---|---|---|
| `.btn-edit` background (och holat) | `#e3f2fd`, `#f0f4f8` | `color-mix(in srgb, var(--color-primary) 12%, transparent)` |
| `.btn-edit` color / border | `#1565c0`, `#2563eb`, `#3b82f6`, `#0ea5e9` | `var(--color-primary)` |
| `.btn-edit:hover` background | `#1565c0`, `#2563eb`, `#3b82f6` | `var(--color-primary)` |
| `.btn-delete` background (och holat) | `#fce4ec`, `#ffebee`, `#fef2f2`, `#fee2e2` | `color-mix(in srgb, var(--color-danger) 12%, transparent)` |
| `.btn-delete` color / border | `#c62828`, `#ef4444`, `#dc2626` | `var(--color-danger)` |
| `.btn-delete:hover` background | `#c62828`, `#ef4444` | `var(--color-danger)` |
| `.alert-success` background | `#e8f5e9`, `#c3e6cb` | `color-mix(in srgb, var(--color-success) 15%, transparent)` |
| `.alert-success` color / border-left | `#2e7d32`, `#4caf50` | `var(--color-success)` |
| `.alert-error` background | `#ffebee`, `#f5c6cb`, `#fef2f2` | `color-mix(in srgb, var(--color-danger) 15%, transparent)` |
| `.alert-error` color / border-left | `#c62828`, `#ef5350` | `var(--color-danger)` |

**Doiraga kirmaydi (o'zgartirilmaydi):** `.page-header-card` gradient fon
(`#0ea5e9 → #2563eb`) va unga tegishli oq matn (`#fff`/`#ffffff`) — bu
qasddan rangli brend-aksent, status/semantik rang emas, alohida
muhokama qilinmaguncha tegilmaydi.

## 4. Amalga oshirish tartibi (Tailwind, mavjud token tizimi ustida)

1. `src/styles.css`dagi `@theme` va `:root[data-theme="dark"]` bloklariga
   yuqoridagi yangi tokenlarni qo'shish (mavjud light tema **buzilmaydi** —
   faqat dark variant va yangi aksent tokenlar kengaytiriladi).
2. Sidebar/header/main-layout komponentlarini yangi tokenlar bilan qayta
   stillashtirish (mavjud struktura/markup saqlanadi, faqat Tailwind
   class'lari va CSS custom property qiymatlari yangilanadi).
3. Dashboard'dagi 4 ta mavjud (real) stat-kartani Darken vizual uslubiga
   moslashtirish — faqat mavjud 4 ta metrika, soxta/qo'shimcha widget yo'q.
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
