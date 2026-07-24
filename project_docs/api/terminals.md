# Terminals — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /terminals | — | Terminal[] | Barcha terminallar ro'yxatini olish |
| GET | /terminals/:id | — | Terminal | Bitta terminal ma'lumotini olish |
| POST | /terminals | Partial<Terminal> | Terminal | Yangi terminal yaratish |
| PUT | /terminals/:id | Partial<Terminal> | Terminal | Terminal ma'lumotlarini yangilash |
| DELETE | /terminals/:id | — | void | Terminalni o'chirish |

## Tiplar
### Terminal (src/app/core/models/terminal.ts)
```typescript
export interface Terminal {
  id: number;
  name: string;
  branchId?: number;
  ipAddress?: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/terminals/pages/terminal-list/terminal-list.ts | terminals | property (Terminal[]) | [] | loadTerminals() metodida xizmatdan kelgan ma'lumotlar orqali |
| src/app/features/terminals/pages/terminal-form/terminal-form.ts | terminalForm | property (FormGroup) | fb.group(...) | Foydalanuvchi kiritishi yoki tahrirlashda patchValue() orqali yangilanadi |
| src/app/features/terminals/pages/terminal-form/terminal-form.ts | isEditMode | property (boolean) | false | ngOnInit() da url parametri 'new' dan farqli bo'lsa true bo'ladi |
| src/app/features/terminals/pages/terminal-form/terminal-form.ts | terminalId | property (number \| null) | null | ngOnInit() da url dan parametr olinib o'rnatiladi |
