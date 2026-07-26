# T-003 Bajarildi

## Qadamlar
1. `dashboard.css` faylida stat kartalar uchun CSS grid (1 ustunli mobil, 2 ustunli planshet va 4 ustunli desktop uchun) qoidalari yozildi.
2. `.stat-card` class'iga `backdrop-blur` xususiyatlari, shisha (glassmorphism) dizayn uslubi, `var(--color-bg-primary)` foni va soya (`box-shadow`) qo'shildi. Hover effekti kattalashtirildi.
3. `.stat-card:nth-child(n)` pseudo-classlari yordamida har bir kartaning chap tarafiga 4 xil (`--color-chart-purple`, `--color-chart-pink`, `--color-chart-green`, `--color-chart-yellow`) vizual aksent rang o'rnatildi (`border-left-color` yordamida).
4. Ichki matnlar (`.stat-card__value` va `.stat-card__label`) dizayn ko'rsatmalariga muvofiq, kerakli shrift o'lchamlari va harf oraliqlari (letter-spacing) bilan boyitildi.
5. HTML va TS fayllariga tegilmaslik chekloviga to'liq amal qilindi; hech qanday soxta malumot yoki qoshimcha DOM elementlari yaratilmadi.

## O'zgargan fayllar
| Fayl | O'zgarish |
|------|-----------|
| `src/app/features/dashboard/pages/dashboard/dashboard.css` | 4 ta mavjud stat karta uchun referensga asoslangan vizual "shisha karta" dizayni to'liq css-levelda amalga oshirildi. |
