# T-014 Bajarildi

Task doirasida belgilanganidek loyihaning ishlash samaradorligi (performance) tahlil qilindi. Hech qanday kod o'zgartirilmadi, faqat ko'zdan kechirish va `npm run build` orqali ma'lumot to'plandi.

Natijalar `orcestor/analysis/T-014-performance-analysis.md` fayliga yozildi.

**Qisqacha xulosa:**
- **Chunk sizes:** Lazy loading yaxshi ishlagan, modullar ~10kb atrofida.
- **OnPush:** Umuman ishlatilmagan, har bir komponent Default strategiyada.
- **Subscriptions:** `subscribe` qilingan lekin `unsubscribe` yoki `takeUntilDestroyed` yo'q, xotira yo'qotish (memory leak) xavfi yuqori.
- **DataTable:** Pagination va Sorting front-end tomonda bajarilgan. Data hajm oshishi bilan brauzerda qotib qolish va xotira yuklamasi kuzatiladi (backend pagination ga o'tish zarur).
