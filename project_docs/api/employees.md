# Employees — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /employees | — | Employee[] | Xodimlar ro'yxatini olish |
| GET | /employees/:id | — | Employee | Bitta xodim ma'lumotini olish |
| POST | /employees | Partial<Employee> | Employee | Yangi xodim qo'shish |
| PATCH | /employees/:id | Partial<Employee> | Employee | Xodim ma'lumotlarini yangilash |
| DELETE | /employees/:id | — | void | Xodimni o'chirish |
| POST | /employees/:id/face | { photo: string } (dataUrl) | void | Yuz ro'yxatga olish (FaceRegister komponentida chaqiriladi) |

## Tiplar
### Employee (src/app/core/models/employee.ts)
```typescript
export interface Employee {
  id: string;
  fullName: string;
  phone?: string;
  branchId?: string;
  departmentId?: string;
  positionId?: string;
  status: 'active' | 'inactive';
  hiredAt?: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/employees/pages/employee-list/employee-list.ts | employees | property (Employee[]) | [] | loadEmployees() da xizmatdan ma'lumot kelsa yangilanadi |
| src/app/features/employees/pages/employee-detail/employee-detail.ts | employee$ | property (Observable<Employee> \| null) | null | ngOnInit() da url dan olinadigan id asosida yangilanadi |
| src/app/features/employees/pages/employee-form/employee-form.ts | form | property (FormGroup) | fb.group(...) | Foydalanuvchi kiritishi yoki tahrirlash rejimida xizmatdan olingan ma'lumotlar (patchValue) orqali yangilanadi |
| src/app/features/employees/pages/employee-form/employee-form.ts | isEditMode | property (boolean) | false | ngOnInit() da url dagi param tekshiriladi |
| src/app/features/employees/pages/employee-form/employee-form.ts | employeeId | property (string \| null) | null | ngOnInit() da route.snapshot orqali url dan olinadi |
