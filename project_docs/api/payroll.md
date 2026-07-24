# Payroll — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /payroll | - | Payroll[] | Barcha maoshlarni ro'yxatini olish (faqat o'qish, hisoblash backendda qilinadi deb faraz qilingan) |
| GET | /payroll/:id | - | Payroll | Bitta maosh ma'lumotini IDsiga ko'ra olish |

## Tiplar
### Payroll (core/models/payroll.ts)
```typescript
export interface Payroll {
  id: string | number;
  employeeId: string | number;
  period: string;
  baseSalary: number;
  deductions: number;
  totalAmount: number;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| payroll-list.ts | payrolls$ | property (Observable) | service.getAll() natijasi | async pipe orqali avtomatik yangilanadi |
| payroll-detail.ts | payroll$ | property (Observable) | url'dan kelgan id asosida service.getById() natijasi | async pipe orqali avtomatik yangilanadi |
