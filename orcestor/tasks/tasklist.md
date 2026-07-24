# orcestor/tasks/tasklist.md — Draft tasklar qisqa xulosasi

> **Maqsad:** `tasks/` papkasidagi HAR BIR `.md` faylni to'liq ochib
> o'qimasdan, qaysi task nima qilishini, nimaga bog'liqligini va qaysi
> fayllarga tegishini bir qarashda bilish — kontekst/token tejash uchun.
> Bu yerdagi ma'lumot QISQARTIRILGAN xulosa, dispatch qilishdan oldin
> baribir asl `T-0XX.md` faylining o'zini oching (Cheklovlar, to'liq DoD,
> Report back qismlari bu yerda yo'q).
>
> Umumiy progress (tugagan tasklar bilan birga) uchun:
> [`../tasklist.md`](../tasklist.md).

**Oxirgi yangilanish:** 2026-07-25 — hozircha barcha quyidagilar `tasks/`da (draft, dispatch qilinmagan).

---

### T-020 — [Docs 1/3] API+state hujjati: Core/Auth/Dashboard/Tashkiliy tuzilma
**Bog'liqlik:** yo'q. **Fayllar:** `project_docs/api/{auth,dashboard,company,branches,departments,positions}.md` (yangi, hujjat). O'qiydi: `core/**`, shu 6 modul.
Har bir endpoint (metod/yo'l/tip) + har bir sahifaning state (signal/property) jadval qilib yoziladi. Kod o'zgarmaydi.

### T-021 — [Docs 2/3] API+state hujjati: Xodimlar/Davomat/Ta'til guruhi
**Bog'liqlik:** T-020 bilan mustaqil (format bir xil). **Fayllar:** `project_docs/api/{employees,attendance,work-schedules,terminals,leaves,holidays,advances}.md` (yangi). Kod o'zgarmaydi.

### T-022 — [Docs 3/3] API+state hujjati: Payroll/Admin + yakuniy indeks
**Bog'liqlik:** T-020 VA T-021 tugagandan keyin. **Fayllar:** `project_docs/api/{payroll,salary-adjustments,settings,notifications,README}.md` (yangi). `README.md` — barcha 17 modulga havola + state-boshqaruv xulosasi. Kod o'zgarmaydi.

### T-023 — Error handling darajasi auditi
**Bog'liqlik:** yo'q. **Fayllar:** `orcestor/analysis/T-023-error-handling-analysis.md` (yangi). O'qiydi: `core/interceptors/**`, barcha `features/**/services|pages`. Global (`error-interceptor.ts`) va component-darajasidagi xato handling qay darajada ekanini tahlil qiladi, aniq tavsiya yozadi. Kod o'zgarmaydi.

### T-024 — Axios'ga o'tish: imkoniyat tahlili
**Bog'liqlik:** yo'q. **Fayllar:** `orcestor/analysis/T-024-axios-analysis.md` (yangi). `core/services/http.ts` yagona choke-point ekanini hisobga olib, kam-ta'sirli (faqat `Http` ichida) vs katta-ta'sirli (butun loyiha) variantni solishtiradi, ANIQ birini tavsiya qiladi + T-025 uchun reja. Kod o'zgarmaydi, npm o'rnatilmaydi.

### T-025 — Axios'ni amalga oshirish
**Bog'liqlik:** T-024 tugagandan keyin, uning rejasiga qat'iy rioya qiladi. **Fayllar:** `package.json`, `core/services/http.ts`, `core/interceptors/{auth,error}-interceptor.ts`, `app.config.ts` (+ agar katta-ta'sirli tanlansa: `features/*/services/*.ts`). `axios` qo'shiladi, interceptor mantig'i ko'chiriladi.

### T-026 — [Perf 1/6] Skeleton/bubble loading shared komponenti
**Bog'liqlik:** yo'q (birinchi bo'lib ishlaydi, keyingilar shunga tayanishi mumkin). **Fayllar:** `shared/components/ui/skeleton-loader/` (yangi), `data-table.{ts,html,css}` (loading holati). Yangi dependency yo'q.

### T-027 — [Perf 2/6] DataTable qidiruv/filter
**Bog'liqlik:** T-026dan keyin (bir xil faylga tegadi). **Fayllar:** `data-table.{ts,html,css}`. `processData()` oqimini filter→sort→paginate tartibiga qat'iylashtiradi — bu keyingi T-028/T-031 uchun asos.

### T-028 — [Perf 3/6] DataTable DOM virtualization
**Bog'liqlik:** T-027 tugagandan keyin. **Fayllar:** `package.json` (**`@angular/cdk` qo'shiladi — istisno, ruxsat berilgan**), `data-table.{ts,html,css}`. Opt-in `virtualScroll` input, default xatti-harakat o'zgarmaydi.

### T-029 — [Perf 4/6] Lazy loading (`@defer` + rasm)
**Bog'liqlik:** yo'q, mustaqil. **Fayllar:** `attendance/pages/scanner/*`, `employees/components/face-register/*`, `image-upload.html`. `CameraCapture`ni `@defer (on interaction)` bilan o'raydi, `<img loading="lazy">` qo'shadi.

### T-030 — [Perf 5/6] HTTP javob keshlash
**Bog'liqlik:** yo'q — `Http.get()` public interfeysiga qarab ishlaydi, T-024/T-025 tartibidan mustaqil. **Fayllar:** `core/services/http.ts`, + 5 ta "kam o'zgaradigan" service (`company`, `branch`, `department`, `position`, `holiday`). Opt-in TTL kesh, default o'chirilgan.

### T-031 — [Perf 6/6] Server-side pagination — FAQAT API kontrakt
**Bog'liqlik:** T-027 VA T-028 tugagandan keyin. **Fayllar:** `data-table.{ts,html}`, (ixtiyoriy) `project_docs/api/README.md`. **Hech qanday feature service o'zgarmaydi** — backend yo'qligi sababli faqat Input/Output kontrakt qo'shiladi, haqiqiy ulash keyingi (hali yozilmagan) taskka qoladi.

---

## Tavsiya etilgan dispatch tartibi

```
T-020 → T-021 → T-022                              (docs, mustaqil ketma-ketlik)
T-023                                                (mustaqil, istalgan vaqt)
T-024 → T-025                                        (axios, ketma-ket)
T-026 → T-027 → T-028 → T-031                        (DataTable, qat'iy ketma-ket)
T-029                                                (mustaqil)
T-030                                                (mustaqil)
```
