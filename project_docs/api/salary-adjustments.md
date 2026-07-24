# Salary Adjustments — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /salary-adjustments | - | SalaryAdjustment[] | Barcha maosh o'zgartirishlarini (bonus/penalty) olish |
| GET | /salary-adjustments/:id | - | SalaryAdjustment | Bitta o'zgartirishni IDsiga ko'ra olish |
| POST | /salary-adjustments | Partial<SalaryAdjustment> | SalaryAdjustment | Yangi maosh o'zgartirishini yaratish |
| PUT | /salary-adjustments/:id | Partial<SalaryAdjustment> | SalaryAdjustment | Mavjud o'zgartirishni yangilash |
| DELETE | /salary-adjustments/:id | - | void | Mavjud o'zgartirishni o'chirish |

## Tiplar
### SalaryAdjustment (core/models/salary-adjustment.ts)
```typescript
export interface SalaryAdjustment {
  id: number;
  employeeId: number;
  amount: number;
  type: 'bonus' | 'penalty';
  reason?: string;
  date: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| adjustment-list.ts | adjustments | property (Array) | [] | service.getAll() natijasi obuna (subscribe) orqali yoziladi |
| adjustment-form.ts | form | property (FormGroup) | bosh holat (null/false/...) | ReactiveForms (fb.group) va service.getById() orqali yangilanadi |
| adjustment-form.ts | id | property (number \| null) | null | route'dagi URL parametr orqali |
| adjustment-form.ts | isEdit | property (boolean) | false | agar id mavjud bo'lsa true ga o'zgaradi |
