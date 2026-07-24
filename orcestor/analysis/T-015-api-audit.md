# T-015: API baseUrl globallashtirish auditi

## Tahlil natijalari (src/app/features/*/services/*.ts)

| Fayl | Http/HttpClient | Tuzatildimi |
| --- | --- | --- |
| `src/app/features/advances/services/advance.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/attendance/services/attendance.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/branches/services/branch.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/company/services/company.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/departments/services/department.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/employees/services/employee.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/holidays/services/holiday.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/leaves/services/leave.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/notifications/services/notification.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/payroll/services/payroll.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/positions/services/position.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/salary-adjustments/services/salary-adjustment.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/settings/services/setting.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/terminals/services/terminal.ts` | Http | Hojat yo'q (To'g'ri) |
| `src/app/features/work-schedules/services/work-schedule.ts` | Http | Hojat yo'q (To'g'ri) |

## Xulosa
Barcha servis fayllari tekshirildi. Ularning barchasi `core/services/http.ts` dagi yagona `Http` servisidan to'g'ri foydalanmoqda. Hech qanday xom `HttpClient` yoki qattiq kodlangan URL (masalan, `environment.apiUrl` bilan qo'lda birlashtirilgan) holatlari topilmadi. Tuzatishga ehtiyoj qolmadi.
