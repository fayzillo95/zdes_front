# Starter — yangi sessiya uchun holat va davom etish qo'llanmasi

> Bu fayl 2026-07-26 sessiyasi oxirida, context limitiga yaqinlashgani
> sabab yozilgan. Yangi Claude Code sessiyasi shu yerdan davom etadi.

## 1. Loyiha nima

`zdes-frontend` — Angular 21 (SSR, standalone komponentlar, Tailwind
CSS v4) admin panel, `~/Desktop/zdes/zdes_backend` (NestJS) bilan
ishlaydi. Backend `localhost:3000`da `npm run start` (yoki shunga
o'xshash) bilan ishga tushiriladi, frontend `npm start` bilan
`localhost:4200`.

Git remote: `git@github.com:fayzillo95/zdes_front.git`, joriy branch
`main`. `fayzillo95_dev` degan eski branch ham bor (undan `main`ga
merge qilingan, endi asosiy ish `main`da davom etadi).

## 2. Joriy vazifa: Darken dizaynini qo'llash + jadval filterlari

Manba: `demo.templatemonster.com/demo/430969.html` ("Darken" admin
dashboard) — skrinshotlar orqali tahlil qilingan, **to'liq spetsifikatsiya
`project_docs/design-reference.md`da**. YANGI sessiya ENG AVVAL shu
faylni o'qishi kerak — barcha ranglar, patternlar, qoidalar shu yerda.

### Bajarilgan (barchasi commit qilingan, `git log --oneline` orqali ko'ring):
- T-001..T-007: dizayn tokenlari, sidebar/header, dashboard stat-karta,
  status-badge, main-layout, btn-edit/btn-delete/alert ranglari — barchasi
  Tailwind token-asosli (`src/styles.css`dagi `@theme`/`:root[data-theme]`).
- Skeleton loading 14 ta list sahifasida tizimlashtirilgan.
- **T-008/T-008a**: column-level jadval filter patterni ishlab chiqildi
  va qo'llanildi: `branches`, `company`, `employees`, `departments`,
  `advances`, `holidays`, `salary-adjustments` (7 ta sahifa TAYYOR).
- **T-009 (MUHIM TUZATISH bilan)**: "Amallar" ustunidagi tugma patterni
  — dastlab noto'g'ri "edit+delete SVG tugma" deb belgilangan edi,
  keyin foydalanuvchi tuzatdi: **qator (`<tr>`) allaqachon `onRowClick`
  orqali edit sahifasiga o'tadi, shuning uchun alohida edit tugmasi
  KERAK EMAS — faqat delete tugmasi qoladi** (`(click)="$event.stopPropagation()"`
  bilan). Bu qoida `design-reference.md` bo'lim 3.3'da yakuniy holatda
  yozilgan — YANGI SESSIYA buni oldingi (noto'g'ri) versiyasi bilan
  aralashtirmasligi kerak.

### Qolgan ish (navbatdagi tasklar, T-010b/c kabi nomlash mumkin):
Column-level filter hali qo'shilmagan sahifalar — `design-reference.md`
bo'lim 3.2 (filter patterni) + 3.3 (delete-only actions-cell) ga rioya
qilib qo'shish kerak:
- `leaves/pages/leave-list` — Turi(select enum), Boshlanish/Tugash
  sana(date x2), Xodim(matn). Actions allaqachon delete-only, TEGMANG.
- `positions/pages/position-list` — Lavozim nomi/Kompaniya/Filial/
  Bo'lim(matn). Actions endi delete-only (T-010a'da tuzatilgan).
- `terminals/pages/terminal-list` — Nomi/Filial ID/IP manzil(matn).
  Actions endi delete-only.
- `work-schedules/pages/work-schedule-list` — Grafik nomi/Kompaniya/
  Filial(matn), Birlamchi(select). Actions allaqachon delete-only,
  TEGMANG (edit tugmasi hech qachon bo'lmagan).
- `attendance/pages/attendance-list` — Xodim(matn, `getEmployeeName`
  orqali)/Sana(date)/Holat(select present/absent/late). Bu sahifada
  Amallar ustuni UMUMAN YO'Q — filter QO'SHILADI, actions'ga tegilmaydi.
- `payroll/pages/payroll-list` — Xodim ID(matn)/Davr(matn). Amallar
  ustuni T-010a'da butunlay olib tashlangan (qator bosilishi bilan
  bir xil joyga o'tar edi) — filter QO'SHILADI, actions qaytarilmaydi.

**Ishlash usuli:** har bir sahifa uchun `orcestor/tasks/T-0XX.md` yozing
(shablon: `orcestor/prompt.md` yoki oldingi `orcestor/task_compliete/
T-008a.md`/`T-010a.md`dan nusxa oling), `agy --print --model
gemini-3.1-pro-low --add-dir <repo> --dangerously-skip-permissions
--mode accept-edits` bilan dispatch qiling, natijani **HAR DOIM**
`git diff` + `npm run build` bilan tekshiring (agy'ning o'z "muvaffaqiyat"
xabariga hech qachon ishonmang — ko'p marta noto'g'ri/qisman natija
"to'liq bajarildi" deb qaytargan). 2-3 sahifadan ko'p bo'lmagan
guruhlarda dispatch qiling (kattaroq guruhlarda agy adashishi mumkin).

## 3. Muhim qoidalar (unutmang)

- **Backend kodiga (`~/Desktop/zdes/zdes_backend`) hech qachon
  tegilmaydi** — faqat integratsiyani tekshirish uchun ishga tushiriladi
  (`localhost:3000`).
- Darken referensidagi e-commerce widget'lar (Sales/Vendors/Country)
  **hech qachon soxta data bilan qayta yaratilmaydi** — faqat haqiqiy
  backend ma'lumotlari asosida ishlanadi (`design-reference.md` bo'lim
  3, "MUHIM CHEKLOV").
- Mexanik/CSS-only o'zgarishlarni **agy'ga dispatch qiling** (Claude
  tokenini tejash uchun, foydalanuvchi aniq so'ragan) — faqat murakkab/
  ko'p faylli logika o'zgarishlarini (masalan skeleton loading kabi)
  o'zingiz to'g'ridan-to'g'ri bajaring.
- `orcestor/task_compliete/` papkasining nomi ATAYLAB shunday yozilgan
  ("compliete", "complete" emas) — agy ba'zan to'g'ri imlo bilan yangi
  papka yaratib qo'yadi, buni har safar tekshirib, to'g'ri papkaga
  ko'chiring.
- Har bir agy dispatch'dan keyin: `git status --short` (stray fayl
  yo'qligini tekshirish), `git diff` (faqat kerakli fayllar
  o'zgarganini tasdiqlash), `npm run build` (IDE diagnostikasi ba'zan
  yolg'on/eskirgan signal beradi — faqat `ng build` natijasiga
  ishoning), keyin `orcestor/status/T-0XX.log` yozib, commit qiling.

## 4. Yangi: PostgreSQL orkestratsiya DB'si (2026-07-26 oxirida yaratildi)

Foydalanuvchi `~/Desktop/zdes/orcestor/db/schema.sql`dagi kabi DB-asosli
task-tracking'ga o'tishni so'radi (hozirgi `orcestor/` hali fayl-asosli).
Shu sessiyada FAQAT infratuzilma tayyorlandi, sxema/integratsiya HALI
YOZILMAGAN:
- Postgres rol: `fayzillo95` (parol foydalanuvchida, bu faylga
  yozilmagan — xavfsizlik qoidasi: sirlar task/status fayllariga
  yozilmaydi, `orcestor/requirements.MD` band 4).
- DB: `f_95_github_z_front_orcestor_db` (egasi `fayzillo95`,
  `localhost:5432`).
- Namuna sxema (ko'rib chiqish uchun, ko'chirilmagan):
  `~/Desktop/zdes/orcestor/db/schema.sql` — `tasks`/`task_events`/
  `changed_files` jadvallari.

**Keyingi qadam (agar foydalanuvchi xohlasa):** shunga o'xshash sxemani
`f_95_github_z_front_orcestor_db`ga qo'llash, `orcestor/dispatch.py`ni
DB'ga ulash (yoki DB'ni faqat status/tarix uchun qo'shimcha sifatida
ishlatish, fayl-asosli workflow'ni saqlagan holda — bu arxitekturaviy
qaror, foydalanuvchi bilan kelishilishi kerak).

## 5. Tezkor boshlash checklist

1. `project_docs/design-reference.md` to'liq o'qing (ayniqsa bo'lim 3.2, 3.3).
2. `git log --oneline -15` bilan oxirgi ishni ko'ring.
3. Backend ishga tushirilganini tekshiring: `curl -s http://localhost:3000/api/v1/branches` (401 kutiladi, bu backend ishlayotganini bildiradi).
4. Frontend kerak bo'lsa: `npm start` (background), `http://localhost:4200`.
5. Bo'lim 2'dagi "Qolgan ish" ro'yxatidan davom eting.
