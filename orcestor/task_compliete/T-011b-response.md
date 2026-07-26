# T-011b - Column-level jadval filter — 3-guruh (work-schedules, attendance, payroll)

## Bajarilgan ishlar:
1. `work-schedule-list`: `work-schedule-list.ts` va `work-schedule-list.html` fayllari yangilandi.
   - `nameFilter`, `companyFilter`, `branchFilter`, `isDefaultFilter` signallari qo'shildi.
   - `filteredWorkSchedules()` usuli kiritildi.
   - html faylda `thead` ga filter ustunlari va `tbody` ga bo'sh holat qo'shildi.
2. `attendance-list`: `attendance-list.ts` va `attendance-list.html` fayllari yangilandi.
   - `employeeFilter`, `dateFilter`, `statusFilter` signallari qo'shildi.
   - `filteredAttendances()` usuli kiritildi.
   - html faylda filter qatori kiritilib, "Amallar" ustuni qo'shilmadi (jami 8 ta header ustun). Bo'sh natija holati qo'shildi.
3. `payroll-list`: `payroll-list.ts` va `payroll-list.html` fayllari yangilandi.
   - `employeeIdFilter`, `monthFilter` signallari qo'shildi.
   - `computed()` funksiyasidan foydalanib `filteredPayrolls` ishlatildi, chunki data signal formatida edi.
   - html faylda filter qatori va bo'sh holat yozuvi qo'shildi.

## Sinovlar:
- Barcha talablar (Actions/Amallar ustuniga tegmaslik, boshqalarida qo'shmaslik) to'liq bajarildi.
- `npm run build` muvaffaqiyatli yakunlandi, xatolar bo'lmadi.
