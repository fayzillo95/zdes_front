# T-008 Response — Xodimlar (Employees)

**Ijrochi:** AGY (`agy --print`, model `gemini-3.1-pro-low`), 2 dispatchda
(1: model+servis+list+form, 2: detail+face-register+`:id` route);
Claude Code har birini `ng build` va fayl mazmuni bilan tekshirgan.

## O'zgargan fayllar

| Fayl | Turi | Qisqa sabab |
|---|---|---|
| `core/models/employee.ts` | yangi (fayl umuman mavjud emas edi) | Employee interfeysi |
| `features/employees/services/employee.ts` | to'ldirildi | `EmployeeService`, Http orqali CRUD |
| `features/employees/pages/employee-list/*` | to'ldirildi | ro'yxat, CRUD tugmalari |
| `features/employees/pages/employee-form/*` | to'ldirildi | reactive form, create/update |
| `features/employees/pages/employee-detail/*` | to'ldirildi | read-only ko'rinish, getById |
| `features/employees/components/face-register/*` | to'ldirildi | CameraCaptureComponent qayta ishlatilgan, Http orqali placeholder yuborish |
| `features/employees/employees-routing-module.ts` | to'ldirildi | `''`, `'new'`, `':id/edit'`, `':id'` (to'g'ri tartibda) |

## Yakuniy tekshiruv

- `npm run build` — ikkala dispatchdan keyin ham xatosiz o'tdi.
- Fayllar to'g'ridan-to'g'ri o'qib chiqilgan — bu safar noto'g'ri
  nomlangan dublikat fayl yaratilmagan (T-007'dagi aniqroq ko'rsatma
  uslubi davom ettirilgani uchun).
- `face-register` shared `CameraCaptureComponent`ni to'g'ri qayta
  ishlatgan (qayta yozmagan).

T-008 tasdiqlandi va yopildi (2026-07-25).
