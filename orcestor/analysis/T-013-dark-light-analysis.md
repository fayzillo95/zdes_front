# Dark/Light Rejim Moslik Tahlili (T-013)

## 1. Hozirgi holat xulosasi

Loyihadagi barcha `.css` fayllar (`src/app/**/*.css` va `src/styles.css`) tekshirildi.

- **Umumiy CSS fayllar soni:** 43 ta
- **Qattiq kodlangan (hardcoded) ranglar ishlatilgan fayllar soni:** 35 ta

**Eng ko'p takrorlanadigan rang qiymatlari:**
- Oq/Fonga oid: `#fff` / `#ffffff` (~19 marta)
- Asosiy (Primary) ranglar: `#007bff` (~14 marta), `#0056b3` (~8 marta)
- Matn/Kulrang ranglar: `#6c757d`, `#374151` (~15 marta)
- Border/Chiziq ranglar: `#ccc`, `#ddd`, `#e5e7eb` (~26 marta)
- Xavf (Danger): `#dc3545` (~10 marta)
- Shaffof/Overlay (Shadow): `rgba(0, 0, 0, 0.1)` (~8 marta)

Hozirgi vaqtda loyihada ranglar mutlaqo qattiq kodlangan bo'lib, Dark/Light rejim uchun markazlashgan CSS custom properties (o'zgaruvchilar) mexanizmi qo'llanilmagan.

## 2. Taklif qilinayotgan CSS custom property sxemasi

Global `src/styles.css` faylida quyidagi CSS o'zgaruvchilarini joriy etish tavsiya qilinadi:

```css
/* LIGHT THEME (Standart) */
:root {
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f3f4f6; /* yoki #f9fafb / #f8f9fa */
  
  --color-text-primary: #1a1a1a; /* yoki #333 */
  --color-text-secondary: #6c757d; /* yoki #6b7280 */
  
  --color-border: #e5e7eb; /* yoki #ccc, #ddd */
  
  --color-primary: #007bff;
  --color-primary-hover: #0056b3;
  
  --color-danger: #dc3545;
  --color-success: #10b981;
  
  --color-overlay: rgba(0, 0, 0, 0.5);
  --shadow-color: rgba(0, 0, 0, 0.1);
}

/* DARK THEME */
:root[data-theme="dark"] {
  --color-bg-primary: #121212;
  --color-bg-secondary: #1e1e1e;
  
  --color-text-primary: #f3f4f6;
  --color-text-secondary: #9ca3af;
  
  --color-border: #374151;
  
  --color-primary: #3b82f6; /* Qorong'i fonda yaxshiroq ko'rinadigan ko'k */
  --color-primary-hover: #60a5fa;
  
  --color-danger: #ef4444;
  --color-success: #34d399;
  
  --color-overlay: rgba(255, 255, 255, 0.1);
  --shadow-color: rgba(0, 0, 0, 0.5);
}
```

## 3. `:root` va `:root[data-theme="dark"]` ulash tavsiyasi

1. **Strukturaviy baza:** O'zgaruvchilarni loyihaning asosiy CSS fayli bo'lgan `src/styles.css` ning eng yuqori qismida e'lon qilish.
2. **Rejimni boshqarish:** Angular dasturida `ThemeService` kabi xizmat orqali `document.documentElement.setAttribute('data-theme', 'dark')` funksiyasini chaqirish (Dark rejim yoqilganda) va `.removeAttribute('data-theme')` qilib o'chirish (Light rejimda).
3. **Komponentlarni tozalash:** Har bir Angular komponentining `.css` faylidagi qattiq kodlangan (`#fff`, `#007bff`, `rgba(...)`) ranglarni `var(--color-...)` ko'rinishiga almashtirib chiqish. Hech qanday CSS-in-JS kutubxonalari kerak emas, oddiy brauzer custom properties funksionalligi yetarli.

## 4. T-017 (Amalga oshirish) uchun fayllar ustuvorlik ro'yxati

Amaliy ishni eng ko'p ishlatiladigan umumiy (shared) komponentlardan va eng ko'p stil o'z ichiga olgan sahifalardan boshlash tavsiya etiladi.

**1. Umumiy (Global va Shared) fayllar:**
- `src/styles.css` (O'zgaruvchilarni yaratish)
- `src/app/shared/components/ui/data-table/data-table.css` (Eng muhim, 19 ta rang)
- `src/app/shared/components/ui/confirm-dialog/confirm-dialog.css` (11 ta rang)
- `src/app/shared/components/ui/camera-capture/camera-capture.css` (12 ta rang)
- `src/app/shared/components/ui/image-upload/image-upload.css`

**2. Katta sahifalar (Pages) - Ranglar ko'p ishlatilgan:**
- `src/app/features/auth/pages/login/login.css` (Rekord: 36 ta rang)
- `src/app/features/holidays/pages/holiday-form/holiday-form.css` (15 ta rang)
- `src/app/features/payroll/pages/payroll-detail/payroll-detail.css` (14 ta rang)
- `src/app/features/company/pages/company-detail/company-detail.css` (14 ta rang)
- `src/app/features/attendance/pages/scanner/scanner.css` (14 ta rang)

**3. Qolgan modullar:**
Boshqa barcha komponentlar ro'yxat bo'yicha ketma-ket yangilanadi.
