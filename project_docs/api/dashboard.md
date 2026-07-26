# Dashboard — backend tahlili

**Topilma (Claude Code, 2026-07-25, AGY'siz — bu shunchaki "yo'qligini
tasdiqlash", alohida tahlil talab qilmaydi):**

`zdes_backend`da **alohida `dashboard` moduli/controller yo'q**
(`grep -rln dashboard src --include="*.controller.ts"` — natija bo'sh,
`find src -iname "*dashboard*"` — natija bo'sh). Demak `/api/v1/dashboard`
kabi yagona endpoint mavjud emas.

`test-zdes-front/src/app/features/dashboard/pages/dashboard/dashboard.ts`
da hozircha hech qanday servis chaqiruvi yo'q (statik/mock ko'rinishda).

## Faza 2 uchun tavsiya

Dashboard sahifasi alohida backend endpointga emas, balki **allaqachon
tahlil qilingan modullarning mavjud `GET` (ro'yxat/statistika) endpointlariga
tayanishi kerak** — masalan:

- `GET /api/v1/companies`, `GET /api/v1/branches`, `GET /api/v1/departments`,
  `GET /api/v1/positions` — umumiy sonlar (`total` maydoni paginatsiya
  javobida bor).
- `GET /api/v1/users` — xodimlar soni, `stats` maydoni (rol bo'yicha sanoq,
  `backend_crud_review/user.md` GET endpointida hujjatlangan).
- `GET /api/v1/attendance` — bugungi davomat statistikasi (filter: `date`).
- `GET /api/v1/payrolls`, `GET /api/v1/advances` — moliyaviy ko'rsatkichlar.
- `GET /api/v1/notifications` — so'nggi bildirishnomalar.

Agar Faza 2da dashboard uchun maxsus agregat endpoint kerak bo'lib qolsa
(masalan bitta so'rovda barcha statistikani qaytaruvchi `/api/v1/dashboard/
summary`) — bu **backendga yangi endpoint qo'shish** demak, ya'ni
`requirements.MD` 0-bo'limidagi "backend faqat o'qiladi, Fayzillo aniq
istisno bermaguncha" qoidasiga ko'ra alohida ruxsat so'ralishi shart.
