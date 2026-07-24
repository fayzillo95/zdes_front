# T-017 Response — Dark/Light rejimni amalga oshirish

**Ijrochi:** AGY (`agy --print`, model `gemini-3.1-pro-low`), 3 dispatchda:
(1) `src/styles.css` + shared UI kit (data-table, confirm-dialog,
camera-capture, image-upload), (2) Header'ga theme toggle (localStorage +
`data-theme` atributi), (3) T-013 ustuvorlik ro'yxatidagi eng ko'p rangli
5 ta feature sahifa (login, holiday-form, payroll-detail, company-detail,
scanner). Claude Code har birini `npm run build` bilan tekshirgan.

## O'zgargan fayllar

| Fayl | Turi |
|---|---|
| `src/styles.css` | `:root`/`:root[data-theme="dark"]` CSS o'zgaruvchilari qo'shildi |
| `shared/components/ui/{data-table,confirm-dialog,camera-capture,image-upload}/*.css` | hardcoded ranglar `var(--color-*)`ga o'tkazildi |
| `shared/components/layout/header/{header.ts,header.html,header.css}` | theme toggle (🌙/☀️), localStorage persistence |
| `features/auth/pages/login/login.css`, `holidays/pages/holiday-form/holiday-form.css`, `payroll/pages/payroll-detail/payroll-detail.css`, `company/pages/company-detail/company-detail.css`, `attendance/pages/scanner/scanner.css` | hardcoded ranglar `var(--color-*)`ga o'tkazildi |

## Yakuniy tekshiruv

- Har bir dispatchdan keyin `npm run build` — barchasi xatosiz o'tdi.
- Qolgan feature sahifalar (T-013 ro'yxatidagi "3. Qolgan modullar")
  hozircha o'zgartirilmagan — T-016'dagi "bosqichma-bosqich/boy-scout"
  tavsiyasiga muvofiq, keyingi tegilganda yangilanadi. Bu T-017 DoD'ni
  buzmaydi (DoD "kamida shared/ va eng ko'p ishlatiladigan sahifalar"
  deb belgilagan edi).

T-017 tasdiqlandi va yopildi (2026-07-25). Bosqich 2 (T-013–T-018) to'liq
yakunlandi.
