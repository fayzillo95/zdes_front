## Task T-001 Bajarildi

**Xulosa:**
`src/styles.css` faylidagi `@theme` blokiga 8 ta yangi dizayn tokenlari (`--color-chart-*` va `--color-status-*`) kiritildi. Shuningdek, `project_docs/design-reference.md` talablariga asosan dark tema (`:root[data-theme="dark"]`) dagi `--color-bg-primary` va `--color-bg-secondary` qiymatlari moslashtirildi, va `body` background xususiyatiga yangi `--bg-gradient` gradient qo'shildi. Light tema tokenlari saqlanib qoldi va buzilmadi. 

**O'zgargan fayllar:**
| Fayl yo'li | O'zgarish mohiyati |
|---|---|
| `src/styles.css` | `@theme` blokiga chart va status uchun 8 ta yangi token qo'shildi; dark tema uchun `bg-primary`, `bg-secondary` o'zgartirildi va gradient asosiy fonga (`body`) ulandi. |
