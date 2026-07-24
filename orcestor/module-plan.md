# Modul Reja — `zdes-frontend` (10 modul)

> Bu hujjat — loyihaning to'liq modul-bo'lib-bajarish rejasi. `T-003` javobida
> ("Modul 1/10") eslatilgan reja og'zaki/oldingi sessiyada kelishilgan edi,
> lekin faylga yozilmagan edi — shu sabab compaction'dan keyin yo'qolgan.
> Ushbu fayl endi doimiy manba (source of truth) hisoblanadi.

| # | Modul | Qamrov (fayllar/feature'lar) | Ijrochi | Task ID | Holat |
|---|---|---|---|---|---|
| 1 | Core infratuzilma | routing skeleti, `environment`, generic `Http` servisi | AGY | T-003 | ✅ Bajarildi |
| 2 | Auth | `auth.ts`, login sahifa, guard'lar, interceptor'lar | AGY (3 kichik qismga bo'lib) | T-004 | ✅ Bajarildi |
| 3 | Shared UI Kit | header, sidebar, data-table, confirm-dialog, image-upload, camera-capture, pipe'lar | AGY (1 komponent/dispatch) | T-005 | ✅ Bajarildi |
| 4 | Dashboard | boshqaruv paneli (placeholder/summary) | **Claude Code** | T-006 | ✅ Bajarildi |
| 5 | Tashkiliy tuzilma | `company`, `branches`, `departments`, `positions` (CRUD) | AGY (1 feature/dispatch) | T-007 | ✅ Bajarildi |
| 6 | Xodimlar | `employees` CRUD + `face-register` | AGY (2 dispatch) | T-008 | ✅ Bajarildi |
| 7 | Vaqt va Davomat | `attendance`, `work-schedules`, `terminals`, `scanner` | AGY (4 dispatch) | T-009 | ✅ Bajarildi |
| 8 | Ta'til/G'oyiblik | `leaves`, `holidays`, `advances` | AGY (3 dispatch) | T-010 | ✅ Bajarildi |
| 9 | Ish haqi | `payroll`, `salary-adjustments` | AGY (2 dispatch) | T-011 | ✅ Bajarildi |
| 10 | Admin | `settings`, `notifications` | **Claude Code** | T-012 | ✅ Bajarildi |

Barcha draft'lar `orcestor/tasks/` papkasida — hali hech biri `task_pending/`ga
jo'natilmagan (dispatch qilinmagan).

## Bog'liqlik tartibi

```
2 (Auth) → 3 (Shared UI Kit) → { 5, 6, 7, 8, 9 } (istalgan tartibda, lekin ketma-ket)
                              → 4 (Dashboard), 10 (Admin) — istalgan vaqtda, mustaqil
```

- **Modul 2** tugamaguncha himoyalangan route'lar ishlamaydi (`authGuard` hali stub).
- **Modul 3** — `DataTable`/`ConfirmDialog` barcha CRUD modullar (5,6,7,8,9) tomonidan
  ishlatiladi. Shuning uchun 5-9 modullar 3-modul tugagandan KEYIN boshlanishi kerak,
  aks holda har birida boshqa-boshqa jadval implementatsiyasi paydo bo'lib, keyin
  qayta yozishga to'g'ri keladi.
- 4 (Dashboard) va 10 (Admin) boshqa modullarga bog'liq emas — istalgan vaqtda,
  parallel ravishda (Claude Code tomonidan) bajarilishi mumkin, chunki ular AGY
  navbatini band qilmaydi.

## AGY resurs nazorati (AGY limiti past bo'lgani uchun)

1. **Ketma-ket dispatch**: bir vaqtning o'zida faqat BITTA AGY-task
   `task_pending/`da bo'ladi. Oldingisi tugab (`response.md` yakunlanib),
   Claude Code tomonidan build/DoD tekshirilib, `task_compliete/`ga
   ko'chirilgandan keyingina navbatdagisi jo'natiladi.
2. **Og'ir tahlil — alohida hujjat**: agar bir task ichida keyingi barcha
   modullarga ta'sir qiluvchi arxitektura qarori bo'lsa (masalan T-005'dagi
   `DataTable` API dizayni), AGY avval `orcestor/analysis/` ichiga qisqa
   tahlil hujjati yozadi, keyin amalga oshirishga o'tadi — shu orqali noto'g'ri
   dizayn tufayli keyingi 5 ta modulni qayta yozishning oldi olinadi.
3. **Yengil modullar — AGY'ga umuman yuborilmaydi**: Modul 4 (Dashboard) va
   Modul 10 (Admin: Settings/Notifications) hajman kichik, arxitektura
   riski past — shuning uchun Claude Code ularni to'g'ridan-to'g'ri o'zi
   yozadi, AGY navbati band qilinmaydi. Task fayli baribir yozilgan —
   rejalashtirish/DoD nazorati izchilligi uchun.

## Bosqich 2 — Sifat va cross-cutting tahlil (Fayzillo so'rovi bilan, 2026-07-25)

10 modul tugagach (yoki parallel ravishda), quyidagi 5 ta qo'shimcha task
qo'shildi — bular vertikal feature emas, butun loyihaga tegishli sifat
auditlari:

| Task ID | Sarlavha | Turi | Bog'liqlik |
|---|---|---|---|
| T-013 | Dark/Light rejim moslik tahlili | Faqat tahlil | — |
| T-014 | Performance holati tahlili | Faqat tahlil | — |
| T-015 | API baseUrl globallashtirish auditi | Tahlil + tuzatish | — |
| T-016 | Tailwind CSS tahlili | Faqat tahlil | — |
| T-017 | Dark/Light rejimni amalga oshirish | Amalga oshirish | **T-013 tugashi shart** |
| T-018 | Dublikat/orphaned fayllar auditi | Tahlil + tuzatish | — (Fayzillo qo'shimcha so'ragan) |

**Holat (2026-07-25):** T-013, T-014, T-015, T-016, T-018 — bajarilgan.
T-017 (amalga oshirish) navbatda.

## Bosqich 3 — Docs, Error handling, Axios (Fayzillo qo'shdi, 2026-07-25 ~22:00)

Hali dispatch qilinmagan, `orcestor/tasks/`da draft. **Bu tasklar YANGI
sessiyada bajariladi** (joriy sessiya bu yerda to'xtaydi):

| Task ID | Sarlavha | Turi | Bog'liqlik |
|---|---|---|---|
| T-020 | API points+types hujjatlashtirish — Core/Auth/Dashboard/Tashkiliy tuzilma | Docs | — |
| T-021 | API points+types hujjatlashtirish — Xodimlar/Davomat/Ta'til | Docs | — (T-020 bilan mustaqil) |
| T-022 | API points+types hujjatlashtirish — Payroll/Admin + yakuniy indeks | Docs | **T-020 va T-021 tugashi shart** |
| T-023 | Error handling darajasi auditi | Faqat tahlil | — |
| T-024 | Axios'ga o'tish — imkoniyat tahlili | Faqat tahlil | — |
| T-025 | Axios'ni amalga oshirish | Amalga oshirish | **T-024 tugashi shart** |

Barchasi `agents/skills/engineering/` personalariga tayanadi, AGY orqali
bajariladi. T-020/T-021 mustaqil (parallel dispatch qilinishi mumkin,
lekin AGY navbati bitta bo'lgani uchun baribir ketma-ket boradi), T-022
ikkalasi tugagach. T-024 avval (tahlil), T-025 undan keyin (T-024
rejasiga qat'iy rioya qilib).

**Muhim topilma (T-016):** `package.json`da Tailwind CSS v4
(`tailwindcss`, `@tailwindcss/postcss`) allaqachon o'rnatilgan va
`src/styles.css`da `@import 'tailwindcss';` bor edi — lekin hozirgача hech
bir komponent Tailwind utility-klasslaridan foydalanmagan (hammasi plain
CSS). Tavsiya (T-016 tahlilida): **aralash/bosqichma-bosqich o'tish** —
yangi komponentlar Tailwind bilan, eskilar tegilmaguncha o'zgarishsiz
qoladi. T-017 (dark/light) shunga qaramay T-013'dagi CSS custom property
sxemasi bo'yicha davom etadi (Tailwind bilan konflikt qilmaydi, kelajakda
`var(--color-*)` Tailwind ichida ham ishlatilishi mumkin).

## Dispatch tartibi (tavsiya)

`T-004 (Auth) → T-005 (Shared UI Kit) → [T-006, T-012 — Claude Code, istalgan vaqtda] → T-007 → T-008 → T-009 → T-010 → T-011`

## Holat (2026-07-25, ~02:25) — 10-MODULLI ASOSIY REJA TO'LIQ TUGADI ✅

Barcha 10 modul (T-003–T-012) bajarilgan va tasdiqlangan. Loyihaning
16 feature + core + shared UI kit + auth to'liq CRUD/funksional holatda,
har bir modul `npm run build` bilan tasdiqlangan.

**Navbatdagi bosqich:** Bosqich 2 — sifat/cross-cutting tahlil (T-013–T-017,
yuqorida). Hali dispatch qilinmagan.

**AGY kvotasi bilan bog'liq tarix:** T-005 boshida Flash tier kvotasi
tugagan edi (~1h50m kutish), keyin Pro modelga (`gemini-3.1-pro-low`)
o'tilgach barcha qolgan modullar (T-005, T-007–T-011) muvaffaqiyatli
bajarildi — Pro model shu sessiya davomida kvota muammosisiz ishladi.

**Ishlatilgan uslub (barcha modullarda tasdiqlangan):**
1. Har bir feature/komponent guruhini alohida, kichik (2-8 fayl) dispatchda jo'natish.
2. Har bir dispatchdan keyin `npm run build` (nafaqat `tsc --noEmit`!) bilan tekshirish.
3. Ba'zan AGY yangi nomli dublikat fayl yaratgan yoki xom `HttpClient`
   ishlatgan — bunday holatlarni fayllarni to'g'ridan-to'g'ri o'qib
   aniqlab, Claude Code qo'lda tuzatgan (Branches, Leaves,
   Salary-adjustments'da bo'lgan).
4. Batafsil: xotira `agy-cli-dispatch-reliability`.
