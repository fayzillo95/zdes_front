# T-015: API baseUrl globallashtirish auditi natijalari

Barcha `src/app/features/*/services/*.ts` fayllari muvaffaqiyatli tekshirildi. Ularning hech birida xom `HttpClient` yoki qattiq kodlangan URL manzillar aniqlanmadi, barcha xizmatlar allaqachon `core/services/http.ts` dagi yagona `Http` servisidan to'g'ri foydalanmoqda. 

## Tekshirilgan fayllar ro'yxati:
1. `src/app/features/advances/services/advance.ts`
2. `src/app/features/attendance/services/attendance.ts`
3. `src/app/features/branches/services/branch.ts`
4. `src/app/features/company/services/company.ts`
5. `src/app/features/departments/services/department.ts`
6. `src/app/features/employees/services/employee.ts`
7. `src/app/features/holidays/services/holiday.ts`
8. `src/app/features/leaves/services/leave.ts`
9. `src/app/features/notifications/services/notification.ts`
10. `src/app/features/payroll/services/payroll.ts`
11. `src/app/features/positions/services/position.ts`
12. `src/app/features/salary-adjustments/services/salary-adjustment.ts`
13. `src/app/features/settings/services/setting.ts`
14. `src/app/features/terminals/services/terminal.ts`
15. `src/app/features/work-schedules/services/work-schedule.ts`

**Tuzatilganlar:** Hech qaysi faylni tuzatishga ehtiyoj bo'lmadi. Barcha xizmatlar avvaldan `Http` ni to'g'ri integratsiya qilgan. 

Qo'shimcha tekshiruvlar: Komponentlarda yoki boshqa TypeScript fayllarda to'g'ridan to'g'ri `HttpClient` ishlatilganmi deb butun `features/` bo'ylab izlandi, hech qanday holat topilmadi.

Shuningdek, `npm run build` komandasi muvaffaqiyatli yakunlandi.
To'liq tahlil jadvali `orcestor/analysis/T-015-api-audit.md` fayliga saqlandi.
