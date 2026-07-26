# T-007 Response — Tashkiliy tuzilma (Company, Branches, Departments, Positions)

**Ijrochi:** AGY (`agy --print`, model `gemini-3.1-pro-low`), har bir feature
alohida dispatch (1 feature = 1 dispatch, ~5-8 fayl); Claude Code har birini
`ng build` + fayl mazmuni bilan tekshirgan va kerakli joyda qo'lda tuzatgan.

## O'zgargan fayllar

| Fayl | Turi | Qisqa sabab |
|---|---|---|
| `core/models/company.ts` | yangi mazmun | Company interfeysi |
| `features/company/services/company.ts` | yangi mazmun | `CompanyService`, Http orqali get/update |
| `features/company/pages/company-detail/*` | yangi mazmun | forma, get/update oqimi |
| `features/company/company-routing-module.ts` | yangi mazmun | route qo'shildi |
| `core/models/branch.ts` | yangi mazmun | Branch interfeysi |
| `features/branches/services/branch.ts` | yangi mazmun (Claude Code tuzatgan) | `BranchService`, Http orqali CRUD |
| `features/branches/pages/branch-list/*`, `pages/branch-form/*` | yangi mazmun (Claude Code konsolidatsiya qilgan) | AGY noto'g'ri nomli (`*.component.ts`) dublikat fayllar yaratgan edi, asl fayllarga ko'chirildi |
| `features/branches/branches-routing-module.ts` | yangi mazmun | route qo'shildi (AGY yaratgan `.module.ts` variantidan ko'chirildi) |
| `core/models/department.ts`, `features/departments/**` | yangi mazmun | to'g'ridan-to'g'ri to'g'ri nomlar bilan yozildi |
| `core/models/position.ts`, `features/positions/**` | yangi mazmun | to'g'ridan-to'g'ri to'g'ri nomlar bilan yozildi |
| `src/app/app.routes.server.ts` | tuzatildi (Claude Code) | `RenderMode.Prerender` → `RenderMode.Client` (parametrli route'lar prerender talabini buzayotgan edi) |

## Muhim topilmalar (Claude Code tomonidan tuzatilgan)

1. **Branches**'da AGY berilgan stub fayllarni tahrirlash o'rniga yangi
   nomli fayllar yaratdi (`branch.service.ts`, `branch-list.component.*`,
   `branch-form.component.*`, `branches-routing.module.ts`) va xom
   `HttpClient` ishlatdi (`Http` wrapper emas). Claude Code qo'lda
   konsolidatsiya qildi: mazmunni to'g'ri nomli fayllarga ko'chirdi, sinf
   nomlarini konventsiyaga moslashtirdi (`BranchList`, `BranchForm`,
   `BranchService`), `Http`ga o'tkazdi, dublikatlarni o'chirdi.
   Departments/Positions'da esa aniqroq ko'rsatma ("FAQAT mavjud fayllarni
   tahrirlang, yangi fayl yaratmang") berilgach bu muammo takrorlanmadi.
2. **Prerender xatosi**: birinchi parametrli route (`branches/:id/edit`)
   `ng build`ni buzdi (`getPrerenderParams` yo'q xatosi). Butun loyiha
   uchun `app.routes.server.ts`dagi catch-all `RenderMode.Client`ga
   o'zgartirildi — bu keyingi barcha `:id` route'lar (departments,
   positions, employees va h.k.) uchun oldindan hal qilingan.

## Yakuniy tekshiruv

- Har bir feature alohida `npm run build` bilan tekshirilgan (oxirgisi —
  barcha 4 feature qo'shilgandan keyingi to'liq build — xatosiz o'tdi,
  faqat oldindan mavjud `login.css` budget ogohlantirishi bilan).
- Barcha fayllar to'g'ridan-to'g'ri o'qib chiqilgan (nafaqat `git diff`) —
  Branches'dagi dublikat-fayl muammosi aynan shu tekshiruv orqali topilgan.

T-007 tasdiqlandi va yopildi (2026-07-25).
