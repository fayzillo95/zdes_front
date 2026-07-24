# Holidays — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /holidays | — | Holiday[] | Bayramlar ro'yxatini olish |
| GET | /holidays/:id | — | Holiday | Bitta bayram ma'lumotini olish |
| POST | /holidays | Holiday | Holiday | Yangi bayram qo'shish |
| PUT | /holidays/:id | Holiday | Holiday | Bayram ma'lumotlarini yangilash |
| DELETE | /holidays/:id | — | void | Bayramni o'chirish |

## Tiplar
### Holiday (src/app/core/models/holiday.ts)
```typescript
export interface Holiday {
  id?: string | number;
  name: string;
  date: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/holidays/pages/holiday-list/holiday-list.ts | holidays | property (Holiday[]) | [] | loadHolidays() da xizmatdan ma'lumot kelsa yangilanadi |
| src/app/features/holidays/pages/holiday-form/holiday-form.ts | holidayForm | property (FormGroup) | fb.group(...) | Foydalanuvchi kiritishi yoki tahrirlash rejimida xizmatdan olingan ma'lumotlar (patchValue) orqali yangilanadi |
| src/app/features/holidays/pages/holiday-form/holiday-form.ts | isEditMode | property (boolean) | false | ngOnInit() da url dagi param tekshiriladi |
| src/app/features/holidays/pages/holiday-form/holiday-form.ts | holidayId | property (string \| null) | null | ngOnInit() da route.snapshot orqali url dan olinadi |
| src/app/features/holidays/pages/holiday-form/holiday-form.ts | isLoading | property (boolean) | false | loadHoliday() boshlanishida true, ma'lumot kelganda yoki xatolik yuz berganda false bo'ladi |
