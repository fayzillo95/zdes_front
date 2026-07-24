# Orkestratsiya oqimi bosqichlari

Bu papka vazifaning boshidan oxirigacha (Claude Code → AGY → Claude Code) qanday harakatlanishini tavsiflaydi.

1. [01-intake.md](./01-intake.md) — Claude Code ishni aniqlaydi va vazifa faylini `tasks/` ga yaratadi.
2. [02-dispatch.md](./02-dispatch.md) — Claude Code promptni to'ldirib, vazifani `task_pending/` ga jo'natadi.
3. [03-execution.md](./03-execution.md) — Fayzillo promptni Antigravity'ga joylashtiradi, AGY vazifani bajaradi.
4. [04-review.md](./04-review.md) — Fayzillo AGY natijasini tekshiradi va loyihaga kiritadi.
5. [05-integration.md](./05-integration.md) — Claude Code natijani kodbazaga integratsiya qilib, statusni yangilaydi.
6. [06-logging.md](./06-logging.md) — Asosiy natijalar `history/` (va zarur bo'lsa loyiha darajasidagi jurnalga) yoziladi.
