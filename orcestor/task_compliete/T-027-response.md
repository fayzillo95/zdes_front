# T-027: DataTable — qidiruv/filter funksiyasi (Natija)

## Bajarilgan ishlar:
1. `src/app/shared/components/ui/data-table/data-table.ts` fayliga kirildi.
2. `FormsModule` komponentga import qilindi (`standalone: true` bo'lgani uchun `imports` ro'yxatiga qo'shildi).
3. `@Input() filterable` va `@Input() filterPlaceholder` parametrlari qo'shildi.
4. `searchTerm` xususiyati va `onSearchChange()` metodi qo'shildi.
5. `processData()` metodi ichida ma'lumot oqimi tartibi `filter -> sort -> pagination` shakliga o'zgartirildi va filterlash logikasi barcha ustunlar uchun ishlashi ta'minlandi.
6. `src/app/shared/components/ui/data-table/data-table.html` faylida jadval tepasiga qidiruv uchun `input` maydoni qo'shildi (faqat `filterable = true` bo'lganda ko'rinadi).
7. Jadval ko'rinishi va `emptyMessage` state ishlatilishi `processedData` bilan to'g'ri ishlashini ta'minlash maqsadida tegishli o'zgartirishlar kiritildi.
8. `npx tsc --noEmit` bilan muvaffaqiyatli tekshirildi (xatosiz o'tdi).

## Yakuniy xulosa:
Topshiriq barcha DoD talablariga muvofiq bajarildi. Endi `DataTable` komponenti `filterable` parametri orqali oddiy matnli (substring) qidiruv imkoniyatiga ega. Qidiruv jarayoni ma'lumotlarni saralash va sahifalashdan oldin bajariladi, shuningdek qidiruv natijasi topilmasa, belgilangan `emptyMessage` to'g'ri ko'rsatiladi.

## O'zgargan fayllar:
| Fayl | Turi | Qisqa sabab |
|---|---|---|
| `src/app/shared/components/ui/data-table/data-table.ts` | TS | `FormsModule` ulandi, filter bo'yicha @Input'lar, `searchTerm`, va filter/sort/pagination logikasi tartiblandi |
| `src/app/shared/components/ui/data-table/data-table.html` | HTML | Qidiruv `input` maydoni kiritildi va bo'sh holat ko'rsatkichi (`emptyMessage`) `processedData`ga qarab ishlashi ta'minlandi |

## Orchestrator (Claude Code) tekshiruvi va qo'shimcha tuzatish
- AGY faqat `npx tsc --noEmit` bilan tekshirgan edi — men qo'shimcha
  to'liq `npm run build` bilan tekshirdim, xatosiz o'tdi.
- Qidiruv inputi hardcoded rangda (`#ddd`) inline `style` orqali yozilgan
  edi — bu loyihaning dark/light CSS o'zgaruvchilar sxemasiga zid edi.
  Tuzatildi: `.data-table-search`/`.data-table-toolbar` klasslari
  `data-table.css`ga qo'shildi, `var(--color-border)`,
  `var(--color-bg-primary)`, `var(--color-text-primary)` ishlatildi,
  inline style olib tashlandi.
- T-026'dan qolgan eskirgan `.loading-state` flex-markazlashtirish va
  ishlatilmay qolgan `.spinner`/`@keyframes spin` CSS qoidalari ham
  tozalandi (o'lik kod, T-026 spinner HTML'ini olib tashlagan edi).
- `npm run build` qayta ishga tushirildi — xatosiz o'tdi.
