# Error Handling Analysis (T-023)

## 1. Hozirgi global xato ushlash holati
`src/app/core/interceptors/error-interceptor.ts` fayli hozir faqat bitta turdagi HTTP xatoni qayta ishlaydi:
- `401 Unauthorized`: Agar HTTP status 401 bo'lsa, u `Auth.logout()` funksiyasini chaqirib, saqlangan tokenni tozalaydi. AuthGuard keyingi navigatsiyada login sahifasiga yo'naltiradi.
- Boshqa hamma xatolar (masalan, 500 Server Error, 404 Not Found, 403 yoki tarmoq xatosi) umuman markazlashgan tarzda foydalanuvchiga ko'rsatilmaydi. Ular to'g'ridan-to'g'ri `throwError` orqali keyingi manzilga (komponentning subscribe qismiga) o'tkazib yuboriladi. Ular uchun hech qanday umumiy foydalanuvchi xabari yo'q.

## 2. Component darajasida xato handle qilinishi holati
O'tkazilgan tahlil natijalariga ko'ra, component darajasida xatoliklarni qayta ishlash juda tarqoq va ko'p joyda umuman unutilgan:

**Xato qisman handle qilingan (faqat konsolga chiqarilgan):**
Ushbu fayllarda `.subscribe` ichida `error: (err) => console.error(err)` kabi kod ishlatilgan xolos, ya'ni foydalanuvchiga hech narsa ko'rsatilmaydi:
- `branches/pages/branch-form.ts`, `branch-list.ts`
- `departments/pages/department-form.ts`, `department-list.ts`
- `positions/pages/position-form.ts`, `position-list.ts`
- `company/pages/company-detail.ts`
- `employees/components/face-register/face-register.ts`
- `holidays/pages/holiday-form.ts`, `holiday-list.ts`
Ba'zi ro'yxat sahifalarida (`notifications/pages/notification-list.ts`, `settings/pages/settings-page.ts`) error bo'lganda faqatgina loading state o'chirilgan: `this.loading.set(false)`.

**Foydalanuvchiga xabar ko'rsatilgan holat (qisman):**
- `attendance/pages/scanner/scanner.ts`: Bu yerda `this.showMessage(...)` chaqirilib foydalanuvchiga qisman xabar ko'rsatilgan.

**Xato umuman handle qilinmagan (error callback yo'q):**
Ushbu komponentlarda so'rov yuboriladi, ammo xato bo'lsa hech narsa qilinmaydi (faqat data kelsagina next callback ishlaydi):
- `employees/pages/employee-form.ts` va `employee-list.ts`
- `leaves/pages/leave-form.ts` va `leave-list.ts`
- `attendance/pages/attendance-list.ts` va `attendance-detail.ts`
- `salary-adjustments/pages/adjustment-form.ts` va `adjustment-list.ts`
- `advances/pages/advance-form.ts` va `advance-list.ts` (ba'zi API call'larida).

## 3. Umumiy xato ko'rsatish (UI) mexanizmi
`src/app/shared/components/ui` ichida tahlil o'tkazildi va u yerda faqat quyidagi UI komponentlar borligi aniqlandi:
- `camera-capture`
- `confirm-dialog`
- `data-table`
- `image-upload`

Loyihada foydalanuvchiga tizimdagi xatolar yoki muvaffaqiyat xabarlarini ko'rsatish uchun markazlashgan **Toast / Snackbar / Alert** komponenti **yo'q**. `data-table` sahifalarda qidiruv/loading state'ni qo'llab-quvvatlasa-da, error state uchun ochiq komponent yaratilmagan.

## 4. Aniq tavsiya va qisqa reja
Loyihani barqarorlashtirish va foydalanuvchi tajribasini (UX) oshirish uchun, xatolarni ko'rsatish mexanizmini quyidagicha qurish tavsiya etiladi (keyingi task uchun):

1. **Shared Toast/Alert Komponenti va Servisi yaratish:** `src/app/shared/components/ui/toast` kabi markazlashgan toast ui komponentini va uni boshqaruvchi `ToastService` yaratish. U tizimdagi barcha muvaffaqiyat yoki xatolik haqida vaqtinchalik xabarlarni chiqarishga yordam beradi. Uni `app.component.html` da asosiy layner sifatida joylashtirish kerak.
2. **Global Error Interceptor ni kengaytirish:**
   `error-interceptor.ts` ga `ToastService` ni in'yeksiya qilib, 401 dan tashqari boshqa barcha API xatolarida markazlashgan toast xabar (masalan: "Tizimda xatolik yuz berdi" yoki API'dan kelgan `error.message`) ko'rsatishni qo'shish.
3. **Komponentlarni tozalash va to'ldirish:** Component'lardagi ko'plab o'lik `console.error(...)` chaqiruvlari olib tashlanib, xatolar faqat global interceptor orqali foydalanuvchiga vizual tarzda ko'rsatiladi. Component'larda faqatgina (agar kerak bo'lsa) loading state'ni yopish (`this.loading.set(false)`) amallari qoldirilishi kerak.
