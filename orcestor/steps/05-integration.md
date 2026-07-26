# 5-bosqich: Integration (Kodbazaga integratsiya)

**Maqsad:** Claude Code qaytarilgan ishni kodbaza bilan solishtirib tekshiradi va uni yakuniy integratsiya qiladi.

**Mas'ul:** Claude Code (Orchestrator, yakuniy vakolat)

**Kirish (Input):**
- Fayzillo tomonidan loyihaga kiritilgan AGY natijasi

**Jarayon:**
1. Kod sifat, konventsiya va vazifa talablariga mosligi tekshiriladi
2. Mos bo'lsa — integratsiya qilinadi (merge/finalize); mos bo'lmasa — tuzatish so'raladi (qayta dispatch)
3. `orcestor/status/` ga natija bo'yicha log yoziladi
4. Vazifa fayli `task_pending/` dan `task_compliete/` ga ko'chiriladi

**Chiqish (Output):**
- Yangilangan `orcestor/status/` yozuvi
- Vazifa fayli `orcestor/task_compliete/` da

**Done when:**
Kod kodbazaga integratsiya qilingan, status yangilangan, vazifa fayli `task_compliete/` ga ko'chirilgan.
