# DataTable API Tahlili (T-005)

## Taklif qilinayotgan API:
*   `@Input() columns: { key: string, label: string, sortable?: boolean }[]` - Ustunlar konfiguratsiyasi
*   `@Input() data: T[]` - Jadval ma'lumotlari (Generic T tipida)
*   `@Input() loading: boolean = false` - Yuklanish holati
*   `@Input() pageSize: number = 10` - Sahifa sig'imi
*   `@Input() emptyMessage: string = 'Ma\'lumot topilmadi'` - Bo'sh holat matni
*   `@Output() rowClick = new EventEmitter<T>()` - Qator bosilganda
*   `@Output() sortChange = new EventEmitter<{key: string, direction: 'asc' | 'desc'}>()` - Saralash o'zgarganda

## Moslashuvchanligi:
*   **Employees ro'yxati:** `columns` orqali rasmi, ismi, lavozimi kabi ustunlar beriladi. Harakatlar ustunini render qilish qiyinroq bo'lishi mumkin, shuning uchun odatda `ng-template` yoki `ContentChild` ishlatiladi, lekin ushbu oddiy versiyada `rowClick` orqali umumiy harakatni boshqarish mumkin.
*   **Attendance ro'yxati:** Sana filtrlari jadvaldan tashqarida bo'ladi va yangilangan `data` jadvalga uzatiladi. Jadval faqat taqdimot uchun xizmat qiladi. Client-side sort va pagination juda qo'l keladi.
