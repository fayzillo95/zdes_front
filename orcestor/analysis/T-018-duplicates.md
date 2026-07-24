# Dublikat fayllar tahlili (Task: T-018)

Quyidagi naqshlar bo'yicha qidirildi:
- `*.component.ts`, `*.component.html`, `*.component.css`
- `*.service.ts`
- `*-routing.module.ts`

**Natija:** 
Loyiha (`src/app/` va umuman butun loyiha) bo'ylab qidiruv natijasida hech qanday dublikat, `*.component.*` yoki `*.service.*` suffiksli fayllar topilmadi. Avvalgi tasklar natijasida yaratilib o'chirilmay qolib ketgan deb hisoblangan fayllar (masalan `confirm-dialog.component.*` yoki `image-upload.component.*`) tizimda umuman yo'q (ehtimol oldingi commit'larda boshqa yo'llar bilan tozalangan yoki saqlanmagan).

| Fayl nomi | Holati | Sababi |
|-----------|--------|--------|
| -         | -      | Hech qanday shubhali fayl topilmadi |
