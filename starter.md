# Starter — yangi sessiya uchun holat va davom etish qo'llanmasi

> **Session ID (ushbu fayl yozilgan sessiya):** `71685c8c-9dd3-4f80-8c9d-cc9b419185f6`
> Fayzillo ehtimol shu sessiyani `claude --resume 71685c8c-9dd3-4f80-8c9d-cc9b419185f6`
> orqali davom ettiradi. Agar shunday bo'lsa, bu fayl ORTIQCHA — to'liq
> konteksт allaqachon mavjud. Bu fayl faqat **yangi/toza** sessiya
> ochilganda kerak.

> **MUHIM — YANGI SESSIYA UCHUN QOIDA:** Bu faylni o'qigandan keyin
> **DARHOL ISHNI BOSHLAMANG**. Avval quyidagilarni o'qib chiqing
> (`project_docs/design-reference.md`, `git log --oneline -25`,
> `orcestor/tasks/` ro'yxati), keyin Fayzilloga **qisqacha xulosa**
> bering (nima tugagan, nima navbatda) va **qaysi task/ishdan
> boshlashni so'rang** — o'zingizcha T-014'dan boshlab dispatch
> qilishga KIRISHMANG, chunki Fayzillo boshqa narsa bilan boshlashni
> xohlashi mumkin (masalan yangi bug ko'rsatishi mumkin).
>
> **Chat tili: O'ZBEK TILI.** Fayzillo bilan barcha muloqot o'zbek
> tilida bo'ladi (u shunday so'ragan).

## 1. Loyiha nima

`zdes-frontend` — Angular 21 (SSR, standalone komponentlar, Tailwind
CSS v4) admin panel, `~/Desktop/zdes/zdes_backend` (NestJS) bilan
ishlaydi. Git remote: `git@github.com:fayzillo95/zdes_front.git`,
joriy branch `main`.

**Dev serverlar** (bu sessiya oxirida ishga tushirilgan, fon rejimida,
`disown` qilingan — yangi sessiya boshlanganda ULAR ENDI ISHLAMAY
QOLGAN BO'LISHI MUMKIN, avval tekshiring):
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/v1/branches --max-time 3   # 401 kutiladi = ishlayapti
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4200 --max-time 3                    # 200 kutiladi = ishlayapti
```
Agar ishlamasa: backend — `cd ~/Desktop/zdes/zdes_backend && npm run start` (fon rejimida),
frontend — shu repo root'ida `npm start` (fon rejimida, birinchi build ~15-20 soniya
vaqt oladi, curl tekshiruvini shunga qarab kechiktiring).

## 2. Orcestor pipeline — joriy holat (2026-07-27 boshida)

**Tizim tavsifi:** `orcestor/README.MD` + `orcestor/requirements.MD`ni
o'qing (qoidalar, rollar, task lifecycle). Qisqacha: Claude Code
`orcestor/tasks/`ga task yozadi → `python3 orcestor/dispatch.py send T-0XX`
bilan `task_pending/`ga ko'chiradi → quyidagi buyruq bilan **to'g'ridan-to'g'ri
CLI orqali** (qo'lda Antigravity'ga copy-paste EMAS — bu amaliyot
o'zgargan) `agy`ga dispatch qilinadi:
```bash
TASK_CONTENT="$(cat orcestor/task_pending/T-0XX.md)" && agy --print "$TASK_CONTENT" \
  --model gemini-3.1-pro-low --add-dir /home/fayzillo/Desktop/zdes-frontend \
  --dangerously-skip-permissions --mode accept-edits > /path/to/log 2>&1
```
Natija AGY tomonidan avtomatik `task_compliete/`ga ko'chiriladi. **HAR DOIM**
`git diff` + `npm run build` bilan tekshiring — AGY'ning o'z "muvaffaqiyat"
xabariga ISHONMANG (bir necha marta noto'g'ri/qisman natijani "to'liq
bajarildi" deb qaytargan). Keyin `python3 orcestor/dispatch.py complete T-0XX`
bilan status yozing (avtomatik yozilgan bir qatorlik logni to'liqroq
ACCEPTED/REJECTED yozuvga almashtiring — oldingi `status/T-0XX.log`
fayllariga qarang, format namunasi bor), so'ng **shu task uchun alohida
commit qiling** (Fayzillo har bir task uchun alohida commit xohlaydi,
hammasini oxirida birlashtirib emas).

Kvota tugasa (`Individual quota reached`): `--model` ni
`gemini-3.1-pro-high` ga, keyin kerak bo'lsa `claude-sonnet-4-6` ga
almashtiring (`agy models` bilan ro'yxatni tekshiring — o'zgarishi mumkin).

### Tugagan (commit qilingan):
T-001 dan T-013'gacha barchasi — `git log --oneline` orqali ko'ring.
Oxirgi 4 tasi shu sessiyada tugadi: **T-011a** (leaves/positions/terminals
filter), **T-011b** (work-schedules/attendance/payroll filter), **T-012**
(4 ta forma sahifasi kanonik struktura), **T-013** (employee-detail/
attendance-detail kanonik detail struktura).

### Backlog — HALI DISPATCH QILINMAGAN (`orcestor/tasks/`da tayyor turibdi):
**T-014 dan T-022'gacha, 9 ta task.** Bularning barchasi shu sessiyada
Fayzillo bergan jonli feedback asosida yozilgan (pastga qarang, bo'lim 3).
Tavsiya etilgan tartib:
1. **T-014 BIRINCHI bo'lishi SHART** — u global CSS klasslar (`.error-state-box`
   va h.k.) qo'shadi, T-018–T-022 shularga tayanadi.
2. T-015, T-016 — mustaqil, istalgan vaqt (kichik, aniq bug-fix).
3. T-017 — **vizual reproduksiya talab qiladi** (brauzerda hover holatini
   ko'rish kerak), boshqalardan farqli, ehtiyot bilan (task faylida
   batafsil yozilgan).
4. T-018 → T-019 → T-020 → T-021 → T-022 — T-014'dan keyin, istalgan
   tartibda (bir-biriga bog'liq emas, faqat T-014'ga bog'liq).

## 3. Bu sessiyada Fayzillo ko'rsatgan LIVE BUGLAR (muhim, unutilmasin)

Frontend/backend shu sessiyada ishga tushirilgach, Fayzillo brauzerda
sinab ko'rib, ketma-ket 4 ta muammo topdi. Barchasi tekshirilib,
sabab aniqlanib (yoki aniqlanmay), task yozildi:

1. **`/holidays` — skeleton loading abadiy aylanaveradi** (data kelmasa).
   **ILDIZ SABAB TOPILDI:** `src/app/core/services/http.ts:39-41`dagi
   `axios.create({baseURL: ...})`da `timeout` YO'Q — so'rov osilib
   qolsa, na `next`, na `error` chaqirilmaydi, `loading` abadiy `true`
   qoladi. Bu **BUTUN ILOVAGA tegishli** (barcha servis shu bitta `Http`
   klassi orqali ishlaydi). → **T-014** (timeout qo'shish) + **T-018–T-022**
   (barcha 14 list + 3 detail sahifaga error-state UI qo'shish, chunki
   hozir `error` callback chaqirilsa ham, xato holati "hech narsa
   topilmadi" degan chalg'ituvchi bo'sh-holat bilan bir xil ko'rinadi).

2. **Amallar ustunida hoverda `<hr/>`ga o'xshash chiziq effekti.**
   Kod o'qish orqali SABAB TOPILMADI (vizual reproduksiya kerak,
   men — Claude Code — brauzer DevTools'ga to'g'ridan-to'g'ri kira
   olmayman). `.btn-action`/`.btn-delete` CSS'ida aniq border/hr qoidasi
   yo'q, global reset ham topilmadi. Yagona aloqasiz topilma: `payroll-list.css`da
   ishlatilmayotgan eski `.action-buttons`/`.edit-btn` klasslari qolib
   ketgan (o'lik kod, tozalanishi kerak, lekin bu hoverdagi chiziq bilan
   bog'liqligi ISBOTLANMAGAN). → **T-017** — birinchi navbatda `npm start`
   bilan frontend'ni ochib, kamida 3 ta list sahifada (masalan
   `holiday-list`, `branch-list`, `employee-list`) hover holatini
   DevTools "Force state: hover" + Computed panel orqali tekshirish kerak.

3. **`/employees/<id>` — "dizayn dabdala" (qorong'i temada oq karta,
   o'qib bo'lmaydigan matn).** SABAB TOPILDI: `.detail-card` klassi
   **3 faylning HAMMASIDA** `background: white;` (hardcoded, token emas):
   `payroll-detail.css:20`, `attendance-detail.css:20`,
   `employee-detail.css:23`. Muhimi — **`payroll-detail.css` T-013'ning
   o'zi "kanonik namuna" deb ko'rsatgan fayl edi** — ya'ni namunaning
   o'zida xato bor edi, T-013 uni ko'chirganda xato ham ko'chdi.
   `employee-detail.css`da yana qator 5'da arbitrar
   `font-family: 'Inter', system-ui, sans-serif;` bor (boshqa hech
   qayerda yo'q, olib tashlanishi kerak). → **T-015**.

4. **`/work-schedules/<id>` (tahrirlash formasi) — "dark mode ta'siri
   formada yo'q".** SABAB TOPILDI: `.form-card`da
   `background: var(--card-bg, #ffffff);` — **`--card-bg` degan
   o'zgaruvchi loyihaning HECH QAYERIDA aniqlanmagan**, shuning uchun
   fallback `#ffffff` doim g'olib chiqadi. Faqat **2 faylda** topildi:
   `leave-form.css:13`, `work-schedule-form.css:11` (qolgan 9 ta forma
   sahifasi to'g'ri `var(--color-bg-primary)` ishlatadi — tekshirilgan).
   → **T-016**.

### MUHIM UMUMIY XULOSA (yangi sessiya buni yodda tutsin)

T-012 (forma sahifalari) o'z ish doirasida "8 ta boshqa forma sahifasi
allaqachon kanonik strukturada — TEGILMAYDI" deb yozgan edi (aslida
T-012'ning o'zi emas, undan oldingi taxmin) — bu taxmin **2 ta sahifa
uchun (leave-form, work-schedule-form) NOTO'G'RI chiqdi** (bug #4).
Xuddi shunday, T-013'ning "kanonik namuna" deb ko'rsatgan
`payroll-detail.css`ning o'zida ham xato bor edi (bug #3). **Xulosa:**
"bu sahifa/fayl allaqachon to'g'ri, tekshirish shart emas" degan har
qanday eski taxminga **shubha bilan qarash kerak** — imkon qadar haqiqiy
faylni o'qib tasdiqlang, taxminga tayanmang.

## 4. PostgreSQL orkestratsiya DB'si — o'zgarishsiz, ISHLATILMADI

Oldingi sessiyada yaratilgan `f_95_github_z_front_orcestor_db` (Postgres,
`localhost:5432`, rol `fayzillo95`) shu sessiyada ham **faqat infratuzilma
sifatida qoldi** — sxema yo'q, hech qanday task shu DB orqali kelmadi
(barcha ish yuqoridagi fayl-asosli `orcestor/` tizimi orqali bo'ldi).
Fayzillo shu sessiyada DB parolini bergan edi, lekin **xavfsizlik qoidasi
bo'yicha (parollar task/status/session fayllariga yozilmaydi) bu yerga
YOZILMAYDI** — agar DB monitoring kerak bo'lsa, Fayzillodan qayta so'rang.
Monitoring jarayoni shu sessiya oxirida to'xtatilgan edi (Fayzillo "yangi
task endi qo'shilmaydi, DB kerak emas" dedi).

## 5. Shu sessiyada o'rganilgan ish uslubi qoidalari (xotirada ham bor,
lekin bu yerda ham qayd etiladi)

- **Har bir task uchun alohida commit** — hammasini oxirida birlashtirib
  emas ("commit hamma taskda va davom et" — Fayzilloning aniq so'zi).
- **Har bir yangi bug/feedback → alohida task fayli yoziladi**, kichik
  bo'lsa ham darhol to'g'ridan-to'g'ri tuzatilmaydi ("har yangi bergan
  feedbackim asosida task ochib borasan").
- **Web-qidiruv kerak bo'lsa ham `agy`ga topshiriladi** (Claude'ning
  o'z WebSearch tool'i o'rniga) — token tejash uchun, xuddi mexanik
  CSS ishlarini agy'ga topshirish kabi.
- Mashina resurslari cheklangan (8 core/5.7GB, fan-sensitive) — bir
  vaqtda bir nechta og'ir `agy`/build jarayonini parallel ishlatmang.

## 6. Tezkor boshlash checklist (yangi sessiya uchun)

1. `project_docs/design-reference.md`ni TO'LIQ o'qing — endi bo'lim 3.6
   ham bor (error-state/timeout patterni).
2. `git log --oneline -25` bilan tarixni ko'ring.
3. `ls orcestor/tasks/` — backlog'dagi T-014..T-022'ni ko'ring, har birini
   qisqa o'qing.
4. Backend/frontend holatini bo'lim 1'dagi curl buyruqlari bilan tekshiring.
5. **Fayzilloga xulosa bering va nima bilan boshlashni so'rang** — bo'lim
   0'dagi (fayl boshidagi) ogohlantirishga qarang, o'zingizcha
   boshlamang.
