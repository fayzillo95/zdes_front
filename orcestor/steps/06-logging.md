# 6-bosqich: Logging (Yozib qo'yish)

**Maqsad:** Yakunlangan vazifadagi asosiy qarorlar va natijalar tarixiy jurnalga qayd etiladi.

**Mas'ul:** Claude Code (Orchestrator)

**Kirish (Input):**
- `orcestor/status/` dagi yakuniy natija
- `orcestor/task_compliete/` dagi yakunlangan vazifa

**Chiqish (Output):**
- Qisqa xulosa `orcestor/history/` ichida (operatsion jurnal)
- Muhim/keng ta'sirli o'zgarishlar bo'lsa — loyiha darajasidagi `session/` va `history/` papkalariga ham yoziladi

**Done when:**
Vazifa bo'yicha xulosa `orcestor/history/` da mavjud, va agar ahamiyatli bo'lsa, loyiha darajasidagi jurnalga ham qayd etilgan.
