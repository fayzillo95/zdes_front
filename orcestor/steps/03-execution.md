# 3-bosqich: Execution (Bajarilish)

**Maqsad:** AGY (Antigravity IDE) tayyorlangan promptga asosan haqiqiy ishni bajaradi.

**Mas'ul:** Fayzillo (relay) va AGY (ijrochi)

**Kirish (Input):**
- `orcestor/task_pending/` dagi to'ldirilgan prompt

**Jarayon:**
1. Fayzillo promptni Antigravity Agent Manager'ga "New Task" sifatida joylashtiradi
2. Vazifaga mos rejim tanlanadi: Agent-driven / Review-driven / Agent-assisted
3. AGY vazifani ijro etadi (kod yozadi, o'zgartiradi, test qiladi)

**Chiqish (Output):**
- AGY tomonidan yaratilgan/o'zgartirilgan kod, izohlar va natijalar (Antigravity ichida)

**Done when:**
AGY vazifani yakunlaydi va natija Fayzillo ko'rib chiqishi uchun Antigravity'da tayyor holatda turadi.
