# T-009 Response — Vaqt va Davomat (Attendance, Work Schedules, Terminals, Scanner)

**Ijrochi:** AGY (`agy --print`, model `gemini-3.1-pro-low`), har bir
feature/qism alohida dispatch (Work-schedules, Terminals, Attendance
list+detail, Scanner) — jami 4 dispatch; Claude Code har birini
`npm run build` bilan tekshirgan.

## O'zgargan fayllar

| Fayl | Turi | Qisqa sabab |
|---|---|---|
| `core/models/work-schedule.ts` | to'ldirildi | WorkSchedule interfeysi |
| `features/work-schedules/**` | to'ldirildi | CRUD (list+form), `WorkScheduleService` |
| `core/models/terminal.ts` | to'ldirildi | Terminal interfeysi |
| `features/terminals/**` | to'ldirildi | CRUD (list+form), `TerminalService` |
| `core/models/attendance.ts`, `raw-attendance-log.ts` | to'ldirildi | Attendance/RawAttendanceLog interfeyslari |
| `features/attendance/services/attendance.ts` | to'ldirildi | `AttendanceService`: getAll/getById/checkIn/checkOut |
| `features/attendance/pages/attendance-list/*`, `attendance-detail/*` | to'ldirildi | ro'yxat va batafsil ko'rinish |
| `features/attendance/pages/scanner/*` | to'ldirildi | xodim tanlash + check-in/check-out (qo'lda, hardware integratsiyasi keyingi bosqichga qoldirilgan izoh bilan) |
| `features/attendance/attendance-routing-module.ts`, `terminals-routing-module.ts`, `work-schedules-routing-module.ts` | to'ldirildi | route'lar (`scanner` `:id`dan oldin joylashtirilgan) |

## Yakuniy tekshiruv

- Har bir dispatchdan keyin `npm run build` — barchasi xatosiz o'tdi.
- Terminals'da `:id/edit` o'rniga oddiy `:id` route ishlatilgan (kichik
  konvensiya farqi, funksional jihatdan muammo emas — detail sahifasi yo'q).

T-009 tasdiqlandi va yopildi (2026-07-25).
