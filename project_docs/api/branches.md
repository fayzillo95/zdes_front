# Branches — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /branches | — | Branch[] | Filiallar ro'yxatini olish |
| GET | /branches/:id | — | Branch | Bitta filialni ID bo'yicha olish |
| POST | /branches | Partial<Branch> | Branch | Yangi filial yaratish |
| PUT | /branches/:id | Partial<Branch> | Branch | Mavjud filialni yangilash |
| DELETE | /branches/:id | — | void | Filialni o'chirish |

## Tiplar
### Branch (core/models/branch.ts)
```typescript
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone?: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| branch-list.ts | branches | property (Branch[]) | `[]` | `loadBranches()` ichida to'g'ridan-to'g'ri tayinlash |
| branch-form.ts | form | property (FormGroup) | {name: '', address: '', phone: ''} | FormBuilder orqali, tahrirlashda `patchValue` bilan |
| branch-form.ts | isEditMode | property (boolean) | `false` | `ngOnInit` ichida route'dan `id` olib tayinlanadi |
| branch-form.ts | branchId | property (string \| null) | `null` | `ngOnInit` ichida route'dan olinib tayinlanadi |
