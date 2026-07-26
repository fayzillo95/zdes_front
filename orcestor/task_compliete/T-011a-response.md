# Task T-011a Response

## Bajarilgan ishlar (DoD):
- `leave-list`, `position-list` va `terminal-list` sahifalarida column-level filter jadvali muvaffaqiyatli amalga oshirildi.
- "Filterga mos topilmadi" xabari qator ostida va to'g'ri holatda (empty-state-cell) qo'shildi.
- "Amallar" (actions-cell) ustuni va delete tugmalariga umuman tegilmadi.
- `FormsModule` barcha .ts fayllariga import qilindi va signal/computed metodlari yordamida client-side filterlash ishlashi joriy etildi.
- `npm run build` orqali tekshirildi va muvaffaqiyatli yakunlandi (xatosiz o'tdi).
