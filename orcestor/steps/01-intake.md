# 1-bosqich: Intake (Vazifani aniqlash)

**Maqsad:** Claude Code kodda bajarilishi kerak bo'lgan ishni aniqlaydi va uni aniq chegaralangan (scoped) vazifaga aylantiradi.

**Mas'ul:** Claude Code (Orchestrator)

**Kirish (Input):**
- Loyihadagi holat, foydalanuvchi so'rovi yoki mavjud backlog
- Kodbaza konteksti (`zdes-frontend`)

**Chiqish (Output):**
- Yangi vazifa fayli `orcestor/tasks/` papkasida (masalan, `TASK-001-nomi.md`)
- Vazifa faylida: maqsad, qamrov (scope), qabul mezonlari, tegishli fayllar/modullar

**Done when:**
Vazifa fayli `orcestor/tasks/` ichida yaratilgan, aniq va bitta izchil ishni tasvirlaydi, keyingi bosqich (dispatch) uchun tayyor.
