Quyidagi fayllarga `ChangeDetectionStrategy.OnPush` qo'shildi (bu fayllarda `.subscribe(...)` qatnashmaganligi sababli `takeUntilDestroyed` qo'shilmadi):

1. `src/app/shared/components/layout/header/header.ts`
2. `src/app/shared/components/layout/main-layout/main-layout.ts`
3. `src/app/shared/components/layout/sidebar/sidebar.ts`
4. `src/app/shared/components/ui/camera-capture/camera-capture.ts`
5. `src/app/shared/components/ui/confirm-dialog/confirm-dialog.ts`
6. `src/app/shared/components/ui/data-table/data-table.ts`
7. `src/app/shared/components/ui/image-upload/image-upload.ts`

Quyidagi fayllarga `ChangeDetectionStrategy.OnPush` va `.subscribe` lar uchun `takeUntilDestroyed()` qo'shildi (ayrimlarida faqat `OnPush` qo'shildi, chunki subscribe ishlatilmagan):

1. `src/app/features/auth/pages/login/login.ts`
2. `src/app/features/dashboard/pages/dashboard/dashboard.ts` (faqat OnPush)
3. `src/app/features/company/pages/company-detail/company-detail.ts`
4. `src/app/features/settings/pages/settings-page/settings-page.ts`
5. `src/app/features/notifications/pages/notification-list/notification-list.ts`

Shuningdek, quyidagi ro'yxatdagi fayllarga ham `ChangeDetectionStrategy.OnPush` va `.subscribe()` larni xavfsiz qilish uchun `takeUntilDestroyed()` (va `DestroyRef`) qo'shildi:

1. `src/app/features/branches/pages/branch-list/branch-list.ts`
2. `src/app/features/branches/pages/branch-form/branch-form.ts`
3. `src/app/features/departments/pages/department-list/department-list.ts`
4. `src/app/features/departments/pages/department-form/department-form.ts`
5. `src/app/features/positions/pages/position-list/position-list.ts`
6. `src/app/features/positions/pages/position-form/position-form.ts`

Quyidagi fayllarga ham `ChangeDetectionStrategy.OnPush` va `takeUntilDestroyed` qo'shildi:
1. `src/app/features/employees/pages/employee-list/employee-list.ts`
2. `src/app/features/employees/pages/employee-form/employee-form.ts`
3. `src/app/features/employees/pages/employee-detail/employee-detail.ts` (faqat OnPush)
4. `src/app/features/employees/components/face-register/face-register.ts`
5. `src/app/features/attendance/pages/attendance-list/attendance-list.ts`
6. `src/app/features/attendance/pages/attendance-detail/attendance-detail.ts`
7. `src/app/features/attendance/pages/scanner/scanner.ts`

Quyidagi fayllarga ham `ChangeDetectionStrategy.OnPush` va `takeUntilDestroyed` qo'shildi:
1. `src/app/features/work-schedules/pages/work-schedule-list/work-schedule-list.ts`
2. `src/app/features/work-schedules/pages/work-schedule-form/work-schedule-form.ts`
3. `src/app/features/terminals/pages/terminal-list/terminal-list.ts`
4. `src/app/features/terminals/pages/terminal-form/terminal-form.ts`
5. `src/app/features/holidays/pages/holiday-list/holiday-list.ts`
6. `src/app/features/holidays/pages/holiday-form/holiday-form.ts`

Quyidagi fayllarga ham `ChangeDetectionStrategy.OnPush` va `takeUntilDestroyed` qo'shildi (ayrimlarida faqat OnPush):
1. `src/app/features/leaves/pages/leave-list/leave-list.ts`
2. `src/app/features/leaves/pages/leave-form/leave-form.ts`
3. `src/app/features/advances/pages/advance-list/advance-list.ts`
4. `src/app/features/advances/pages/advance-form/advance-form.ts`
5. `src/app/features/payroll/pages/payroll-list/payroll-list.ts` (faqat OnPush)
6. `src/app/features/payroll/pages/payroll-detail/payroll-detail.ts` (faqat OnPush)
7. `src/app/features/salary-adjustments/pages/adjustment-list/adjustment-list.ts`
8. `src/app/features/salary-adjustments/pages/adjustment-form/adjustment-form.ts`

### O'zgargan fayllar jadvali

| T/r | Fayl nomi | O'zgarish |
|---|---|---|
| 1 | `src/app/shared/components/layout/header/header.ts` | OnPush |
| 2 | `src/app/shared/components/layout/main-layout/main-layout.ts` | OnPush |
| 3 | `src/app/shared/components/layout/sidebar/sidebar.ts` | OnPush |
| 4 | `src/app/shared/components/ui/camera-capture/camera-capture.ts` | OnPush |
| 5 | `src/app/shared/components/ui/confirm-dialog/confirm-dialog.ts` | OnPush |
| 6 | `src/app/shared/components/ui/data-table/data-table.ts` | OnPush |
| 7 | `src/app/shared/components/ui/image-upload/image-upload.ts` | OnPush |
| 8 | `src/app/features/auth/pages/login/login.ts` | OnPush, takeUntilDestroyed |
| 9 | `src/app/features/dashboard/pages/dashboard/dashboard.ts` | OnPush |
| 10 | `src/app/features/company/pages/company-detail/company-detail.ts` | OnPush, takeUntilDestroyed |
| 11 | `src/app/features/settings/pages/settings-page/settings-page.ts` | OnPush, takeUntilDestroyed |
| 12 | `src/app/features/notifications/pages/notification-list/notification-list.ts` | OnPush, takeUntilDestroyed |
| 13 | `src/app/features/branches/pages/branch-list/branch-list.ts` | OnPush, takeUntilDestroyed |
| 14 | `src/app/features/branches/pages/branch-form/branch-form.ts` | OnPush, takeUntilDestroyed |
| 15 | `src/app/features/departments/pages/department-list/department-list.ts` | OnPush, takeUntilDestroyed |
| 16 | `src/app/features/departments/pages/department-form/department-form.ts` | OnPush, takeUntilDestroyed |
| 17 | `src/app/features/positions/pages/position-list/position-list.ts` | OnPush, takeUntilDestroyed |
| 18 | `src/app/features/positions/pages/position-form/position-form.ts` | OnPush, takeUntilDestroyed |
| 19 | `src/app/features/employees/pages/employee-list/employee-list.ts` | OnPush, takeUntilDestroyed |
| 20 | `src/app/features/employees/pages/employee-form/employee-form.ts` | OnPush, takeUntilDestroyed |
| 21 | `src/app/features/employees/pages/employee-detail/employee-detail.ts` | OnPush |
| 22 | `src/app/features/employees/components/face-register/face-register.ts` | OnPush, takeUntilDestroyed |
| 23 | `src/app/features/attendance/pages/attendance-list/attendance-list.ts` | OnPush, takeUntilDestroyed |
| 24 | `src/app/features/attendance/pages/attendance-detail/attendance-detail.ts` | OnPush, takeUntilDestroyed |
| 25 | `src/app/features/attendance/pages/scanner/scanner.ts` | OnPush, takeUntilDestroyed |
| 26 | `src/app/features/work-schedules/pages/work-schedule-list/work-schedule-list.ts` | OnPush, takeUntilDestroyed |
| 27 | `src/app/features/work-schedules/pages/work-schedule-form/work-schedule-form.ts` | OnPush, takeUntilDestroyed |
| 28 | `src/app/features/terminals/pages/terminal-list/terminal-list.ts` | OnPush, takeUntilDestroyed |
| 29 | `src/app/features/terminals/pages/terminal-form/terminal-form.ts` | OnPush, takeUntilDestroyed |
| 30 | `src/app/features/holidays/pages/holiday-list/holiday-list.ts` | OnPush, takeUntilDestroyed |
| 31 | `src/app/features/holidays/pages/holiday-form/holiday-form.ts` | OnPush, takeUntilDestroyed |
| 32 | `src/app/features/leaves/pages/leave-list/leave-list.ts` | OnPush, takeUntilDestroyed |
| 33 | `src/app/features/leaves/pages/leave-form/leave-form.ts` | OnPush, takeUntilDestroyed |
| 34 | `src/app/features/advances/pages/advance-list/advance-list.ts` | OnPush, takeUntilDestroyed |
| 35 | `src/app/features/advances/pages/advance-form/advance-form.ts` | OnPush, takeUntilDestroyed |
| 36 | `src/app/features/payroll/pages/payroll-list/payroll-list.ts` | OnPush |
| 37 | `src/app/features/payroll/pages/payroll-detail/payroll-detail.ts` | OnPush |
| 38 | `src/app/features/salary-adjustments/pages/adjustment-list/adjustment-list.ts` | OnPush, takeUntilDestroyed |
| 39 | `src/app/features/salary-adjustments/pages/adjustment-form/adjustment-form.ts` | OnPush, takeUntilDestroyed |
