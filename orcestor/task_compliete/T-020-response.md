# T-020 Natijasi

**Vazifa:** `notification-list`, `position-list`, `terminal-list`, `work-schedule-list` komponentlariga error-state qo'shish.

**Bajarilgan ishlar:**
- To'rtta komponentning `.ts` fayllariga `loadError = signal<boolean>(false);` qo'shildi.
- Barcha yuklash (load) funksiyalarida xato bo'lganda `this.loadError.set(true)` va so'rov yuborishdan avval `this.loadError.set(false)` holatiga o'tkazish ta'minlandi.
- `.html` fayllarda `@else if (loadError())` yoki `*ngIf="loadError()"` orqali xato bloki (`.error-state-box`) chiqarildi.
- Qayta urinib ko'rish (retry) tugmasi barcha joyda tegishli load metodini qaytadan ishga tushirishi ta'minlandi.
- `npm run build` orqali tekshirildi va loyiha xatosiz build bo'ldi.
