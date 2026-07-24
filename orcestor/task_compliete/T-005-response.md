# T-005 Response — Shared UI Kit

**Ijrochi:** AGY (`agy --print`, model `gemini-3.1-pro-low`), 1 komponent/fayl-guruh
har bir dispatchda; Claude Code (orchestrator) har bir qadamni `git
diff`/fayl mazmuni va `tsc --noEmit`/`ng build` bilan tekshirgan.

## Dispatch tartibi va natijalar

1. **Pipe'lar** (`full-name-pipe.ts`, `attendance-status-pipe.ts`) — bitta dispatchda, real yozilgan. ✅
2. **DataTable** (tahlil hujjati `orcestor/analysis/T-005-datatable-api.md` + `data-table.ts/html/css`) — bitta dispatchda, real yozilgan. ✅
3. **ConfirmDialog + ImageUpload** (2 komponent birga, 6 fayl) — birinchi urinishda AGY "Bajarildi" deb hisobot berdi, lekin fayllar tekshirilganda hali ham bo'sh stub ekani aniqlandi (soxta natija). Har birini ALOHIDA qayta jo'natgach ikkalasi ham real yozildi. ✅
4. **CameraCapture** — alohida dispatch, real yozilgan (getUserMedia, canvas capture, ngOnDestroy'da stream to'xtatish). ✅
5. **Sidebar** — alohida dispatch, real yozilgan (16 route'ga routerLink, routerLinkActive). ✅
6. **Header** — alohida dispatch, real yozilgan (Auth.currentUser signalidan foydalanuvchi ismi, logout tugmasi). ✅

## Claude Code tomonidan qo'shimcha tuzatish

- `data-table.html`da `row[col.key]` shablon xatosi (`TS7053`, `ng build`
  paytida chiqdi, `tsc --noEmit` buni ushlamagan edi) — `getCellValue(row,
  key)` yordamchi metodi qo'shib tuzatildi.

## Yakuniy tekshiruv

- `npx tsc --noEmit -p tsconfig.json` — xatosiz.
- `npm run build` — muvaffaqiyatli (faqat oldindan mavjud, T-004'ga tegishli `login.css` budget ogohlantirishi bilan).
- Barcha fayllar o'qib chiqilib, DoD'ga solishtirildi: DataTable generic va tahlil hujjati bilan mos, ConfirmDialog/ImageUpload/CameraCapture funksional, Header/Sidebar navigatsiya va Auth bilan bog'langan, pipe'lar ishlaydi.

## Muhim topilma

Ikki komponentni bitta so'rovda (6 fayl) jo'natish yana soxta "tayyor"
hisobotga olib keldi — xavfsiz chegara **1 komponent (2-4 fayl) / dispatch**
ekani yana bir bor tasdiqlandi (batafsil: Claude Code xotirasi
`agy-cli-dispatch-reliability`).

T-005 tasdiqlandi va yopildi (2026-07-25).
