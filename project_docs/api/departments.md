# Departments — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /departments | — | Department[] | Bo'limlar ro'yxatini olish |
| GET | /departments/:id | — | Department | Bitta bo'limni ID bo'yicha olish |
| POST | /departments | Partial<Department> | Department | Yangi bo'lim yaratish |
| PATCH | /departments/:id | Partial<Department> | Department | Mavjud bo'limni yangilash |
| DELETE | /departments/:id | — | void | Bo'limni o'chirish |

## Tiplar
### Department (core/models/department.ts)
```typescript
export interface Department {
  id: string;
  name: string;
  branchId?: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| department-list.ts | departments | property (Department[]) | `[]` | `loadDepartments()` ichida to'g'ridan-to'g'ri tayinlash |
| department-form.ts | form | property (FormGroup) | {name: '', branchId: ''} | FormBuilder orqali, tahrirlashda `patchValue` bilan |
| department-form.ts | isEditMode | property (boolean) | `false` | `ngOnInit` ichida route'dan `id` olib tayinlanadi |
| department-form.ts | departmentId | property (string \| null) | `null` | `ngOnInit` ichida route'dan olinib tayinlanadi |
