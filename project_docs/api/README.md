# Zdes Frontend — API Hujjatlari Indeksi

Bu yerda loyihaning barcha 17 ta moduli bo'yicha API endpoint'lar, tiplar va state boshqaruvi xulosalari keltirilgan.

## Modullar ro'yxati

| Modul | Hujjat havolasi | Endpointlar soni |
|---|---|---|
| Auth | [auth.md](./auth.md) | 1 |
| Dashboard | [dashboard.md](./dashboard.md) | 1 |
| Company | [company.md](./company.md) | 2 |
| Branches | [branches.md](./branches.md) | 5 |
| Departments | [departments.md](./departments.md) | 5 |
| Positions | [positions.md](./positions.md) | 5 |
| Employees | [employees.md](./employees.md) | 6 |
| Attendance | [attendance.md](./attendance.md) | 4 |
| Work Schedules | [work-schedules.md](./work-schedules.md) | 5 |
| Terminals | [terminals.md](./terminals.md) | 5 |
| Leaves | [leaves.md](./leaves.md) | 5 |
| Holidays | [holidays.md](./holidays.md) | 5 |
| Advances | [advances.md](./advances.md) | 5 |
| Payroll | [payroll.md](./payroll.md) | 2 |
| Salary Adjustments | [salary-adjustments.md](./salary-adjustments.md) | 5 |
| Settings | [settings.md](./settings.md) | 2 |
| Notifications | [notifications.md](./notifications.md) | 2 |

## State boshqaruvi bo'yicha umumiy xulosa

Loyihaning T-020, T-021 va T-022 qismlaridagi state jadvallariga asoslanib quyidagi naqshlar (patterns) aniqlandi:

1. **Angular Signals (`signal()`)**:
   - Asosan UI holatlari (masalan: `loading`, `saved`, `isModalOpen`) uchun ishlatilmoqda.
   - Ba'zi modullarda ma'lumotlar ro'yxati (masalan, `notifications`, `branches`) uchun ham `signal` o'zgaruvchilar qo'llanilgan, ular obunalar (subscribe) ichida `.set()` yoki `.update()` orqali yangilanadi.

2. **RxJS Observables (`property` sifatida)**:
   - Aksariyat `list` va `detail` sahifalarida ma'lumotlar to'g'ridan-to'g'ri `Observable` ko'rinishida (`payrolls$`, `employee$`) saqlanib, HTML templateda `async` pipe orqali bog'langan. Bu xotira sizishlarini (memory leaks) oldini olishda juda samarali usul hisoblanadi.

3. **Oddiy property va ReactiveForms**:
   - Yaratish (create) va tahrirlash (edit) formalari hammasi `ReactiveForms` (FormGroup) yordamida oddiy `property` sifatida boshqariladi.
   - Ba'zi komponentlarda ma'lumotlar oddiy class xususiyati (masalan `adjustments: SalaryAdjustment[] = []`) sifatida e'lon qilinib, `subscribe()` ichida to'ldirilgan va obunani tozalash uchun yangi `@angular/core/rxjs-interop` dagi `takeUntilDestroyed` dan keng foydalanilgan.

**Xulosa:** Loyihada aralash arxitektura (Signals + RxJS Observables) ishlatilgan. Reaktivlik uchun Angular'ning eng yangi va samarali xususiyatlari (Signals) asta-sekin joriy qilinayotgani hamda asinxron so'rovlar RxJS yordamida professional boshqarilayotgani aniqlandi.
