# Advances — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /advances | — | Advance[] | Avanslar ro'yxatini olish |
| GET | /advances/:id | — | Advance | Bitta avans ma'lumotini olish |
| POST | /advances | Partial<Advance> | Advance | Yangi avans qo'shish |
| PUT | /advances/:id | Partial<Advance> | Advance | Avans ma'lumotlarini yangilash |
| DELETE | /advances/:id | — | void | Avansni o'chirish |

## Tiplar
### Advance (src/app/core/models/advance.ts)
```typescript
export interface Advance {
  id: string | number;
  employeeId: string | number;
  amount: number;
  reason?: string;
  date: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/advances/pages/advance-list/advance-list.ts | advances | property (Advance[]) | [] | loadAdvances() da xizmatdan ma'lumot kelsa yangilanadi |
| src/app/features/advances/pages/advance-form/advance-form.ts | form | property (FormGroup) | fb.group(...) | Foydalanuvchi kiritishi yoki tahrirlash rejimida xizmatdan olingan ma'lumotlar (patchValue) orqali yangilanadi |
| src/app/features/advances/pages/advance-form/advance-form.ts | isEditMode | property (boolean) | false | ngOnInit() da url dagi param tekshiriladi |
| src/app/features/advances/pages/advance-form/advance-form.ts | advanceId | property (string \| null) | null | ngOnInit() da route.snapshot orqali url dan olinadi |
