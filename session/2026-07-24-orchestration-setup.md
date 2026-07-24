# Session — Orchestration tizimini qurish

**Sana**: 2026-07-24
**Ishtirokchilar**: Fayzillo (intern dasturchi, `zdes-frontend` loyihasi egasi) va Claude Code

---

## Kontekst

Fayzillo Gemini API bilan test loyihasi (`~/Desktop/gemini-test`) ustida ishlar ekan, Google'ning yangi "AQ." auth-key formatidagi bug'iga duch keldi (401 `ACCESS_TOKEN_TYPE_UNSUPPORTED` — Google tomonidan tan olingan, hali tuzatilmagan muammo). Shu jarayonda Claude + Gemini orchestration arxitekturasi muhokama qilindi:

- **Claude Code** — orchestrator (asosiy nazorat, rejalashtirish, integratsiya)
- **AGY / Antigravity (Gemini asosida)** — sub-agent (bajaruvchi, Agent Manager orqali parallel ishlaydi)
- **Fayzillo** — supervisor (topshiriqlarni Antigravity'ga o'tkazadi, natijalarni qaytaradi)

To'g'ridan-to'g'ri API integratsiyasi (Claude Code Gemini'ni tool sifatida chaqirishi) Antigravity'ning yopiq UI-based tizimi tufayli imkonsiz ekani aniqlandi — shuning uchun fayl-asosli (file-based) qo'lda boshqariladigan workflow tanlandi.

## Foydalanuvchining aniq buyrug'i (verbatim)

> "Men orkestrationga qiziqayabman yani claude cli sen orkestratir gemini sub agent" ... "ha, to'ldirib chiq bularni men yaratdim requerements ichida qoidalar rollar yoziladi python scripti bilan agyga tasklarni berasan asosiy nazorat senda bo'ladi arxitekturani overwiev qilib uni ham saqlab qo'y hostory ichida muhokamalarimiz va kelishivlarni saqla oldingi fayillar endi kerak emas rm qilasan ishni boshla md larni yozishni sub agentlarga buyur tokenni teja https://github.com/msitarzewski/agency-agents bundan kerakli tolls skills larni loyiha ichida agents skills ichiga saqlab ol ROOT.MD da referencelarni yozib promt joylaysan . odin bu buyrig'imni hujjatlashtir session/ . hullas zanjir sessio -> history -> ROOT.MD -> orcestor -> steps"
>
> Keyinroq aniqlashtirish: "faqat mdlarni qurib olasan holos" — hozircha faqat `.md` fayllar quriladi; Python skript va `agency-agents` repodan skill tortish keyingi bosqichga qoldirildi.

## Kelishilgan zanjir (pipeline)

```
session/ → history/ → ROOT.MD → orcestor/ → steps/
```

## Shu sessiyada bajarilgan qarorlar

1. `history/agy.md` va `history/task_agy.md` — eskirgan, o'chirildi (`rm`)
2. `session/` papkasi yaratildi — har bir muhim muhokama/kelishuv shu yerda saqlanadi
3. `orcestor/` skeleti (foydalanuvchi tomonidan oldindan yaratilgan: `requirements.MD`, `README.MD`, `prompt.md`, `tasks/`, `task_pending/`, `task_compliete/`, `status/`, `history/`) — mazmun bilan to'ldiriladi
4. `ROOT.MD` — loyiha ildizida, referencelar va asosiy prompt joylashtiriladi
5. `agency-agents` (github.com/msitarzewski/agency-agents) repodan kerakli skill/tool fayllarni tanlab olish — **keyingi bosqichga qoldirildi**
6. Python dispatch skripti — **keyingi bosqichga qoldirildi**

## Keyingi qadam (bu sessiyadan keyin)

`.md` fayllar to'liq tayyor bo'lgach: `agency-agents` repodan Angular/frontend va antigravity/gemini-cli integratsiyasiga oid skill fayllarni `agents/skills/` ichiga olib kelish, so'ng `orcestor/dispatch.py` skriptini yozish.
