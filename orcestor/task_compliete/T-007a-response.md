# T-007a Task Summary

## Qadamlar:
1. `T-007a.md` va `project_docs/design-reference.md` fayllarini o'rganib chiqdim.
2. Belgilangan 8 ta fayl ichidan `btn-edit`, `btn-delete`, `alert-success`, va `alert-error` klasslaridagi (hamda ularning `:hover` holatlaridagi) hardcoded hex ranglarni (masalan `#3b82f6`, `#e8f5e9` h.k.) jadvalga asosan tokenlarga almashtirdim.
3. Almashtirishda `color-mix(in srgb, var(--color-*)...)` va `var(--color-*)` variantlaridan foydalanildi.
4. `.page-header-card` gradient va `.status-badge` qoidalariga tegilmadi. HTML va TypeScript fayllari, hamda boshqa papkalar butunlay chetlab o'tildi.
5. `npm run build` komandasi orqali dastur xatosiz ishlashi tekshirildi.

## O'zgargan fayllar:
| Fayl yo'li | O'zgargan klasslar |
|---|---|
| `src/app/features/branches/pages/branch-list/branch-list.css` | `.alert-success`, `.alert-error`, `.btn-edit`, `.btn-delete` |
| `src/app/features/branches/pages/branch-form/branch-form.css` | `.alert-error` |
| `src/app/features/company/pages/company-list/company-list.css` | `.alert-success`, `.alert-error`, `.btn-edit`, `.btn-delete` |
| `src/app/features/company/pages/company-form/company-form.css` | `.alert-error` |
| `src/app/features/employees/pages/employee-list/employee-list.css` | `.alert-success`, `.alert-error`, `.btn-edit`, `.btn-delete` |
| `src/app/features/employees/pages/employee-form/employee-form.css` | `.alert-error` |
| `src/app/features/departments/pages/department-list/department-list.css` | `.alert-success`, `.alert-error`, `.edit-btn`, `.delete-btn` |
| `src/app/features/attendance/pages/attendance-list/attendance-list.css` | `.alert-success`, `.alert-error`, `.btn-edit` |
