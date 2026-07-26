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

## 3.2. Column-level jadval filter patterni (2026-07-26, T-008)

**Qoida:** filter FAQAT jadval (`<table>`) chiqadigan sahifalarda bo'ladi
(notification-list kabi list-based, jadvalsiz sahifalarda YO'Q).
Filter client-side ishlaydi — sahifa allaqachon to'liq datani yuklab
signal/property'da saqlaydi, filter shu datani `computed()` orqali
toraytiradi, yangi backend so'rov YO'Q.

**Namuna (to'liq ishlaydigan, nusxa oling):**
`src/app/features/branches/pages/branch-list/branch-list.ts` va
`.html` — `nameFilter`/`addressFilter` (matn) + `statusFilter` (select)
+ `filteredBranches` computed.

**Har bir ustun turi uchun pattern:**

1. **Matn ustuni** — `.ts`da `xFilter = signal<string>('')`, `.html`da:
   ```html
   <th><input type="text" class="column-filter-input" placeholder="Qidirish..."
       [ngModel]="xFilter()" (ngModelChange)="xFilter.set($event)" (click)="$event.stopPropagation()" /></th>
   ```
   `computed()` ichida: `if (x && !item.field?.toLowerCase().includes(x)) return false;`

2. **Boolean/status ustuni (Holat: Faol/Nofaol)** — `.ts`da
   `statusFilter = signal<'' | 'active' | 'inactive'>('')`, `.html`da:
   ```html
   <th><select class="column-filter-select" [ngModel]="statusFilter()" (ngModelChange)="statusFilter.set($event)" (click)="$event.stopPropagation()">
     <option value="">Hammasi</option>
     <option value="active">Faol</option>
     <option value="inactive">Nofaol</option>
   </select></th>
   ```

3. **Enum/turi ustuni (masalan leave turi)** — xuddi boolean kabi
   `<select>`, lekin option'lar shu maydonning haqiqiy enum
   qiymatlariga mos (masalan `vacation`/`sick`/`unpaid`/`business_trip`/
   `other`), label sifatida mavjud `get*Label()` metodidan foydalaning
   (agar bor bo'lsa).

4. **Sana ustuni** — `.ts`da `xDateFilter = signal<string>('')` (bo'sh
   yoki `YYYY-MM-DD`), `.html`da:
   ```html
   <th><input type="date" class="column-filter-input"
       [ngModel]="xDateFilter()" (ngModelChange)="xDateFilter.set($event)" (click)="$event.stopPropagation()" /></th>
   ```
   `computed()`da: sana maydonini `YYYY-MM-DD`ga qisqartirib solishtiring
   (`item.date?.toString().slice(0,10) === xDateFilter()`).

5. **Filtrlanmaydigan ustunlar** (`#`, `ID`, raqamli summalar, vaqt,
   "Amallar"/actions) — filter qatorida bo'sh `<th></th>`.

**Shablon (thead ichida, header qatoridan keyin):**
```html
<tr class="column-filter-row">
  <th></th> <!-- filtrlanmaydigan ustun -->
  <th><input ...></th> <!-- matn -->
  ...
</tr>
```

**Bo'sh natija holati:** tashqi `@else if (data().length > 0)` RAW
dataga (filtrlanmagan) tekshiriladi — bu o'zgarmaydi. `tbody` ichida,
`@for` tugagach, QO'SHIMCHA holat qo'shiladi:
```html
@if (filteredData().length === 0) {
  <tr><td [attr.colspan]="N" class="empty-state-cell">
    <div class="empty-state-box"><span class="empty-icon">🔍</span>
    <p class="empty-text">Filterga mos {{'...'}} topilmadi</p></div>
  </td></tr>
}
```
Bu "filterga mos yo'q" holatini asosiy "umuman ma'lumot yo'q" holatidan
ajratadi.

**`FormsModule` import qilinishi shart** (`ngModel` uchun), `@Component`
`imports` massiviga qo'shiladi.

## 3.3. Kanonik "Amallar" (actions) ustuni patterni (2026-07-26, T-009, 2026-07-26 TUZATILDI)

**Muammo (foydalanuvchi topgan):** loyihada 4 xil actions-cell uslubi
aralash holda ishlatilgan — (a) matnli link (`edit-btn`/`delete-btn`,
"Tahrirlash"/"O'chirish" so'zi), (b) emoji ikonka (✏️/🗑️), (c) faqat
SVG delete tugmasi, edit umuman yo'q, (d) to'liq SVG edit+delete
(branch-list/company-list). Bundan tashqari ba'zi joylarda
`.btn-delete:disabled` hali ham hardcoded och rang (`#f1f5f9` va h.k.)
ishlatib, qorong'i temada begona yorug' chiziq ko'rinishida chiqib
qolgan.

> **MUHIM TUZATISH (2026-07-26):** Birinchi versiyada bu bo'lim
> "edit+delete SVG tugma" ni kanonik deb belgilagan edi — bu NOTO'G'RI
> chiqdi. Foydalanuvchi aniqlashtirdi: barcha list sahifalarida qator
> (`<tr>`) allaqachon `onRowClick` orqali edit sahifasiga o'tadi
> (butun qator bosiladigan, `cursor: pointer`). Shuning uchun alohida
> **edit tugmasi ORTIQCHA** — faqat **delete tugmasi** qoladi, va u
> albatta `(click)="$event.stopPropagation()"` bilan qatorning
> edit-navigatsiyasiga ta'sir qilmasligi kerak.

**Kanonik pattern — FAQAT delete tugmasi:**

**Kanonik HTML (nusxa oling, `x` — modelning o'zgaruvchisi):**
```html
<td class="actions-cell" (click)="$event.stopPropagation()">
  <button (click)="deleteX(x.id)" class="btn-action btn-delete" title="O'chirish">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
      <path d="M10 11v6M14 11v6"></path>
    </svg>
  </button>
</td>
```
- Agar sahifada `onRowClick` (qator bosilganda edit sahifasiga
  o'tish) MAVJUD BO'LMASA — bu holda edit tugmasi kerak (masalan
  `payroll-list` kabi faqat "Batafsil" ko'rinishidagi sahifalar,
  bunda qator bosilishi allaqachon detail'ga o'tadi, o'sha holatda
  ham alohida tugma shart emas — qatorning o'zi yetarli).
- `<a class="btn-action btn-edit">` / eski `edit-btn`/emoji-edit
  BUTUNLAY OLIB TASHLANADI — HAR QANDAY sahifada, agar o'sha
  sahifada allaqachon `onRowClick` orqali edit/detailga o'tish mavjud
  bo'lsa.
- Eski `<div class="action-buttons">` o'rovchisi OLIB TASHLANADI — `td`
  o'zi `class="actions-cell"` va `(click)="$event.stopPropagation()"`
  oladi (div kerak emas).

**Kanonik CSS (fayl oxiriga yoki mos joyga qo'shiladi/almashtiriladi):**
```css
.actions-cell {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.btn-action {
  width: 32px;
  height: 32px;
  border-radius: 7px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.15s ease;
}

.btn-delete {
  background: color-mix(in srgb, var(--color-danger) 12%, transparent);
  color: var(--color-danger);
}
.btn-delete:hover:not(:disabled) { background: var(--color-danger); color: #fff; }
.btn-delete:disabled {
  background: color-mix(in srgb, var(--color-text-secondary) 12%, transparent);
  color: var(--color-text-secondary);
  cursor: not-allowed;
  opacity: 0.6;
  border: 1px solid var(--color-border);
}
```
Eski `.edit-btn`/`.delete-btn`/`.action-buttons`/`.btn-edit` CSS
qoidalari o'chiriladi, faqat `.btn-delete`/`.actions-cell` qoladi
(eski class nomlari HTML'da ham CSS'da ham qolmasligi kerak).

**Muhim:** sahifaning `onRowClick`/`routerLink` orqali edit'ga
o'tish logikasi (`<tr>` darajasida) O'ZGARTIRILMAYDI — faqat
`<td class="actions-cell">` ichidagi ortiqcha edit tugmasi olib
tashlanadi.

## 3.4. Kanonik forma sahifasi patterni (2026-07-26, T-012)

**Muammo:** 15 ta forma/detail sahifasidan 8 tasi
(`branch-form`, `company-form`, `department-form`, `employee-form`,
`leave-form`, `position-form`, `work-schedule-form`,
`attendance-form`) bir xil `.form-page > .form-card > .form-header` +
`.form-body`/`.form-group`/`.form-label`/`.form-input` strukturasini
ishlatadi. Qolgan 4 tasi (`advance-form`, `holiday-form`,
`terminal-form`, `adjustment-form`) o'zining bespoke
`<div class="X-form-container">` / `class="form"` strukturasini
ishlatadi — vizual jihatdan boshqacha (karta-qobiq, icon-header yo'q).

**Namuna (to'liq, nusxa oling):**
`src/app/features/branches/pages/branch-form/branch-form.html` +
`.css` — struktura:
```html
<div class="form-page">
  <div class="form-card">
    <div class="form-header">
      <div class="form-header-icon"><svg>...</svg></div>
      <div>
        <h2 class="form-title">{{ isEditMode ? "X'ni tahrirlash" : "Yangi X qo'shish" }}</h2>
        <p class="form-subtitle">...</p>
      </div>
    </div>
    @if (errorMessage()) { <div class="alert alert-error">...</div> }
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-body">
      <div class="form-group">
        <label class="form-label">Maydon nomi</label>
        <input class="form-input" ... />
      </div>
      <!-- ... -->
    </form>
  </div>
</div>
```
CSS (`.form-page`/`.form-card`/`.form-header`/`.form-header-icon`/
`.form-title`/`.form-subtitle`/`.form-body`/`.form-group`/
`.form-label`/`.form-input`/`.form-select`) `branch-form.css`dan
ko'chiriladi, token qiymatlari (`var(--color-*)`) bilan birga.

**Qoida:** faqat CSS class nomlari va HTML o'rovchi struktura
almashtiriladi — mavjud form maydonlari, `formControlName`
bog'lanishlari, validatsiya logikasi, submit metodi O'ZGARMAYDI.

## 3.5. Kanonik detail (ko'rish) sahifasi patterni (2026-07-26, T-013)

**Muammo:** 3 ta detail sahifa (`employee-detail`, `payroll-detail`,
`attendance-detail`) bir-biriga mos emas:
- `payroll-detail` — eng to'liq: `.detail-card` > `.detail-row` >
  `.label`/`.value` strukturasi, token-asosli ranglar.
- `employee-detail` — o'xshash g'oya, lekin boshqa class nomi
  (`.info-card`, `<p><strong>` shaklida, `.edit-btn` da 3 ta hardcoded
  hex rang bor).
- `attendance-detail` — deyarli USLUBSIZ stub: oddiy `<p><strong>`
  qatorlari, sarlavha va "Loading..." matni **inglizcha** (loyihaning
  qolgan qismi o'zbekcha), umuman CSS class yo'q.

**Namuna (to'liq, nusxa oling):**
`src/app/features/payroll/pages/payroll-detail/payroll-detail.html` +
`.css` — `.detail-card` > (bir nechta) `.detail-row` > `.label` +
`.value` strukturasi, `.header-section` sarlavha uchun.

**Qoida:**
1. `employee-detail.html`ni xuddi shu `.detail-card`/`.detail-row`/
   `.label`/`.value` strukturasiga o'tkazish (hozirgi `.info-card`/
   `<p><strong>` o'rniga), `.edit-btn`dagi 3 ta hardcoded hex rangni
   `var(--color-primary)` kabi tokenlarga almashtirish. Mavjud "Tahrirlash"
   tugmasi (`[routerLink]="['edit']"`) SAQLANADI — bu yerda "qator
   bosilsa edit" degan holat yo'q, bu mustaqil detail sahifa, shuning
   uchun edit tugmasi kerak (3.3-band bu yerga tegishli emas).
2. `attendance-detail.html`ni **to'liq qayta yozish** — hozirgi
   ingliz-tilidagi minimal stub o'rniga, `payroll-detail` patterniga mos
   `.detail-card`/`.detail-row` bilan, o'zbek tilida, mavjud
   `Attendance` modelidagi haqiqiy maydonlar asosida (`employeeId`,
   `date`, `checkIn`, `checkOut`, `workedMinutes`, `lateMinutes`,
   `status` — aniq maydon nomlari uchun `src/app/core/models/
   attendance.ts` va `attendance-list.ts`dagi `formatDate`/`formatTime`
   metodlaridan namuna oling, xuddi shu formatlashni qo'llang). Sarlavha
   "Davomat tafsilotlari" (payroll-detail'dagi "Ish haqi tafsilotlari"
   uslubida), "Loading..." o'rniga skeleton yoki oddiy "Yuklanmoqda..."
   matni.
3. Yangi ma'lumot/maydon o'ylab topilmaydi — faqat `Attendance` modelida
   haqiqatda mavjud maydonlar ko'rsatiladi.

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
