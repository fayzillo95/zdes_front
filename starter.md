# starter.md — Sessiya tiklash uchun tezkor holat fayli

> Agar joriy Claude Code sessiyasi kontekst to'lishi (compaction) yoki
> uzilish sababli tiklansa — **yoki yangi sessiya shu loyihada ishni
> davom ettirsa** — shu fayldan boshlang. Pastda: (1) hujjatlar xaritasi,
> (2) hozirgi holat, (3) darhol ishlatsa bo'ladigan davom ettirish
> prompti.

**Oxirgi yangilanish:** 2026-07-25, ~03:36 — `app.html`da router-outlet
yo'qligi (barcha marshrutlar ishlamasligi) va `login.css`dagi
rang-o'zgaruvchi to'qnashuvi (matn fon bilan bir xil rangda, ko'rinmas)
buglari tuzatildi. Batafsil: [`session/2026-07-25-app-shell-va-login-css-buglari.md`](./session/2026-07-25-app-shell-va-login-css-buglari.md).
Bosqich 3 (T-020–T-031) hali dispatch qilinmagan — pastdagi holat
o'zgarishsiz qoladi.

---

## 1. Hujjatlar xaritasi (barcha `.md` fayllar)

### Kirish nuqtasi va qoidalar
| Fayl | Vazifasi |
|---|---|
| [`ROOT.MD`](./ROOT.MD) | Loyihaning bosh hujjati — kirish nuqtasi, rollar (Claude Code/AGY/Fayzillo), muloqot tili qoidasi (1.1-bo'lim), pipeline (`session→history→ROOT.MD→orcestor→steps`) |
| `starter.md` | **Shu fayl** — tezkor holat + davom ettirish prompti |
| `README.md` | Angular CLI standart readme (build/serve buyruqlari) — ROOT.MD bilan aralashtirmaslik |

### Orkestratsiya tizimi (`orcestor/`)
| Fayl | Vazifasi |
|---|---|
| `orcestor/README.MD` | Orkestratsiya arxitekturasi: task lifecycle (`tasks/→task_pending/→task_compliete/→status/`), papkalar tavsifi |
| `orcestor/requirements.MD` | Majburiy qoidalar: rollar jadvali, hard rules, eskalatsiya qoidasi, token intizomi, **6-bo'lim: AGY kvota/model-switch qoidasi** |
| `orcestor/prompt.md` | AGY uchun standart task-shablon (`dispatch.py new` shu yerdan o'qiydi) |
| `orcestor/module-plan.md` | 3 bosqichli to'liq reja (10 asosiy modul + sifat auditi + docs/axios/perf), har bosqichning holati va topilmalari |
| `orcestor/tasklist.md` | **Barcha T-001..T-031 holatining bitta jadvali** (qisqa, holat ustuni bilan) |
| `orcestor/tasks/tasklist.md` | Faqat hali draft (dispatch qilinmagan) tasklarning **qisqa xulosasi** — bog'liqlik, fayllar, 1-2 gap tavsif (to'liq faylni ochmasdan tez tushunish uchun) |
| `orcestor/steps/*.md` | Umumiy ish-oqimi bosqichlari (01-intake → 06-logging) — kontseptual, kam ishlatiladi |

### Task fayllari (har biri to'liq: Goal/Kontekst/Cheklovlar/DoD)
- `orcestor/tasks/T-0XX.md` — draft, hali jo'natilmagan
- `orcestor/task_pending/T-0XX.md` (+ `-response.md`) — jarayonda
- `orcestor/task_compliete/T-0XX.md` (+ `-response.md`) — tugagan, 19 ta juftlik (T-001..T-019)

### Tahlil hujjatlari (`orcestor/analysis/`)
| Fayl | Qaysi task yozgan | Mazmuni |
|---|---|---|
| `T-005-datatable-api.md` | T-005 | DataTable komponent API dizayni |
| `T-013-dark-light-analysis.md` | T-013 | Dark/Light CSS o'zgaruvchilar sxemasi + ustuvorlik ro'yxati |
| `T-014-performance-analysis.md` | T-014 | Chunk hajmlari, OnPush, subscription, DataTable pagination topilmalari |
| `T-015-api-audit.md` | T-015 | Barcha servis `Http`dan foydalanishi auditi (15/15 to'g'ri) |
| `T-016-tailwind-analysis.md` | T-016 | Tailwind allaqachon o'rnatilgani + bosqichma-bosqich o'tish tavsiyasi |
| `T-018-duplicates.md` | T-018 | Dublikat fayllar auditi (0 topildi, oldin qo'lda 6 tasi tozalangan edi) |

### Sessiya loglari (`session/`)
| Fayl | Mazmuni |
|---|---|
| `2026-07-24-orchestration-setup.md` | Orkestratsiya tizimini qurish sessiyasi (birinchi kelishuvlar) |
| `2026-07-25-handoff-to-other-claude.md` | Ikkinchi (permission) sessiyadan xabar: `dispatch.py check` qo'shilgani, permission holati |
| `2026-07-25-app-shell-va-login-css-buglari.md` | App shell router-outlet yo'qligi va login.css rang-o'zgaruvchi to'qnashuvi buglari tuzatilishi |

### Agent persona fayllari (`agents/skills/`)
`engineering/engineering-{frontend,senior}-developer.md`,
`project-management/*.md`, `integrations/{antigravity,gemini-cli}/README.md`,
`MANIFEST.md` — task yozishda persona/uslub sifatida ishlatiladi (har bir
`T-0XX.md`ning "Persona/uslub" bandida ko'rsatilgan).

---

## 2. Hozirgi holat (2026-07-25, ~22:40)

- **Bosqich 1 (T-003–T-012, 10 asosiy modul):** ✅ TUGAGAN.
- **Bosqich 2 (T-013–T-019, sifat auditi):** ✅ TUGAGAN.
- **Bosqich 3 (T-020–T-031, docs/error-handling/axios/performance):** 📝
  Barcha 12 tasi `orcestor/tasks/`da to'liq yozilgan, **hali BIRORTASI
  dispatch qilinmagan.**

To'liq holat jadvali: [`orcestor/tasklist.md`](./orcestor/tasklist.md).
Draft tasklar tezkor xulosasi: [`orcestor/tasks/tasklist.md`](./orcestor/tasks/tasklist.md).

**Tavsiya etilgan dispatch tartibi** (`orcestor/tasks/tasklist.md` oxiridan):
```
T-020 → T-021 → T-022        (docs, ketma-ket)
T-023                         (mustaqil, istalgan vaqt)
T-024 → T-025                 (axios, ketma-ket)
T-026 → T-027 → T-028 → T-031 (DataTable, qat'iy ketma-ket)
T-029                         (mustaqil)
T-030                         (mustaqil)
```

---

## 3. Davom ettirish prompti (yangi sessiya uchun — to'g'ridan-to'g'ri ishlatish mumkin)

> Quyidagini yangi Claude Code sessiyasiga (yoki shu sessiyaga keyinroq)
> to'g'ridan-to'g'ri kiritish mumkin:

```
zdes-frontend loyihasida orchestrator sifatida davom et. Avval ROOT.MD,
keyin starter.md ni o'qi (u yerda hujjatlar xaritasi va joriy holat bor).

Qisqacha: Bosqich 1 va 2 (T-003–T-019, 10 asosiy modul + sifat auditi)
to'liq tugagan. Bosqich 3 (T-020–T-031 — API docs, error handling audit,
Axios migratsiyasi, performance/UX seriyasi) hali dispatch qilinmagan,
barchasi orcestor/tasks/ da to'liq yozilgan.

Vazifang: orcestor/tasks/tasklist.md dagi tavsiya etilgan tartibda
(T-020→T-021→T-022, T-023 mustaqil, T-024→T-025, T-026→T-027→T-028→T-031,
T-029 va T-030 mustaqil) har birini ketma-ket AGY orqali (`agy` CLI)
dispatch qil, tekshir, yop:

1. `python3 orcestor/dispatch.py send T-0XX`
2. `agy --print "..." --add-dir <loyiha yo'li> --mode accept-edits
   --dangerously-skip-permissions --model gemini-3.1-pro-low
   --print-timeout 15m` — MUHIM: katta task'larni (5+ fayl) kichik
   fayl-guruhlariga (2-4 fayl) bo'lib, bir necha ketma-ket dispatchda
   jo'nat (orcestor/requirements.MD 6-bo'lim va Claude Code xotirasi
   `agy-cli-dispatch-reliability`ga qara — bitta katta so'rov soxta
   "tayyor" hisobot berib hech narsa yozmasligi tasdiqlangan holat).
3. Har bir dispatchdan keyin: (a) haqiqiy fayl mazmunini o'qib chiq
   (git diff YETARLI EMAS), (b) `npm run build` bilan tekshir (`tsc
   --noEmit` YETARLI EMAS — Angular shablon/routing xatolarini
   ushlamaydi), (c) stray/dublikat fayl yaratilmaganini
   `find <feature-dir> -type f` bilan tekshir.
4. Muvaffaqiyatli bo'lsa: response.md ga yakuniy xulosa + "O'zgargan
   fayllar" jadvalini yoz, `python3 orcestor/dispatch.py complete
   T-0XX`, keyin orcestor/tasklist.md dagi holatni yangila.
5. Kvota xatosi ("Individual quota reached") kelsa — keyingi model
   darajasiga o't (`agy models` bilan ro'yxatni tekshir), hech qachon
   "Resets in X" vaqtigacha qayta urinma.

Muloqot doim o'zbek tilida (ROOT.MD 1.1-bo'lim). Har bir modul/task
tugagach orcestor/module-plan.md, orcestor/tasklist.md va starter.md dagi
holatni yangilab bor.
```

---

## 4. Boshqa muhim kelishuvlar (qisqa eslatma)

- Kompyuter: 8 yadro, ~5.7GB RAM, fan shovqinli — parallel og'ir jarayon
  qilmang (masalan `npm run build` va `agy` bir vaqtda). Xotira:
  `machine-resources`.
- Fayzillo to'liq avtonom vakolat bergan (shu loyiha yo'li ichida) — har
  bir AGY natijasini baribir o'zi tekshirib, keyin yopish kerak.
- `git commit`/`push` qilinmagan — buyurtma bo'lmasa commit qilinmaydi.
- Ikkinchi, alohida Claude Code sessiyasi (boshqa terminalda) faqat
  `.claude/settings.local.json` permission'larini kuzatib turadi va
  `orcestor/dispatch.py`ga `check` subcommand qo'shgan (advisory) —
  `python3 orcestor/dispatch.py check T-XXX --build`.
- T-016 topilmasi: Tailwind CSS v4 allaqachon o'rnatilgan
  (`src/styles.css`da `@import 'tailwindcss';`), lekin hech bir komponent
  undan foydalanmagan — yangi komponentlar Tailwind bilan yozilsin,
  eskilar tegilmaguncha o'zgarishsiz qoladi.
- Batafsil AGY-ishonchlilik topilmalari: Claude Code xotirasi
  `agy-cli-dispatch-reliability` (fayl yo'li: `~/.claude/projects/-home-fayzillo-Desktop-zdes-frontend/memory/`).
