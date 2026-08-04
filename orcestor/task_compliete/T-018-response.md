# T-018 Bajarildi

Barcha to'rtta ro'yxat sahifasiga `error-state` (xatolik holati) qo'shildi:
1. `branch-list.ts` / `.html`
2. `company-list.ts` / `.html`
3. `department-list.ts` / `.html`
4. `employee-list.ts` / `.html`

Bajarilgan ishlar:
- Barcha `.ts` fayllarda `loadError = signal<boolean>(false)` o'zgaruvchisi kiritildi.
- `getAll` yoki ma'lumotlarni yuklovchi metodlarda boshida `this.loadError.set(false)` va error yuz berganda `this.loadError.set(true)` etib belgilandi.
- HTML fayllarda `!loading() && loadError()` sharti orqali `.error-state-box` ko'rsatilishi qo'shildi. "Qayta urinib ko'rish" tugmasi yuklovchi metodni qaytadan chaqiradi.
- Bo'sh holat (`empty-state`) bloklariga `!loadError()` yoki tegishli qo'shimcha shartlar ulanib ketma-ketlik va shart bajarilishi ishonchli qilindi.
- `npm run build` bajarildi va hech qanday xatolik ko'rsatilmadi (xatoliksiz o'tdi).
