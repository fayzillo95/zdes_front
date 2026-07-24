# Leaves — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /leaves | — | EmployeeLeave[] | Ta'tillar ro'yxatini olish |
| GET | /leaves/:id | — | EmployeeLeave | Bitta ta'til ma'lumotini olish |
| POST | /leaves | Partial<EmployeeLeave> | EmployeeLeave | Yangi ta'til qo'shish |
| PUT | /leaves/:id | Partial<EmployeeLeave> | EmployeeLeave | Ta'til ma'lumotlarini yangilash |
| DELETE | /leaves/:id | — | void | Ta'tilni o'chirish |

## Tiplar
### EmployeeLeave (src/app/core/models/employee-leave.ts)
```typescript
export interface EmployeeLeave {
  id: number;
  employeeId: number;
  startDate: string;
  endDate: string;
  type: 'vacation' | 'sick' | 'unpaid';
  status: 'pending' | 'approved' | 'rejected';
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/leaves/pages/leave-list/leave-list.ts | leaves | property (EmployeeLeave[]) | [] | loadLeaves() da xizmatdan ma'lumot kelsa yangilanadi |
| src/app/features/leaves/pages/leave-form/leave-form.ts | leaveForm | property (FormGroup) | fb.group(...) | Foydalanuvchi kiritishi yoki tahrirlash rejimida xizmatdan olingan ma'lumotlar (patchValue) orqali yangilanadi |
| src/app/features/leaves/pages/leave-form/leave-form.ts | isEditMode | property (boolean) | false | ngOnInit() da url dagi param tekshiriladi |
| src/app/features/leaves/pages/leave-form/leave-form.ts | leaveId | property (number \| null) | null | ngOnInit() da route.snapshot orqali url dan olinadi |
