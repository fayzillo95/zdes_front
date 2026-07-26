# 2-bosqich: Dispatch (Vazifani jo'natishga tayyorlash)

**Maqsad:** Claude Code tanlangan vazifani AGY uchun ijro etiladigan promptga aylantiradi va uni navbatga qo'yadi.

**Mas'ul:** Claude Code (Orchestrator)

**Kirish (Input):**
- `orcestor/tasks/` dagi vazifa fayli
- `orcestor/prompt.md` shabloni

**Chiqish (Output):**
- To'ldirilgan prompt (vazifa tafsilotlari bilan)
- Vazifa fayli `orcestor/task_pending/` papkasiga ko'chirilgan/nusxalangan
- Fayzillo'ga xabar: prompt tayyor, Antigravity'ga relay qilish kerak

**Done when:**
Vazifa `orcestor/task_pending/` da joylashgan, to'ldirilgan prompt Fayzillo'ga uzatishga tayyor holda taqdim etilgan.
