# AGY uchun Standart Topshiriq Shabloni (Prompt Template)

Bu fayl — `zdes-frontend` loyihasidagi fayl-asosidagi multi-agent orkestratsiya
tizimining bir qismi. Claude Code **orkestrator** rolini o'ynaydi: u har bir
topshiriqni shu shablon asosida to'ldiradi va tayyor matnni yozadi. Inson
supervayzer **Fayzillo** o'sha tayyor matnni qo'lda ko'chirib, Google
Antigravity IDE ichidagi **AGY** (Gemini-asoslangan sub-agent) ning
"New Task" maydoniga joylashtiradi va uni Agent Manager orqali ishga
tushiradi.

Maqsad — har bir topshiriq bir xil, taxmin qilinadigan formatda kelishi,
shunda AGY kontekstni tez tushunadi, ish doirasidan chetga chiqmaydi va
natijani qayerga yozish kerakligini biladi.

> **Muhim:** Bu faylning o'zi shablon hisoblanadi. Har bir yangi topshiriq
> uchun quyidagi blokni nusxalab, `{{...}}` joy egallovchilarni to'ldiring va
> tayyor natijani Fayzilloga bering (masalan `orcestor/tasks/` ichiga alohida
> fayl sifatida saqlab, keyin uni Antigravity'ga joylashtirish mumkin).

---

## 1. Shablon (nusxa ko'chirish uchun)

```markdown
## Task ID: {{TASK_ID}}
### Sarlavha: {{TASK_TITLE}}

**Maqsad (Goal):**
{{GOAL}}
<!-- Bitta aniq, o'lchanadigan gap. "Nima qilinishi kerak" — tugagan holat. -->

**Kontekst (Context):**
{{CONTEXT}}
<!-- Angular kodbazasining qaysi qismi bilan bog'liq: modul, komponent,
     servis. Butun faylni joylashtirmang — faqat yo'llarni (path) bering. -->

**Cheklovlar (Constraints):**
{{CONSTRAINTS}}
<!-- Masalan: X faylga tegmang; mavjud kod uslubiga (style) rioya qiling;
     yangi dependency qo'shishdan oldin so'rang; mavjud testlarni buzmang. -->

**Ish doirasidagi fayllar (Files in scope):**
{{FILES_IN_SCOPE}}
<!-- Aniq fayl/papka yo'llari ro'yxati (relative path, repo root'dan). -->

**Bajarilgan deb hisoblanish mezoni (Definition of Done):**
{{DEFINITION_OF_DONE}}
<!-- Aniq va tekshiriladigan: qanday xatti-harakat kutilyapti, qaysi fayllar
     yaratilishi kerak, qaysi testlar/lint/build o'tishi kerak. -->

**Tavsiya etilgan Antigravity rejimi (Mode):**
{{MODE}}
<!-- Agent-driven / Review-driven / Agent-assisted ichidan bittasi. -->

**Natijani qayerga yozish kerak (Report back):**
- Ishlash davomida **har bir muhim qadamni** darhol
  `orcestor/task_pending/{{TASK_ID}}-response.md` fayliga yozib boring
  (fayl mavjud bo'lmasa, yarating). Bu — jonli jurnal (log): nima qilinyapti,
  qaysi fayllar yaratildi/o'zgartirildi, qanday qarorlar qabul qilindi,
  qanday muammolarga duch kelindi. Claude Code shu faylni kuzatib borib,
  ishning borishini nazorat qiladi — shuning uchun bo'sh yoki umumiy
  jumlalar emas, aniq va tekshiriladigan yozuvlar kerak (masalan: "T14:32 —
  `src/app/shared/components/loading-spinner/loading-spinner.component.ts`
  yaratildi").
- Topshiriq to'liq bajarilgach:
  1. `{{TASK_ID}}-response.md` oxiriga yakuniy xulosa qo'shing (nima
     o'zgardi, qaysi fayllar tegdi, Definition of Done mezonlari
     tekshirilganmi).
  2. Xulosadan keyin, aynan shu formatda **"O'zgargan fayllar" jadvali**ni
     qo'shing — bu Claude Code'ga review paytida faylni to'liq o'qimasdan,
     faqat kerakli faylga nuqtali `git diff` qilish imkonini beradi:

     ### O'zgargan fayllar
     | Fayl | Turi | Qisqa sabab |
     |---|---|---|
     | src/app/shared/components/ui/data-table/data-table.ts | yangi | Generic DataTable komponenti yozildi |
     | src/app/core/services/http.ts | o'zgartirilgan | Xato holatini handle qilish qo'shildi |

     Turi ustuni faqat: `yangi` / `o'zgartirilgan` / `o'chirilgan`. Har bir
     qatordagi "Qisqa sabab" bitta qisqa jumla bo'lsin — bu jadval to'liq
     bo'lmasa yoki umumiy ("kod yozildi" kabi) bo'lsa, review qiyinlashadi
     va butun faylni qayta o'qishga to'g'ri keladi — bu esa aynan shu
     jadval oldini olishi kerak bo'lgan narsa.
  3. `orcestor/task_pending/{{TASK_ID}}.md` va
     `orcestor/task_pending/{{TASK_ID}}-response.md` ikkalasini ham
     `orcestor/task_compliete/` papkasiga ko'chiring (move qiling).
```

---

## 2. Maydonlar tavsifi

| Maydon | Tavsif |
|---|---|
| `{{TASK_ID}}` | Qisqa, noyob identifikator, masalan `T-014` yoki `2026-07-24-loader` |
| `{{TASK_TITLE}}` | Bir qatorli, inson o'qiy oladigan sarlavha |
| `{{GOAL}}` | Bitta jumla — aniq va o'lchanadigan natija |
| `{{CONTEXT}}` | Angular kodbazaning tegishli qismi + fayl yo'llariga havolalar |
| `{{CONSTRAINTS}}` | Nimalarga tegmaslik, qanday uslubga rioya qilish, yangi paket qo'shish siyosati |
| `{{FILES_IN_SCOPE}}` | Faqat shu fayllar/papkalar bilan ishlash kerak bo'lgan ro'yxat |
| `{{DEFINITION_OF_DONE}}` | Tekshiriladigan mezonlar: xatti-harakat, fayllar, testlar, build/lint holati |
| `{{MODE}}` | Antigravity'ning o'zidagi rejimlardan biri: **Agent-driven**, **Review-driven** yoki **Agent-assisted** |

---

## 3. To'ldirilgan namuna (misol uchun)

Quyida "loading spinner komponenti qo'shish" kabi kichik Angular topshirig'i
uchun to'liq to'ldirilgan namuna keltirilgan — Fayzillo shablon qanday
ishlashini ko'rishi uchun.

```markdown
## Task ID: T-021
### Sarlavha: Umumiy loading spinner komponentini qo'shish

**Maqsad (Goal):**
`shared` modulida qayta ishlatiladigan `LoadingSpinnerComponent` yaratish va
uni HTTP so'rovlar davomida ko'rsatish uchun tayyor holga keltirish.

**Kontekst (Context):**
Loyiha Angular standalone komponentlar arxitekturasidan foydalanadi.
Umumiy UI elementlari `src/app/shared/components/` papkasida joylashgan
(masalan `src/app/shared/components/button/`). Interceptor'lar
`src/app/core/interceptors/` da joylashgan — agar kerak bo'lsa,
`loading.interceptor.ts` shu yerda bo'lishi mumkin.

**Cheklovlar (Constraints):**
- Mavjud `shared/components/button` komponentining fayl strukturasi va
  nomlash uslubiga rioya qiling (`.ts`, `.html`, `.scss` alohida fayllarda).
- Yangi npm dependency qo'shmang — faqat mavjud Angular va SCSS imkoniyatlari
  bilan cheklaning.
- Boshqa modullarga (masalan `auth`, `dashboard`) tegmang.
- Global stil fayllarini (`styles.scss`) o'zgartirmang, faqat komponent
  ichidagi lokal SCSS ishlating.

**Ish doirasidagi fayllar (Files in scope):**
- `src/app/shared/components/loading-spinner/` (yangi papka, yaratiladi)
- `src/app/shared/shared.module.ts` yoki eksport qiluvchi `index.ts` (agar mavjud bo'lsa)

**Bajarilgan deb hisoblanish mezoni (Definition of Done):**
- `LoadingSpinnerComponent` standalone komponent sifatida yaratilgan va
  boshqa komponentlarda `<app-loading-spinner>` ko'rinishida import qilib
  ishlatsa bo'ladi.
- Komponent `visible` (yoki shunga o'xshash) `@Input()` orqali
  ko'rsatilishi/yashirilishi boshqariladi.
- `ng build` va `ng lint` xatosiz o'tadi.
- Vizual ravishda spinner markazlashgan, animatsiyali va mavjud dizayn
  uslubiga (rang, radius) mos keladi.

**Tavsiya etilgan Antigravity rejimi (Mode):**
Agent-driven — vazifa kichik, izolyatsiyalangan va aniq ta'riflangan, shuning
uchun AGY to'liq mustaqil bajarishi mumkin.

**Natijani qayerga yozish kerak (Report back):**
- Holat va izohlarni `orcestor/task_pending/T-021-response.md` fayliga
  yozib boring.
- Tugagach, yakuniy xulosa va quyidagi "O'zgargan fayllar" jadvalini
  qo'shing:

  ### O'zgargan fayllar
  | Fayl | Turi | Qisqa sabab |
  |---|---|---|
  | src/app/shared/components/loading-spinner/loading-spinner.ts | yangi | Standalone spinner komponenti |
  | src/app/shared/components/loading-spinner/loading-spinner.html | yangi | Spinner shabloni |
  | src/app/shared/components/loading-spinner/loading-spinner.scss | yangi | Animatsiya va markazlashtirish stillari |

- Ikkala faylni (`T-021.md`, `T-021-response.md`) `orcestor/task_compliete/`
  ga ko'chiring.
```

---

## 4. Eslatma

Har doim to'ldirilgan promptni **qisqa va aniq ish doirasida** ushlab
turing. Butun fayl tarkibini prompt ichiga joylashtirmang — buning o'rniga
fayl yo'llariga (path) havola bering. Bu ikkala tomonda ham (Claude Code
tokenlari va AGY konteksti) resurslarni tejaydi va AGY'ning diqqatini
kerakli joyga jamlaydi.
