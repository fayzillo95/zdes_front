# Positions — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /positions | — | Position[] | Lavozimlar ro'yxatini olish |
| GET | /positions/:id | — | Position | Bitta lavozimni ID bo'yicha olish |
| POST | /positions | Partial<Position> | Position | Yangi lavozim yaratish |
| PATCH | /positions/:id | Partial<Position> | Position | Mavjud lavozimni yangilash |
| DELETE | /positions/:id | — | void | Lavozimni o'chirish |

## Tiplar
### Position (core/models/position.ts)
```typescript
export interface Position {
  id: string;
  name: string;
  departmentId?: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| position-list.ts | positions | property (Position[]) | `[]` | `loadPositions()` ichida to'g'ridan-to'g'ri tayinlash |
| position-form.ts | form | property (FormGroup) | {name: '', departmentId: ''} | FormBuilder orqali, tahrirlashda `patchValue` bilan |
| position-form.ts | isEditMode | property (boolean) | `false` | `ngOnInit` ichida route'dan `id` olib tayinlanadi |
| position-form.ts | positionId | property (string \| null) | `null` | `ngOnInit` ichida route'dan olinib tayinlanadi |
