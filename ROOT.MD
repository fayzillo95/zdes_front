# ROOT.MD — `zdes-frontend` loyihasining bosh hujjati

> Bu fayl butun loyiha uchun **kirish nuqtasi** (entry point) va **mundarija** (table of contents) vazifasini bajaradi. Bu yerda batafsil hujjatlar emas, balki hamma narsaning qayerda ekanligiga havolalar bor.

## 1. Loyiha shaxsiyati (Project Identity)

- **Loyiha nomi:** `zdes-frontend`
- **Turi:** Angular frontend loyihasi
- **Egasi / asosiy dasturchi:** Fayzillo (intern developer)
- **Muloqot tili:** Claude Code Fayzillo bilan doim **o'zbek tilida** javob beradi (status xabarlari, tushuntirishlar, xulosalar). Kod, fayl nomlari, o'zgaruvchi/funksiya nomlari va texnik terminlar odatdagidek ingliz tilida qoladi — faqat inson bilan muloqot tili o'zbekcha.
- **Joriy holat:** Loyihaga fayl-asosidagi ko'p-agentli orkestratsiya tizimi (multi-agent orchestration system) o'rnatildi va ishga tushirildi. **T-001** (agency-agents'dan `agents/skills/` ga persona fayllar olib kelindi), **T-002** (`orcestor/dispatch.py` yozildi) va **BOSQICH 1 va 2 TO'LIQ TUGADI (2026-07-25, ~22:05).** T-003–T-012
(10-modulli asosiy CRUD reja) va T-013–T-019 (sifat/cross-cutting: dark/light
rejim, performance tahlili, API audit, Tailwind tahlili, dublikat fayllar
auditi, barcha komponentlarda OnPush+takeUntilDestroyed) — barchasi
tasdiqlangan va `orcestor/task_compliete/` da. To'liq jadval:
[`./orcestor/module-plan.md`](./orcestor/module-plan.md). **Navbatdagi
bosqich (YANGI sessiyada bajariladi):** Bosqich 3 — T-020–T-022 (API
docs), T-023 (error handling auditi), T-024–T-025 (Axios'ga o'tish tahlili
+ amalga oshirish) — `orcestor/tasks/`da draft, hali dispatch qilinmagan.
Tezkor holat va qoidalar: [`./starter.md`](./starter.md). **Muhim
ishlatilgan uslub:** har bir AGY-task kichik (2-8 fayl) qismlarga bo'lib
jo'natildi, har birida `npm run build` (nafaqat `tsc --noEmit`) bilan
tekshirildi; Flash model kvotasi tugaganda `gemini-3.1-pro-low`ga
o'tildi. Batafsil: xotira (`agy-cli-dispatch-reliability`,
`machine-resources`).
- **Terminal orqali kashfiyot:** Claude Code `agy` CLI buyrug'ini (`agy --print "..." --add-dir <loyiha> --mode accept-edits --dangerously-skip-permissions`) to'g'ridan-to'g'ri terminaldan chaqira oladi. Bu — **bitta-yo'nalishli (fire-and-forget) dispatch**, interaktiv suhbat emas: Claude Code to'liq, o'z-o'zidan yetarli vazifa matnini yuboradi, AGY uni mustaqil bajarib tugatadi va natija qaytadi. Ishlash jarayonida real vaqtda qo'shimcha ko'rsatma berib bo'lmaydi — shuning uchun har bir vazifa oldindan to'liq va aniq ta'riflangan bo'lishi shart (pastdagi rolga qarang).

Rollar:

| Rol | Kim | Vazifasi |
|---|---|---|
| Orchestrator | **Claude Code** | Reja tuzadi, vazifalarni taqsimlaydi (dispatch — `agy` CLI orqali to'g'ridan-to'g'ri yoki Fayzillo orqali qo'lda), kodni ko'rib chiqadi va integratsiya qiladi. Texnik jihatdan yakuniy qaror qabul qiluvchi (final authority). |
| Sub-agent / Executor | **AGY** (Google Antigravity IDE / `agy` CLI, Gemini asosida) | Mustaqil bajaradi, lekin faqat **bitta-yo'nalishli (fire-and-forget) chaqiruv** orqali — real vaqtda interaktiv boshqarib bo'lmaydi. Har bir vazifa oldindan to'liq va o'z-o'zidan yetarli (self-contained) bo'lishi shart. |
| Supervisor / Bridge | **Fayzillo (inson)** | Kerak bo'lganda (masalan Antigravity GUI orqali) vazifalarni qo'lda uzatadi; barcha muhim qarorlarga ruxsat beradi. |

### 1.1. Avtonom rejim qarori (2026-07-25)

Fayzillo ushbu sanada Claude Code'ga quyidagi vakolatni berdi: qolgan barcha
modullar (T-004 dan T-011 gacha) uchun `agy` CLI'ni **to'g'ridan-to'g'ri
o'zi** chaqirsin — Fayzilloning qo'lda Antigravity GUI'ga ko'chirib
qo'yishini kutmasdan. Sabab: Fayzillo uxlashga ketmoqda va ketma-ket
bir nechta modulni real vaqtda qo'lda uzatib turolmaydi.

Amaldagi qoidalar (shu sana uchun kelishilgan cheklovlar):
- Ruxsat qamrovi: faqat shu loyiha yo'li (`~/Desktop/zdes-frontend`) doirasida.
- AGY-task'lar **qat'iy ketma-ket** dispatch qilinadi (bir vaqtda faqat bitta
  `task_pending/`da) — AGY resursi (limiti past) behuda sarflanmasligi uchun.
- Claude Code har bir AGY natijasini (`ng build` + `tsc --noEmit` + DoD
  solishtirish) o'zi tekshiradi va faqat shundan keyin `task_compliete/`ga
  yopadi — `orcestor/requirements.MD`dagi "Review majburiy" qoidasi
  o'zgarmagan, faqat Fayzilloning qo'lda-uzatish bosqichi vaqtincha
  o'tkazib yuborilgan.
- `main`/production branchga hech narsa push qilinmaydi, hech narsa
  `git commit` qilinmaydi — bu Fayzillo tomonidan alohida so'ralmaguncha
  amal qiladi (umumiy qoida, `CLAUDE.md`/tizim ko'rsatmasi).
- Auth (T-004) kabi xavfsizlik-sezgir modullar ham shu tartibda bajariladi,
  lekin Claude Code yakuniy xulosada bunday modullarni Fayzillo uyg'ongach
  qo'lda qayta ko'rib chiqishi tavsiya etilgan modul sifatida alohida
  belgilaydi (`orcestor/requirements.MD`, 4-bo'lim — Eskalatsiya qoidasi
  ruhida).
- To'liq modul reja va navbat: [`./orcestor/module-plan.md`](./orcestor/module-plan.md).

## 2. Ishchi zanjir (Pipeline / Chain)

Loyihaning butun oqimi quyidagi qat'iy tartibda ishlaydi:

```
session/ → history/ → ROOT.MD → orcestor/ → steps/
```

- **[`./session/`](./session/)** — har bir sessiyaning xronologik loglari: muhokamalar va qabul qilingan qarorlar, bitta sessiya — bitta fayl.
- **[`./history/`](./history/)** — loyiha tarixining qisqartirilgan (distilled) versiyasi va AGY bilan bo'lgan oldingi suhbatlar xulosasi. **Diqqat:** bu `orcestor/history/` bilan bir xil emas — ikkinchisi orkestratsiya siklidagi tugagan vazifalarning arxivi (qarang: `orcestor/README.MD`, 3-bo'lim), bu yerdagisi esa umumiy sessiya tarixi.
- **`ROOT.MD`** — aynan shu fayl: butun loyiha uchun bosh havola nuqtasi, hammasini bir-biriga bog'laydi.
- **[`./orcestor/README.MD`](./orcestor/README.MD)** — operatsion orkestratsiya tizimi: arxitektura, qoidalar (`requirements.MD`), vazifa shabloni (`prompt.md`), va navbat papkalari (`tasks/`, `task_pending/`, `task_compliete/`, `status/`, `history/`).
- **[`./orcestor/steps/`](./orcestor/steps/)** — bosqichma-bosqich ishlash workflow'i (tartiblangan qadamlar).

Har bir bosqich o'zidan oldingisiga tayanadi: sessiya loglari tarixga aylanadi, tarix esa ROOT.MD orqali orkestratsiya tizimiga, u esa aniq qadamlarga olib boradi.

> **Eslatma:** yuqoridagi zanjir — ma'lumot qanday **distillanib boradi** (session → history → ...) degan tartib, u agentning **qayerdan o'qishni boshlashi kerak** degan tartib emas. Ish boshlashda har doim aynan `ROOT.MD`dan boshlanadi (pastdagi 4-bo'limga qarang) — u yerdan kerakli bo'limga (session/history/orcestor/steps) o'tiladi.

## 3. Havolalar (References)

- **Orkestratsiya tizimi:** [`./orcestor/`](./orcestor/) — barcha operatsion qoidalar, prompt shablonlari va vazifa navbatlari shu yerda.
- **agency-agents (integratsiya qilingan):** https://github.com/msitarzewski/agency-agents — 230+ qayta ishlatiladigan AI agent persona ta'riflari kutubxonasi. Loyihaga tegishli qismi (T-001 orqali) [`./agents/skills/`](./agents/skills/) ichiga olib kelingan — `MANIFEST.md` ga qarang. Har bir modul uchun step yozishda shu persona fayllardan (masalan `engineering/`, `project-management/`) uslub va workflow sifatida foydalaniladi.
- **`./README.md`** — bu **ROOT.MD emas**! Bu Angular loyihasining original, oldindan mavjud bo'lgan readme fayli (Angular CLI tomonidan yaratilgan standart hujjat: build, serve, test buyruqlari haqida). Ikkalasini bir-biriga aralashtirmaslik kerak.

## 4. Asosiy tizim prompti (Main System Prompt)

> Quyidagi blok — Claude Code (yoki har qanday boshqa orchestrator) ushbu repo ustida ishlashni boshlaganda **birinchi navbatda o'qishi kerak bo'lgan** placeholder/starter system prompt.

```
Sen "zdes-frontend" Angular loyihasi uchun ORCHESTRATOR sifatida ishlayapsan.

ROL CHEGARALARI:
- Sen reja tuzasan, vazifalarni ta'riflaysan, kodni ko'rib chiqasan va integratsiya qilasan.
- Amaliy bajarish (execution) ko'p hollarda AGY (Google Antigravity IDE, Gemini) orqali amalga oshiriladi.
- AGY bilan orada TO'G'RIDAN-TO'G'RI API BOG'LANISH YO'Q. Barcha vazifalar Fayzillo
  (inson supervisor) orqali QO'LDA (manual relay) uzatiladi va natijalar ham qo'lda qaytariladi.
- Shuning uchun vazifalarni AGY uchun aniq, o'z-o'zidan yetarli (self-contained) va
  `orcestor/prompt.md` shabloniga mos qilib yoz.

QOIDALARNI QAYERDAN TOPISH KERAK:
- Barcha rollar, qoidalar va cheklovlar: `orcestor/requirements.MD`
- Orkestratsiya arxitekturasi: `orcestor/README.MD`
- Vazifa dispatch shabloni: `orcestor/prompt.md`
- Bosqichma-bosqich workflow: `orcestor/steps/`

QARORLARNI QAYERGA YOZISH KERAK:
- Har bir sessiyadagi muhokama va qarorlarni `session/` papkasiga, sana bo'yicha
  nomlangan faylga yoz (masalan: `session/YYYY-MM-DD-mavzu.md`).
- Muhim, uzoq muddatli xulosalarni vaqti-vaqti bilan `history/` papkasiga distillashtirib qo'y.

ASOSIY ISHLASH PRINSIPI:
- Har doim ROOT.MD dan boshla → kerakli havola bo'yicha session/history/orcestor/steps
  ichiga kir → ishni bajar → natijani session/ ga logla.
- AGY mustaqil, ammo unga faqat BITTA-YO'NALISHLI (fire-and-forget) chaqiruv orqali
  murojaat qilinadi — `agy` CLI orqali to'g'ridan-to'g'ri yoki Fayzillo orqali qo'lda.
  Har ikkala holatda ham unga REAL VAQTDA, interaktiv tarzda qo'shimcha buyruq
  bera olmaysan — vazifa boshidanoq to'liq va o'z-o'zidan yetarli bo'lishi shart.

MODUL-MODUL STEP YOZISH QOIDASI (agents/skills/ dan foydalanib):
- Loyihani (yoki uning katta qismini) bir vaqtning o'zida hamma joyga step
  yozib tashlamaysan. Buning o'rniga: BITTA modulni olasan → shu modul uchun
  step(lar)ni `agents/skills/` dagi tegishli persona (masalan
  engineering-frontend-developer.md, engineering-senior-developer.md) uslubi
  va workflow'iga tayanib yozasan → AGY'ga beradi (dispatch) → bajarilishini
  kutasan va tekshirasan (Definition of Done, response.md) → shundan keyingina
  IKKINCHI modulga o'tasan.
- Shu tartibda barcha modullar orqali ketma-ket (sequentially) o'tasan — bir
  vaqtda bir nechta modulni parallel step'lamaysan.
- Orkestratsiya/rejalashtirish uslubi uchun `agents/skills/project-management/`
  dagi persona fayllardan (masalan project-management-project-shepherd.md)
  foydalanish mumkin — ayniqsa ko'p-modulli reja va status hisobotini
  tuzishda.
```

---
*Ushbu hujjat qisqa va yo'naltiruvchi bo'lishi kerak — batafsil ma'lumot uchun yuqoridagi havolalarga o'ting.*
