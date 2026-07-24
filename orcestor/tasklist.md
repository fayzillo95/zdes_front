# orcestor/tasklist.md — Umumiy task progress jadvali

> Bu fayl — barcha (T-001..T-031) tasklarning holatini bitta joyda
> ko'rish uchun. Har bir task hayot sikli bo'yicha harakatlanadi:
> `tasks/` (draft) → `task_pending/` (dispatch qilingan) →
> `task_compliete/` (tugagan, `orcestor/status/*.log`da tasdiqlangan).
> Tafsilot uchun: [`module-plan.md`](./module-plan.md) (10 asosiy modul),
> har bir taskning o'zi (`tasks/`/`task_pending/`/`task_compliete/`).
>
> **Yangilanish tartibi:** yangi task yozilganda yoki holat o'zgarganda
> (dispatch/complete) shu jadval qo'lda yangilanadi — avtomatik
> sinxronlanmaydi.

**Oxirgi yangilanish:** 2026-07-25

## 1. Asosiy modullar (10 modul)

| Task | Sarlavha | Holat |
|---|---|---|
| T-001 | agency-agents repodan skill/tool fayllarni `agents/skills/`ga olib kelish (meta) | ✅ Tugagan |
| T-002 | `orcestor/dispatch.py` — vazifa hayot siklini boshqaruvchi skript (meta) | ✅ Tugagan |
| T-003 | [Modul 1/10] Core infratuzilma — Routing, Environment, HTTP servisi | ✅ Tugagan |
| T-004 | [Modul 2/10] Auth — login, guard'lar, interceptor'lar | ✅ Tugagan |
| T-005 | [Modul 3/10] Shared UI Kit — DataTable, ConfirmDialog, ImageUpload, CameraCapture, Header, Sidebar, Pipe'lar | ✅ Tugagan |
| T-006 | [Modul 4/10] Dashboard | ✅ Tugagan |
| T-007 | [Modul 5/10] Tashkiliy tuzilma — Company/Branches/Departments/Positions | ✅ Tugagan |
| T-008 | [Modul 6/10] Xodimlar — CRUD + Face Register | ✅ Tugagan |
| T-009 | [Modul 7/10] Vaqt va Davomat — Attendance/Work Schedules/Terminals/Scanner | ✅ Tugagan |
| T-010 | [Modul 8/10] Ta'til va G'oyiblik — Leaves/Holidays/Advances | ✅ Tugagan |
| T-011 | [Modul 9/10] Ish haqi — Payroll/Salary Adjustments | ✅ Tugagan |
| T-012 | [Modul 10/10] Admin — Settings/Notifications | ✅ Tugagan |

## 2. Sifat auditi seriyasi (T-013..T-019)

| Task | Sarlavha | Bog'liqlik | Holat |
|---|---|---|---|
| T-013 | Dark/Light rejim moslik tahlili (faqat tahlil) | — | ✅ Tugagan |
| T-014 | Performance holati tahlili (faqat tahlil) | — | ✅ Tugagan |
| T-015 | API baseUrl globallashtirish auditi (tahlil + tuzatish) | — | ✅ Tugagan (tuzatish kerak topilmadi) |
| T-016 | Tailwind CSS tahlili (faqat tahlil) | — | ✅ Tugagan |
| T-017 | Dark/Light rejimni amalga oshirish | T-013 natijasiga asoslanadi | ✅ Tugagan |
| T-018 | Dublikat/orphaned fayllar auditi va tozalash | — | ✅ Tugagan (0 dublikat topildi) |
| T-019 | Performance tuzatishlari — OnPush + RxJS `takeUntilDestroyed` | T-014 topilmalariga asoslanadi | ✅ Tugagan |

## 3. API/State hujjatlashtirish seriyasi (T-020..T-022)

| Task | Sarlavha | Bog'liqlik | Holat |
|---|---|---|---|
| T-020 | [Docs 1/3] Core/Auth/Dashboard/Tashkiliy tuzilma — API + state hujjati | — | ✅ Tugagan |
| T-021 | [Docs 2/3] Xodimlar/Davomat/Ta'til guruhi — API + state hujjati | — | ✅ Tugagan |
| T-022 | [Docs 3/3] Payroll/Admin + yakuniy indeks (`project_docs/api/README.md`) | T-020, T-021 tugagandan keyin | ✅ Tugagan |

## 4. Error handling + Axios seriyasi (T-023..T-025)

| Task | Sarlavha | Bog'liqlik | Holat |
|---|---|---|---|
| T-023 | Error handling darajasi auditi (faqat tahlil) | — | ✅ Tugagan |
| T-024 | Axios'ga o'tish — imkoniyat tahlili (faqat tahlil) | — | 📝 Draft (`tasks/`) |
| T-025 | Axios'ni amalga oshirish | T-024 tugagandan keyin, uning rejasiga rioya qiladi | 📝 Draft (`tasks/`) |

## 5. Performance/UX seriyasi (T-026..T-031)

| Task | Sarlavha | Bog'liqlik | Holat |
|---|---|---|---|
| T-026 | [Perf 1/6] Skeleton/bubble loading — shared komponent | — | 📝 Draft (`tasks/`) |
| T-027 | [Perf 2/6] DataTable — qidiruv/filter | T-026dan keyin (bir xil faylga tegadi) | 📝 Draft (`tasks/`) |
| T-028 | [Perf 3/6] DataTable — DOM virtualization (`@angular/cdk`) | T-027 tugagandan keyin | 📝 Draft (`tasks/`) |
| T-029 | [Perf 4/6] Lazy loading — `@defer` + rasm lazy-load | Mustaqil | 📝 Draft (`tasks/`) |
| T-030 | [Perf 5/6] HTTP javob keshlash (caching) | Mustaqil (axios/HttpClient'dan qat'i nazar) | 📝 Draft (`tasks/`) |
| T-031 | [Perf 6/6] Server-side pagination — faqat API sirtini tayyorlash | T-027, T-028 tugagandan keyin | 📝 Draft (`tasks/`) |

## 6. Auth UX — alohida so'rov (T-032)

| Task | Sarlavha | Bog'liqlik | Holat |
|---|---|---|---|
| T-032 | `/auth/login` → `/sign` + bitta sahifada Login/Register animatsiyali switch-form | Mustaqil (Fayzillo to'g'ridan-to'g'ri so'ragan, 2026-07-25) | 📝 Draft (`tasks/`) |

## 7. Umumiy holat

- **Jami:** 32 ta task.
- **Tugagan:** 23 ta (T-001..T-023).
- **Draft, hali dispatch qilinmagan:** 9 ta (T-024..T-032).
- **API/state docs seriyasi (T-020..T-022) TO'LIQ TUGADI** —
  `project_docs/api/README.md` 17 modulga havola beruvchi indeks. Bundan
  buyon yangilab borish qoidasi: `orcestor/requirements.MD` 7-bo'lim.
- **`task_pending/`da (jarayonda):** hozircha yo'q.

## 8. Muhim ochiq savollar (keyingi tasklarga bog'liq)

- T-016 (Tailwind) tavsiyasi hali amalga oshirilmagan (agar "o'tish kerak" desa, alohida implementatsiya taski kerak bo'ladi — bu jadvalda yo'q, kelajakda qo'shiladi).
- T-024 (axios) qaysi variantni (kam-ta'sirli/katta-ta'sirli) tavsiya qilishi T-025 va T-030 ning bajarilish tartibiga ta'sir qiladi.
- T-031 ataylab to'liq server-side pagination migratsiyasi EMAS — backend real bo'lganda yangi task kerak bo'ladi.
- T-032 Register uchun backend `/auth/register` endpoint kontrakti hali tasdiqlanmagan — frontend taxmin asosida yoziladi, real backend kelganda moslashtirish kerak bo'lishi mumkin.
