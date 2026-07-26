# Sessiya: App shell (router-outlet yo'q) va login.css rang o'zgaruvchilari buglari

**Sana:** 2026-07-25, ~03:20–03:36

## Kontekst

Bu sessiya Bosqich 3 (T-020–T-031) orkestratsiyasini boshlashdan boshlandi
(T-020, T-021 uchun tracking tasklar yaratildi), lekin Fayzillo "stop"
deb to'xtatdi — hech narsa AGY'ga dispatch qilinmadi, faqat ikkita task
fayli o'qildi va keyin bekor qilindi (tracking task'lar o'chirildi).
Shundan keyin sessiya yo'nalishi butunlay boshqa tomonga — ikkita amaliy
bug tuzatishga — o'zgardi.

## 1. Bug: `/auth/login` (va aslida BARCHA marshrutlar) ishlamayapti

**Simptom:** Fayzillo `/auth/login`ga kirganda brauzerda faqat statik
"Hello World" matni ko'rindi.

**Sabab:** `src/app/app.ts` / `src/app/app.html` hali Angular scaffold'ining
default shablonini ishlatardi — `app.html`da `<router-outlet>` umuman yo'q
edi. Demak router hech qanday marshrutni (auth, dashboard va h.k.) render
qila olmasdi, doim faqat root komponentning statik "Hello World" matni
ko'rinardi.

**Tuzatish:**
- `src/app/app.ts` — `RouterOutlet` import qilindi, `imports: [RouterOutlet]` qo'shildi.
- `src/app/app.html` — `<main class="welcome"><h1>Hello World</h1></main>` → `<router-outlet></router-outlet>`.
- `src/app/app.css` — endi ishlatilmaydigan `.welcome`/`h1` uslublari olib tashlandi.

Tekshiruv: `npx tsc --noEmit -p tsconfig.app.json` — xatosiz.

## 2. Bug: login formadagi matn (error banner, sarlavha, label, input) ko'rinmaydi

**Simptom:** login xato xabari (`errorMessage()`) formada matn sifatida
ko'rinmadi.

**Tub sabab (kattaroq muammo):** loyiha ildizidagi `replace_colors.py` va
`replace_colors2.py` skriptlari (avvalgi dark/light rejimga o'tish ishi
davomida, T-017 atrofida yozilgan bo'lishi mumkin) `login.css`dagi
qattiq-kodlangan ranglarni CSS custom property'larga almashtirganda bir
nechta joyda **matn rangi va fon rangini bir xil o'zgaruvchiga**
(`var(--color-bg-primary)`) bog'lab qo'ygan — skript ichidagi izohlarda
(`replace_colors.py` 74–75-qatorlar) muallif buni shubha ostiga olgan,
lekin baribir noto'g'ri almashtirilgan. Natijada nafaqat alert banner,
balki `.login-title`, `.login-subtitle`, `.form-label`, `.form-input`
matni ham o'z fonlari bilan bir xil rangda (demak ko'rinmas) edi.

**Tuzatish (`src/app/features/auth/pages/login/login.css`):**
| Selector | Avval | Endi |
|---|---|---|
| `.login-card` border | `var(--color-bg-primary)` | `var(--color-border)` |
| `.login-title` color | `var(--color-bg-primary)` | `var(--color-text-primary)` |
| `.login-subtitle` color | `var(--color-bg-primary)` | `var(--color-text-secondary)` |
| `.form-label` color | `var(--color-bg-primary)` | `var(--color-text-secondary)` |
| `.input-icon` color | `var(--color-bg-primary)` | `var(--color-text-secondary)` |
| `.form-input` color/background/border | hammasi `var(--color-bg-primary)` | `var(--color-text-primary)` / `var(--color-bg-secondary)` / `var(--color-border)` |
| `.form-input::placeholder` | `var(--color-bg-primary)` | `var(--color-text-secondary)` |
| `.form-input:focus` | background `var(--color-primary)`ga o'zgarardi | background o'zgarishi olib tashlandi, faqat border+shadow |
| `.form-input.is-invalid` | background `var(--color-danger)`ga o'zgarardi | background o'zgarishi olib tashlandi, faqat border |
| `.alert-error` | background VA color ikkalasi `var(--color-danger)` | background `var(--color-bg-secondary)`, color `var(--color-danger)` |
| `.login-wrapper` background | 3 xil to'xtash nuqtasi bir xil rangda gradient (mazmunsiz) | oddiy `var(--color-bg-secondary)` |

**Boshqa fayllar tekshirildi:** `replace_colors2.py` yana 4 ta faylga tegdi
(`holiday-form.css`, `payroll-detail.css`, `company-detail.css`,
`scanner.css`). Tekshirilganda ulardagi yagona `var(--color-bg-primary)`
matn rangi holatlari faqat rangli tugmalar (`.btn-primary`,
`.submit-btn`) ustidagi matn uchun ekan — bu loyihaning umumiy
konvensiyasiga mos (ancestor foni boshqa rangda), shu sabab ular
tegilmadi.

Tekshiruv: `npx tsc --noEmit -p tsconfig.app.json` — xatosiz.

## Ochiq qolgan (kelajakda ko'rib chiqish uchun)

- `.btn-submit`/spinner rangi `var(--color-bg-primary)`ga bog'liq — bu
  loyiha bo'ylab qabul qilingan konvensiya (rangli tugma foni ustida
  har doim och matn), lekin dark rejimda `--color-bg-primary` qorong'i
  (`#121212`) bo'lgani uchun bu konvensiyaning o'zi nazariy jihatdan
  noto'g'ri (tugma matni deyarli ko'rinmas bo'lishi mumkin) — bu sessiya
  doirasidan tashqarida, butun loyihaga tegishli alohida masala.
- `replace_colors.py`/`replace_colors2.py` skriptlari repo ildizida
  qolgan (bir martalik vositalar) — kerak bo'lmasa keyinchalik
  o'chirilishi mumkin (Fayzillo bilan kelishilgach).
- Bosqich 3 (T-020–T-031) orkestratsiyasi hali dispatch qilinmagan —
  starter.md/orcestor/tasklist.md holati o'zgarmagan, keyingi sessiyada
  xohlasa davom ettirilishi mumkin.
