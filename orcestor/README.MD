# orcestor/ — Orkestratsiya tizimi arxitekturasi

## 1. Maqsad

`zdes-frontend` (Angular) loyihasi ustida ishlash uchun Claude Code (orkestrator) va Google Antigravity IDE ichidagi Gemini agentlari (AGY, ijrochi) o'rtasida **to'g'ridan-to'g'ri API bog'lanish yo'q** — Antigravity yopiq UI bo'lib, tashqaridan chaqirib bo'lmaydi. Shu sababli `orcestor/` fayl-asosli (file-based) task-queue tizimi sifatida yaratilgan: Claude Code vazifani faylga yozadi, inson-supervisor (Fayzillo) uni Antigravity'ga qo'lda ko'chiradi, AGY bajaradi va natija yana faylga qaytadi, Claude Code uni tekshirib kodga integratsiya qiladi. Ya'ni bu papka — ikki AI agent o'rtasidagi "ko'prik" bo'lib, inson orqali sinxronlashadigan asinxron ish oqimini boshqaradi.

## 2. Umumiy zanjir: session → history → ROOT.MD → orcestor → steps

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  session/   │ ──▶ │  history/   │ ──▶ │  ROOT.MD    │ ──▶ │  orcestor/  │ ──▶ │   steps/    │
│ (jonli ishchi│     │ (qisqartirilgan│  │ (loyiha bosh│     │ (operatsion │     │ (tartiblangan│
│  sessiya logi)│    │  sessiya tarixi)│ │  sahifasi / │     │  orkestratsiya│   │  ish qadamlari)│
│             │     │             │     │  tarkib jadvali)│  │  tizimi)    │     │             │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
```

- `session/` — har bir ishchi sessiya davomida yozilgan xom log.
- `history/` (loyiha ildizida) — sessiyalardan distillangan, qisqartirilgan tarix.
- `ROOT.MD` — loyiha ildizidagi kirish nuqtasi, barcha bo'limlarga (jumladan `orcestor/`ga) havola beruvchi "mundarija".
- `orcestor/` — shu hujjat tasvirlayotgan operatsion tizim.
- `orcestor/steps/` — orkestratsiya qanday bosqichma-bosqich bajarilishini belgilovchi tartiblangan qadamlar.

## 3. Task lifecycle (vazifa hayot aylanasi)

```
tasks/  →  task_pending/  →  [AGY, Antigravity'da ishlaydi]  →  task_compliete/  →  status/  →  orcestor/history/
```

| Bosqich | Papka/joy | Nima bo'ladi |
|---|---|---|
| 1. Backlog | `tasks/` | Barcha rejalashtirilgan vazifalar shu yerda ta'riflanadi. |
| 2. Dispatch | `task_pending/` | Claude Code vazifani AGY uchun tayyorlab shu yerga qo'yadi; Fayzillo uni Antigravity'ga qo'lda ko'chiradi. |
| 3. Ijro | *(Antigravity IDE ichida, tashqarida)* | AGY (Gemini) vazifani Agent Manager UI'da bajaradi (parallel — max 5 agent). |
| 4. Yakunlash | `task_compliete/` | AGY tugatgan vazifalar natijasi shu yerga qaytariladi (nom qasddan shunday yozilgan — o'zgartirilmaydi). |
| 5. Baholash | `status/` | Har bir vazifa bo'yicha status/log yozuvi (qabul qilindi / rad etildi / qayta ishlash kerak). |
| 6. Arxivlash | `orcestor/history/` | Yakunlangan sikl orkestratsiyaga xos tarixga yoziladi (loyiha ildizidagi `history/`dan alohida). |

## 4. Papkalar tavsifi

- **`README.MD`** — ushbu fayl; tizimning arxitektura ko'rinishi.
- **`requirements.MD`** — qoidalar va rollar (Claude Code / AGY / Fayzillo majburiyatlari).
- **`prompt.md`** — AGY uchun vazifa yuborishda ishlatiladigan prompt shabloni.
- **`steps/`** — tartiblangan ish oqimi qadamlari hujjatlari.
- **`tasks/`** — barcha aniqlangan vazifalar backlog'i.
- **`task_pending/`** — AGY'ga yuborilgan, javob kutilayotgan vazifalar.
- **`task_compliete/`** — AGY tugatgan vazifalar (nomi qasddan shu imloda).
- **`status/`** — har bir vazifa bo'yicha status/log yozuvlari.
- **`history/`** — orkestratsiyaga xos ijro tarixi (loyiha ildizidagi `history/`dan farqli).

## 5. Boshidan oxirigacha qanday ishlaydi

1. Claude Code loyiha ehtiyojidan kelib chiqib yangi vazifani aniqlaydi va `tasks/` ichiga yozadi.
2. Vazifa ijro uchun tayyor bo'lganda, Claude Code `prompt.md` shablonidan foydalanib uni `task_pending/` papkasiga ko'chiradi/yaratadi.
3. Fayzillo `task_pending/` dagi vazifani qo'lda o'qiydi va Antigravity IDE'dagi AGY agentiga (Agent Manager UI orqali) kiritadi.
4. AGY (Gemini) Angular kod bazasida ishni bajaradi — kerak bo'lsa bir nechta agent parallel ishlaydi (maks. 5 ta).
5. Ish tugagach, Fayzillo natijani `task_compliete/` papkasiga qaytaradi (fayl/diff/hisobot ko'rinishida).
6. Claude Code `task_compliete/` dagi natijani ko'rib chiqadi, texnik yakuniy qaror qabul qiluvchi sifatida tasdiqlaydi yoki qaytaradi, va xulosani `status/` ga yozadi.
7. Tasdiqlangan natija haqiqiy kod bazasiga integratsiya qilinadi, sikl `orcestor/history/` ga arxivlanadi, va `ROOT.MD` / loyiha ildizidagi `history/` orqali umumiy loyiha tarixiga bog'lanadi.

## 6. Havolalar

- [../ROOT.MD](../ROOT.MD) — loyiha kirish nuqtasi / mundarija
- [./requirements.MD](./requirements.MD) — qoidalar va rollar
- [./prompt.md](./prompt.md) — AGY task-dispatch prompt shabloni
- [./steps/](./steps/) — tartiblangan ish oqimi qadamlari
