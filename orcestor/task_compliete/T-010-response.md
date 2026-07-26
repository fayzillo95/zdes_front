# T-010 Response — Ta'til, Bayram, Avans (Holidays, Leaves, Advances)

**Ijrochi:** AGY (`agy --print`, model `gemini-3.1-pro-low`), har bir
feature alohida dispatch; Claude Code har birini `npm run build` bilan
tekshirgan.

## O'zgargan fayllar

| Fayl | Turi | Qisqa sabab |
|---|---|---|
| `core/models/holiday.ts`, `features/holidays/**` | to'ldirildi | CRUD, `HolidayService` |
| `core/models/employee-leave.ts`, `features/leaves/**` | to'ldirildi | CRUD, `LeaveService` |
| `core/models/advance.ts`, `features/advances/**` | to'ldirildi | CRUD, `AdvanceService` |

## Claude Code tomonidan qo'shimcha tuzatish

- `LeaveService` xom `HttpClient` ishlatgan edi (`environment.apiUrl`ni
  qo'lda birlashtirib) — `Http` wrapper servisiga o'tkazildi, DoD talabiga
  moslashtirildi.

## Yakuniy tekshiruv

- Har bir dispatchdan keyin `npm run build` — barchasi xatosiz o'tdi.
- Routing yo'l nomlarida kichik konvensiya farqlari bor (`advances`da
  `edit/:id`, boshqalarida `:id/edit`) — funksional muammo emas, faqat
  T-015 (API audit) va kelajakdagi tozalashda hisobga olinsin.

T-010 tasdiqlandi va yopildi (2026-07-25).
