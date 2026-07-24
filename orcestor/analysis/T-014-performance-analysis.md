# Performance Tahlili (T-014)

## 1. Bundle (Chunk) Hajmlari
`npm run build` tahliliga ko'ra asosiy va qism chunk'lar quyidagicha shakllanmoqda. Feature modullar lazy-loading yordamida to'g'ri ajratilgan.

**Asosiy (Initial) Chunk'lar:**
- `chunk-QGA5QROI.js`: 326.07 kB (vendor libs)
- `main-YNMJOEWB.js`: 8.59 kB
- `styles-2EYMHZC6.css`: 8.11 kB

**Eng katta 5 ta Lazy Chunk (Feature modules):**
1. `chunk-RMYHBGUK.js` (Noma'lum chunk, ehtimol shared components): 41.50 kB
2. `auth-module`: 9.71 kB
3. `employees-module`: 8.35 kB
4. `advances-module`: 8.09 kB
5. `attendance-module`: 7.42 kB

Xulosa: Chunk hajmlari optimallashtirilgan holatda. Asosiy angular kutubxonalari bitta yirik chunk'ga o'tgan, lekin qolgan barcha feature'lar <10 kB atrofida lazy-load bo'lmoqda.

## 2. Change Detection Strategiyasi
Loyiha bo'ylab barcha komponentlar default change detection (`ChangeDetectionStrategy.Default`) da ishlamoqda. Loyiha kodida umuman `ChangeDetectionStrategy.OnPush` qidiruvi natija bermadi.
**Tavsiya:** Barcha taqdimotchi (presentational) va sahifa (container) komponentlarida `ChangeDetectionStrategy.OnPush` yoqilishi zarur. Bu Angular ilovasida keraksiz tekshirish (dirty checking) sikllarini oldini olib, ishlash tezligini sezilarli oshiradi.

## 3. RxJS Subscriptions va Memory Leaks
`src/app` ichida yuzlab `subscribe` funksiyalari (masalan, `employee-list`, `branch-list` va h.k.) chaqirilgan, biroq `unsubscribe()` yoki Angular 16+ da keng qullaniladigan `takeUntilDestroyed` kabi operatorlar umuman yo'q.
**Muammo:** Komponent yo'q qilinganda ham (destroy) HTTP yoki boshqa observable'lar davom etaverishi mumkin, bu esa Memory Leak'larga olib keladi.
**Tavsiya:** Obunalarni (subscribe) boshqarish uchun barcha mavjud `.subscribe(...)` chaqiriqlari oldidan `takeUntilDestroyed()` (Angular v16+) ni qo'shish tavsiya qilinadi, yoki AsyncPipe ishlatilishi kerak.

## 4. DataTable Komponenti Tahlili
`shared/components/ui/data-table` komponentini ko'zdan kechirganimizda:
- U client-side (brauzer tomonda) `sort` va pagination (`slice`) qilyapti. Barcha ma'lumotlar avval bir array'ga yuklanib, keyin sahifalanyapti.
- Kichik hajmda (0-100 element) bu qulay ishlaydi, ammo agar xodimlar yoki ma'lumotlar minglab yozuvlarni tashkil qilsa, frontend'ga xotira yuklamasi tushadi va interfeys qotib qoladi.
**Tavsiya:** Client-side pagination'dan Server-side (backend) pagination va sorting usuliga o'tish zarur. `DataTable` komponentiga backend orqali page, limit va sortKey jo'natilishi ta'minlanishi, u faqat vizualizatsiyani bajaradigan "dumb" komponent bo'lib qolishi lozim.
