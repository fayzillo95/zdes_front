# T-021 Vazifa Hisoboti

## Bajarilgan Ishlar
1. `src/app/features/attendance/pages/attendance-list/attendance-list.ts` fayliga `loadError` o'zgaruvchisi qo'shildi va `loadData` metodi orqali xatolik holatini boshqarish yo'lga qo'yildi.
2. `attendance-list.html` faylida error holati tekshiruvi kiritilib, `.error-state-box` yordamida `Qayta urinib ko'rish` tugmasi qo'shildi.
3. `src/app/features/payroll/pages/payroll-list/payroll-list.ts` fayliga `loadError` (signal) qo'shilib, uning `ngOnInit` mantiqiy qismi `loadData` metodiga o'tkazildi va error state logikasi to'g'rilandi.
4. `payroll-list.html` faylida `!loadError()` shartlari qo'shilib, xatolik chiqqanda `.error-state-box` ni ko'rsatish ta'minlandi.
5. O'zgarishlardan so'ng `npm run build` muvaffaqiyatli amalga oshirildi va barcha mantiq to'g'ri integratsiya qilindi.
