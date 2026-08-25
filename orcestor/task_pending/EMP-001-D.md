## Task ID: EMP-001-D
### Sarlavha: {{TASK_TITLE}}

**Maqsad (Goal):**
{{GOAL}}
<!-- Bitta aniq, o'lchanadigan gap. "Nima qilinishi kerak" — tugagan holat. -->

**Kontekst (Context):**
{{CONTEXT}}
<!-- Angular kodbazasining qaysi qismi bilan bog'liq: modul, komponent,
     servis. Butun faylni joylashtirmang — faqat yo'llarni (path) bering. -->

**Cheklovlar (Constraints):**
{{CONSTRAINTS}}
<!-- Masalan: X faylga tegmang; mavjud kod uslubiga (style) rioya qiling;
     yangi dependency qo'shishdan oldin so'rang; mavjud testlarni buzmang. -->

**Ish doirasidagi fayllar (Files in scope):**
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/pages/employees-page/employees-page.component.ts
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/pages/employees-page/employees-page.component.html
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/pages/employees-page/employees-page.component.scss
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/components/branch-card/branch-card.component.ts
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/components/branch-card/branch-card.component.html
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/components/branch-card/branch-card.component.scss
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/components/department-card/department-card.component.ts
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/components/department-card/department-card.component.html
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/components/department-card/department-card.component.scss
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/shared/styles/glassmorphism.css
/home/fayzillo/Desktop/Loyihalar/zdes/front_examples/zdes-frontend/src/app/features/employees/pages/employees-page/employees-page.component.spec.ts

**Bajarilgan deb hisoblanish mezoni (Definition of Done):**
1. `employees-page` HTML‑da har bir xodim `<app-branch-card>` yoki `<app-department-card>` ichiga joylashtirildi, card‑layout qo‘llanildi.
2. Card komponentlari **glassmorphism** fon, gradient, hover‑animatsiya bilan stilizatsiya qilindi (SCSS).
3. `employees-page` komponenti **standalone** bo‘lsa, `BranchCardComponent` va `DepartmentCardComponent` `imports` ga qo‘shildi.
4. **Unit‑test** fayllarida (`employees-page.component.spec.ts`) card render, ARIA‑label va hover‑animation mavjudligi tekshirildi – `npm test` → 0 xato.
5. **Accessibility**: `role="listitem"`, `aria‑label="Employee card"`, focus trap va klaviatura navigatsiyasi qo‘shildi.
6. **Lint**: `npm run lint` → pass.
7. `EMP-001-D-response.md` faylida “O‘zgargan fayllar” jadvali (fayl, turi, qisqa sabab) va yakuniy xulosa (DoD bajarildi) mavjud.

**Tavsiya etilgan Antigravity rejimi (Mode):**
Agent-driven

**Natijani qayerga yozish kerak (Report back):**
- Ishlash davomida **har bir muhim qadamni** darhol
  `orcestor/task_pending/EMP-001-D-response.md` fayliga yozib boring
  (fayl mavjud bo'lmasa, yarating). Bu — jonli jurnal (log): nima qilinyapti,
  qaysi fayllar yaratildi/o'zgartirildi, qanday qarorlar qabul qilindi,
  qanday muammolarga duch kelindi. Claude Code shu faylni kuzatib borib,
  ishning borishini nazorat qiladi — shuning uchun bo'sh yoki umumiy
  jumlalar emas, aniq va tekshiriladigan yozuvlar kerak (masalan: "T14:32 —
  `src/app/shared/components/loading-spinner/loading-spinner.component.ts`
  yaratildi").
- Topshiriq to'liq bajarilgach:
  1. `EMP-001-D-response.md` oxiriga yakuniy xulosa qo'shing (nima
     o'zgardi, qaysi fayllar tegdi, Definition of Done mezonlari
     tekshirilganmi).
  2. Xulosadan keyin, aynan shu formatda **"O'zgargan fayllar" jadvali**ni
     qo'shing — bu Claude Code'ga review paytida faylni to'liq o'qimasdan,
     faqat kerakli faylga nuqtali `git diff` qilish imkonini beradi:

     ### O'zgargan fayllar
     | Fayl | Turi | Qisqa sabab |
     |---|---|---|
     | src/app/shared/components/ui/data-table/data-table.ts | yangi | Generic DataTable komponenti yozildi |
     | src/app/core/services/http.ts | o'zgartirilgan | Xato holatini handle qilish qo'shildi |

     Turi ustuni faqat: `yangi` / `o'zgartirilgan` / `o'chirilgan`. Har bir
     qatordagi "Qisqa sabab" bitta qisqa jumla bo'lsin — bu jadval to'liq
     bo'lmasa yoki umumiy ("kod yozildi" kabi) bo'lsa, review qiyinlashadi
     va butun faylni qayta o'qishga to'g'ri keladi — bu esa aynan shu
     jadval oldini olishi kerak bo'lgan narsa.
  3. `orcestor/task_pending/EMP-001-D.md` va
     `orcestor/task_pending/EMP-001-D-response.md` ikkalasini ham
     `orcestor/task_compliete/` papkasiga ko'chiring (move qiling).