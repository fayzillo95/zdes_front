# T-002 Response

## Bajarilgan ishlar (Summary)
Sidebar va Header komponentlaridagi hardcoded ranglar Tailwind va mavjud CSS o'zgaruvchilari (tokenlari) yordamida Darken dizayn tizimiga moslashtirildi. Maxsus `.active` va `:hover` holatlari tokenlar orqali qayta yozildi.

### O'zgarishlar tafsiloti:
- **Sidebar**: `.nav-link` va uning `.active` / `:hover` holatlariga tokenlar orqali aksent chiziq va fon (highlight) qo'shildi (`border-left`, `background`). `.nav-category` elementi uchun yozuv uslubi kuchaytirilib (kichik font o'lchami, `letter-spacing`), HTMLga o'zgartirish kiritmasdan token-asosida stillandi.
- **Header**: Elementlardagi hardcoded hex-ranglar (jumladan `.user-avatar-circle`, `.logout-btn` va mobile menyu qismi) `--color-primary`, `--color-danger` kabi mavjud tokenlarga o'zgartirildi.

## O'zgargan fayllar jadvali

| Fayl yo'li | O'zgarish turi | Nima qilindi |
|------------|---------------|--------------|
| `src/app/shared/components/layout/sidebar/sidebar.css` | Tahrir (Edit) | Hardcoded ranglar olib tashlanib, `--color-*` tokenlariga o'tkazildi. `.nav-link.active` va `.nav-category` yangilandi. |
| `src/app/shared/components/layout/header/header.css` | Tahrir (Edit) | Kiritilgan hex ranglar (button, avatar) mavjud tokenlarga (`--color-primary`, `--color-danger`) moslandi. |
