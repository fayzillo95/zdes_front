# T-016 Topshiriq Natijasi

1. **CSS o'zgarishlari:** `leave-form.css` va `work-schedule-form.css` fayllaridagi `.form-card` sinfidagi `background: var(--card-bg, #ffffff);` qatori `background: var(--color-bg-primary);` ga muvaffaqiyatli almashtirildi.

2. **Fallback'li o'zgaruvchilar tekshiruvi:**
Ikkala faylda ham bir nechta fallback (zaxira qiymat) bilan berilgan o'zgaruvchilar mavjud.
**`leave-form.css` da ishlatilgan fallback'li o'zgaruvchilar:**
- `var(--page-bg, #f8fafc)`
- `var(--border-color, #e2e8f0)`
- `var(--text-primary, #1e293b)`
- `var(--border-color, #cbd5e1)`
- `var(--input-bg, #ffffff)`
- `var(--text-primary, #0f172a)`

**`work-schedule-form.css` da ishlatilgan fallback'li o'zgaruvchilar:**
- `var(--color-border, #e2e8f0)`
- `var(--color-text-primary, #1e293b)`
- `var(--color-border, #cbd5e1)`
- `var(--color-bg-secondary, #f8fafc)`
- `var(--color-text-primary, #0f172a)`
- `var(--color-primary, #2563eb)`
- `var(--color-bg-secondary, #f1f5f9)`
- `var(--color-text-secondary, #94a3b8)`
- `var(--color-bg-primary, #ffffff)`

3. **npm run build tekshiruvi:** `npm run build` muvaffaqiyatli ishga tushirildi.

Topshiriq bajarildi va barcha fayllar `task_compliete` papkasiga ko'chirilmoqda.
