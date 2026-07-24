# Xabar: ikkinchi (permission) sessiyadan — orcestor/ tizimida qilingan o'zgarishlar

Bu fayl boshqa terminaldagi Claude Code sessiyasi uchun yozildi. Ikkala
sessiya o'rtasida to'g'ridan-to'g'ri bog'lanish yo'q, shuning uchun Fayzillo
buni qo'lda ko'rsatadi. Quyidagilarni bilib oling:

## 1. `orcestor/dispatch.py`ga yangi `check` subcommand qo'shildi (faqat maslahat, gate emas)

```
python3 orcestor/dispatch.py check T-XXX [--build]
```

Hech narsaga yozmaydi, status/ACCEPTED/REJECTED belgilamaydi — faqat 3 ta
signal chiqaradi:
1. Task scope'idagi fayllar haqiqatan o'zgarganmi (bo'sh bo'lsa — soxta
   "tayyor" hisobot xavfi, xuddi T-004'da bo'lgani kabi).
2. Scope'dan tashqari o'zgargan fayllar (eslatma sifatida, xato emas —
   umumiy working tree'da bir nechta task/sessiya parallel bo'lishi mumkin).
3. Response.md'da "O'zgargan fayllar" jadvali va Definition of Done
   eslatilganmi.

Review qilishdan oldin ishlatib ko'rish tavsiya etiladi, lekin yakuniy
ACCEPTED/REJECTED qarori va `status/` yozuvi baribir sizning zimmangizda
qoladi — bu skript review'ni almashtirmaydi, faqat tezlashtiradi.

## 2. `orcestor/prompt.md` shabloni yangilandi

Endi har bir yangi task uchun "Report back" bo'limida AGY'dan
**"O'zgargan fayllar" jadvali** talab qilinadi (fayl | turi | qisqa sabab).
Bu review'ni tezlashtirish uchun (to'liq faylni o'qimasdan, nuqtali
`git diff` qilish imkoni).

**T-005 va undan oldingi tasklar bu jadvalsiz** — bu normal, ular shablon
yangilanishidan oldin dispatch qilingan. T-007'dan boshlab yangi tasklarni
`orcestor/tasks/`ga yozganda (yoki `dispatch.py new` bilan) shu talab
avtomatik kiradi.

## 3. Kichik bug tuzatildi

`dispatch.py new T-XXX` oldin noto'g'ri blokni (section 3'dagi to'ldirilgan
T-021 namunasini, section 1'dagi bo'sh shablon o'rniga) chiqarayotgan edi
(regex xatosi — greedy `.*` oxirgi ```markdown blokni tanlab olayotgan edi).
Endi to'g'ri ishlaydi.

## 4. Permission eslatmasi

`.claude/settings.local.json`da Write ruxsati loyiha papkasi +
`~/.claude/**` + `/tmp/claude-*/**` bilan cheklangan, `rm` esa faqat
`orcestor/*` bilan. Agar shundan tashqarida biror amal uchun ruxsat
prompti chiqsa (bloklanmaydi, faqat so'raladi) — Fayzilloga yoki
ikkinchi (permission) sessiyaga ayting, kerak bo'lsa qo'shib qo'yiladi.

## 5. T-005 holati

Test paytida payqaldi: T-005 allaqachon `orcestor/task_compliete/`ga
ko'chirilgan, scope bo'yicha 26 ta fayl to'g'ri o'zgargan ko'rinadi. Agar
hali `status/T-005.log`ga ACCEPTED/REJECTED yozilmagan bo'lsa, shuni
navbatga qo'ying.
