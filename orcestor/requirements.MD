# Talablar: Qoidalar va Rollar (Requirements)

Ushbu hujjat `orcestor/` papkasi orqali ishlaydigan fayl-asosli multi-agent
orkestratsiya tizimining **majburiy qoidalari va rollarini** belgilaydi.
Loyihaning barcha ishtirokchilari (Claude Code, AGY, Fayzillo) shu qoidalarga
rioya qiladi. Qoidaga zid harakat — xato hisoblanadi, hatto natija "ishlagan"
bo'lsa ham.

---

## 1. Rollar jadvali

| Rol | Kim / Nima | Mas'uliyat | Vakolat darajasi | Nima qila oladi | Nima qila OLMAYDI |
|---|---|---|---|---|---|
| **Claude Code** | Orkestrator (AI) | Vazifalarni bo'laklarga bo'lish, task fayllarini yozish, AGY natijasini tekshirish, kodni `src/`ga integratsiya qilish, arxitektura va sifat nazorati | **Yakuniy texnik vakolat** (final technical authority) | Task yaratish/tahrirlash, kodni review qilish, `src/`ga merge qilish, arxitekturaviy qaror qabul qilish, AGY natijasini rad etish | Ishlab chiqarish muhitiga (production) to'g'ridan-to'g'ri deploy qilish; Fayzilloning roziligisiz risky/keng qamrovli o'zgarishlarni yakunlash |
| **AGY** | Google Antigravity IDE (Gemini-asosli) sub-agent / ijrochi | `task_pending/`dagi vazifalarni bajarish — real kod yozish, ishga tushirish, test qilish | **Ijrochi vakolat** — faqat topshirilgan task doirasida | Kod yozish, mavjud kodni o'zgartirish (task doirasida), natijani `task_compliete/`ga topshirish | Claude Code bilan to'g'ridan-to'g'ri bog'lanish (API yo'q); main/production branchga bevosita push qilish; task doirasidan tashqari qaror qabul qilish; o'z ishini o'zi "tasdiqlangan" deb belgilash |
| **Fayzillo** | Inson — supervisor / ko'prik (bridge) | Claude Code va AGY o'rtasida qo'lda ma'lumot tashish (task va natijalarni copy-paste qilish), xavfli holatlarda yakuniy qaror | **Eng yuqori — inson nazorati** (final say on risky items) | Har qanday vazifani to'xtatish, bekor qilish, qayta yo'naltirish; xavfli/norouten holatlarda yakuniy "ha/yo'q" qarorini berish | Kodni Claude Code review qilmasdan to'g'ridan-to'g'ri mainga kiritish (favqulodda holatlar bundan mustasno va alohida qayd etiladi) |

**Muhim:** AGY va Claude Code o'rtasida to'g'ridan-to'g'ri API aloqasi yo'q —
har bir uzatish Fayzillo orqali qo'lda amalga oshiriladi. Shu sababli har bir
task fayli **o'z-o'zidan tushunarli (self-contained)** bo'lishi shart.

---

## 2. Qattiq qoidalar (Hard Rules)

1. **Production/main himoyasi.** AGY hech qachon `main` yoki production
   branchga bevosita tegmaydi yoki push qilmaydi. Barcha o'zgarishlar avval
   Claude Code tomonidan review qilinadi, so'ng Fayzillo orqali integratsiya
   qilinadi.
2. **"Bajarildi" deb hisoblash faqat statusdan keyin.** Claude Code hech
   qachon biror task "tugadi" deb faraz qilmaydi — bu faqat tegishli
   `status/` yozuvi mavjud va tasdiqlangan bo'lsa haqiqiy hisoblanadi. AGY
   xabari yoki Fayzilloning og'zaki tasdig'i yetarli emas — status fayli
   yozilishi shart.
3. **Review majburiy.** Har qanday kod o'zgarishi `src/`ga qo'shilishidan
   oldin Claude Code tomonidan ko'rib chiqilishi (review) shart. Review
   o'tmagan kod integratsiya qilinmaydi.
4. **Maxfiy ma'lumotlar taqiqlanadi.** API kalitlar, parollar, tokenlar,
   `.env` qiymatlari va boshqa sirlar hech qachon task fayllariga, status
   yozuvlariga yoki session loglariga yozilmaydi — bu fayllar oddiy matn
   (plain text) bo'lib, tarixda doimiy saqlanadi va istalgan vaqt qayta
   o'qilishi mumkin.
5. **Har bir o'zgarish izlanadigan (traceable) bo'lishi kerak.** Qaysi task
   qaysi commit/faylga olib kelganini keyinchalik aniqlash imkoni bo'lishi
   shart — shuning uchun task ID va status yozuvlari izchil yuritiladi.
6. **Papka nomlarini o'zgartirmaslik.** `task_compliete/` nomidagi xatoni
   ("complete" emas, "compliete") ataylab tuzatmaslik — mavjud struktura
   bilan mosligini saqlash uchun aynan shu nom ishlatiladi.

---

## 3. Vazifa hayot sikli (Task Lifecycle)

Har bir task quyidagi bosqichlar orqali harakatlanadi:

```
tasks/  →  task_pending/  →  task_compliete/  →  status/
```

| Bosqich | Papka | Kim yaratadi / ko'chiradi | Tavsif |
|---|---|---|---|
| 1. Backlog | `tasks/` | **Claude Code** | Yangi task yoziladi: aniq maqsad, qamrov (scope), kerakli fayllar/pointerlar. Hali hech kimga topshirilmagan. |
| 2. Dispatch | `task_pending/` | **Claude Code** yozadi → **Fayzillo** AGYga uzatadi | Task bajarish uchun tayyor deb belgilanadi va Fayzillo uni Antigravitydagi AGY agentiga qo'lda kiritadi. |
| 3. Bajarildi | `task_compliete/` | **Fayzillo** (AGY natijasini qo'lda ko'chiradi) | AGY natijasini (kod, diff, izoh) shu yerga qo'yadi. Bu hali "tasdiqlangan" degani emas — faqat "ijrochi tugatdi" degani. |
| 4. Tekshiruv va yopish | `status/` | **Claude Code** | `task_compliete/`dagi natijani review qiladi, qaror yozadi: `ACCEPTED`, `REJECTED`, yoki `NEEDS_REVISION`. Faqat shu yozuvdan keyin task "yopiq" hisoblanadi. |

**Qo'shimcha qoida:** agar task `NEEDS_REVISION` bo'lsa, u qayta `tasks/`ga
(yoki to'g'ridan-to'g'ri `task_pending/`ga, aniq tuzatish izohi bilan)
qaytariladi — status faylida sabab aniq yozilishi shart.

---

## 4. Eskalatsiya qoidasi (Escalation Rule)

Agar AGY:
- vazifani bajara olmasa (stuck),
- noaniq/qarama-qarshi natija chiqarsa,
- yoki **xavfli** o'zgarish taklif qilsa (masalan: ma'lumotlar bazasi
  migratsiyasi, auth logikasi, katta refactor, `package.json`/dependency
  o'zgarishi, production konfiguratsiyasi),

— bunday holatlar **avtomatik qayta urinilmaydi (no blind auto-retry)**.
Buning o'rniga:

1. Holat **Fayzilloga** yetkaziladi (u AGY ekranida buni ko'radi).
2. Fayzillo natijani **Claude Code**ga qaytaradi (masalan `task_compliete/`
   ga xato/qisman natija bilan yoki alohida izoh bilan).
3. Claude Code holatni tahlil qiladi va yo: (a) taskni aniqroq qilib qayta
   yozadi, (b) taskni kichikroq qismlarga bo'ladi, yoki (c) Fayzilloga
   inson qarori kerakligini bildiradi.
4. Faqat shundan keyin task qayta `task_pending/`ga qaytariladi.

Xavfli deb topilgan har qanday natija **hech qachon** Fayzillo yoki Claude
Code tasdig'isiz `src/`ga kiritilmaydi.

---

## 5. Token / xarajat intizomi (Token & Cost Discipline)

Fayl-asosli tizim odam tomonidan qo'lda ko'chiriladi va AI kontekst
oynasidan foydalanadi — shuning uchun:

1. **Task tavsiflari qisqa va aniq qamrovli bo'lishi kerak.** Har bir task
   bitta aniq maqsadga ega bo'lsin — "hamma narsani tuzat" kabi noaniq
   topshiriqlar taqiqlanadi.
2. **To'liq fayllarni tashlamaslik.** Agar fayl allaqachon mavjud bo'lsa,
   uning **yo'li (path)** va o'zgartirilishi kerak bo'lgan **aniq
   qism/qator** ko'rsatiladi — butun fayl matni task ichiga
   ko'chirilmaydi, faqat zarur bo'lgan diff yoki qisqa parcha keltiriladi.
3. **Pointer > Copy.** Kontekst uchun fayl nusxasi o'rniga fayl yo'liga
   (`src/app/...`) havola berish afzal — bu ham token, ham inson vaqtini
   tejaydi.
4. **Ortiqcha tarixni qaytarmaslik.** Yangi task yozishda avvalgi
   sessiyalarning to'liq loglari emas, faqat `history/`dagi **xulosalangan
   (distilled)** ma'lumot ishlatiladi.
5. **Status yozuvlari ham qisqa bo'ladi.** `status/`ga natijani tavsiflovchi
   qisqa, struktura holatini (`ACCEPTED`/`REJECTED`/`NEEDS_REVISION`) va
   sababini yozish yetarli — uzun muhokama emas.

---

## 6. AGY kvota nazorati va model-switch qoidasi (2026-07-25)

`agy` CLI orqali fire-and-forget dispatch qilinganda, AGY'ning kvotasi
(odatda default Gemini Flash tier) sessiya davomida tugab qolishi mumkin —
xato aniq ko'rinishda qaytadi: `Error: Individual quota reached... Resets
in <vaqt>`.

**Muhim: `/usage` orqali oldindan tekshirib bo'lmaydi.** `agy --print
"/usage"` sinab ko'rilgan — bu real kvota ma'lumotini qaytarmaydi (model
shunchaki umumiy javob "hallutsinatsiya" qiladi, chunki headless `--print`
rejimida hisob balansiga haqiqiy tool-access yo'q). Demak kvotani oldindan
bilishning ishonchli usuli yo'q — buning o'rniga quyidagi reaktiv qoida
qo'llaniladi:

1. Har bir `agy --print` chaqiruvida **aniq model ko'rsatilsin**
   (`--model gemini-3.1-pro-low`) — sukut bo'yicha Flash tier ishlatiladi,
   u tezroq tugaydi.
2. Agar chaqiruv "Individual quota reached" xatosi bilan qaytsa:
   - Avval keyingi model darajasiga o'ting (masalan
     `gemini-3.1-pro-low` → `gemini-3.1-pro-high`, keyin zarurat bo'lsa
     Gemini bo'lmagan variantlar: `claude-sonnet-4-6`,
     `gpt-oss-120b-medium`).
   - Agar barcha modellar ham kvota xatosi bersa, xatoda ko'rsatilgan
     "Resets in Xh Ym" vaqtigacha **hech qanday qayta urinish qilinmaydi**
     — AGY-bog'liq barcha ishlar to'xtatiladi, faqat Claude Code o'zi
     bajaradigan (AGY'siz) task'lar davom ettiriladi.
3. `agy models` buyrug'i orqali mavjud modellar ro'yxati olinadi —
   ro'yxat vaqti-vaqti bilan o'zgarishi mumkin, shuning uchun qattiq
   kodlanmagan, har safar tekshirilsin.

Batafsil topilmalar va real misollar: Claude Code xotirasidagi
`agy-cli-dispatch-reliability` yozuvi.

---

## 7. `project_docs/api/` — hujjatlarni doimiy yangilab borish qoidasi (2026-07-25)

T-020/T-021/T-022 orqali `project_docs/api/` ichida har bir modul uchun
API endpoint + tip + state hujjati yaratildi (`README.md` — yakuniy
indeks). Bu hujjat **bir martalik snapshot emas** — loyiha davom etar
ekan, quyidagi holatlarda **shu hujjatlar ham majburiy yangilanadi**:

1. **Yangi endpoint qo'shilsa yoki mavjudi o'zgarsa** (metod, yo'l, so'rov/
   javob tipi) — tegishli `project_docs/api/<modul>.md` faylidagi
   "Endpoint'lar" jadvali darhol yangilanadi.
2. **Yangi model/tip qo'shilsa yoki mavjudi o'zgarsa**
   (`src/app/core/models/*.ts` yoki feature ichidagi tiplar) — "Tiplar"
   bo'limi shu bilan sinxron tutiladi.
3. **Sahifa/komponentning state boshqaruvi o'zgarsa** (masalan oddiy
   propertydan `signal()`ga o'tilsa, yoki yangi state o'zgaruvchi
   qo'shilsa) — "State" jadvali yangilanadi.
4. **Butunlay yangi modul/feature qo'shilsa** (masalan T-032 — Auth
   `/sign` sahifasi) — o'sha modul uchun **yangi** `project_docs/api/
   <modul>.md` yozilishi va `project_docs/api/README.md` indeksiga
   qo'shilishi shart.
5. **Kim yangilaydi:** hujjat yangilanishi tegishli task/AGY-dispatchning
   **Definition of Done** qismiga aniq band sifatida kiritiladi — ya'ni
   kod o'zgarishini bajaruvchi task (masalan T-025 Axios, T-032 Auth
   `/sign`) o'z DoD'ida "tegishli `project_docs/api/*.md` fayli(lari) ham
   yangilangan" shartini o'z ichiga oladi. Claude Code yangi task
   yozayotganda buni unutmasligi kerak.
6. **Review paytida tekshiriladi:** Claude Code kod o'zgarishini
   `task_compliete/`ga yopishdan oldin, agar o'zgarish API/tip/state'ga
   tegsa, mos `project_docs/api/*.md` fayli ham yangilanganini
   tasdiqlaydi — aks holda task `NEEDS_REVISION` deb qaytariladi (4-bo'lim,
   Eskalatsiya qoidasi ruhida).

Maqsad: `project_docs/api/` doim kodning **haqiqiy joriy holatini**
aks ettirsin — vaqt o'tishi bilan eskirib, chalg'ituvchi hujjatga
aylanmasin.

---

*Ushbu hujjat `orcestor/` tizimining barcha ishtirokchilari uchun
majburiydir. O'zgartirish faqat Claude Code tomonidan, Fayzillo bilan
kelishilgan holda amalga oshiriladi.*
