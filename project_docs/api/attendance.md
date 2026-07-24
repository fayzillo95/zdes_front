# Attendance — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /attendance | — | Attendance[] | Davomat ro'yxatini olish |
| GET | /attendance/:id | — | Attendance | Bitta davomat yozuvini olish |
| POST | /attendance/check-in | { employeeId: string } | RawAttendanceLog | Kelishni qayd etish |
| POST | /attendance/check-out | { employeeId: string } | RawAttendanceLog | Ketishni qayd etish |

## Tiplar
### Attendance (src/app/core/models/attendance.ts)
```typescript
export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late';
}
```

### RawAttendanceLog (src/app/core/models/raw-attendance-log.ts)
```typescript
export interface RawAttendanceLog {
  id: string;
  employeeId: string;
  timestamp: string;
  type: 'check_in' | 'check_out';
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/attendance/pages/attendance-list/attendance-list.ts | attendances | property (Attendance[]) | [] | ngOnInit() da xizmatdan ma'lumot kelsa yangilanadi |
| src/app/features/attendance/pages/attendance-detail/attendance-detail.ts | attendance | property (Attendance \| null) | null | ngOnInit() da url dan olingan id orqali yangilanadi |
| src/app/features/attendance/pages/scanner/scanner.ts | employees | property (Employee[]) | [] | ngOnInit() da employee xizmatidan yuklanadi |
| src/app/features/attendance/pages/scanner/scanner.ts | selectedEmployeeId | property (string) | '' | Foydalanuvchi tanlaganda yangilanadi (ngModel) |
| src/app/features/attendance/pages/scanner/scanner.ts | message | property (string) | '' | showMessage orqali kelish/ketish amali natijasida o'rnatiladi, 3 soniyadan so'ng tozalanadi |
| src/app/features/attendance/pages/scanner/scanner.ts | isError | property (boolean) | false | showMessage orqali amal natijasi turiga ko'ra o'rnatiladi |
