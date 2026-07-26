# User Moduli Backend Tahlili

### Endpoint: POST /api/v1/users
**Controller:** src/modules/user/user.controller.ts:`create`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/users`
- Controller class + method nomi: `UserController` `create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
login: 'john.doe'
password: 'StrongPass123'
role: 'employee'
companyId: 'uuid-company-id'
branchId: 'uuid-branch-id'
departmentId: 'uuid-department-id'
positionId: 'uuid-position-id'
managerId: 'uuid-manager-id'
workScheduleId: 'uuid-work-schedule-id'
employeeNo: 'EMP-001'
firstName: 'John'
lastName: 'Doe'
middleName: 'Michael'
phone: '+998901234567'
email: 'john@example.com'
address: 'Tashkent, Yunusobod'
passportSerial: 'AA1234567'
dateOfBirth: '1990-05-15'
avatarUrl: 'https://cdn.example.com/avatars/john.png'
baseSalary: 5000000

**3. Guard:**
- `@Roles('superadmin', 'admin')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `CreateUserDto` (`src/modules/user/dto/create-user.dto.ts`)
- `login`: string, `@IsString()`, `@MinLength(3)`, `@MaxLength(255)`
- `password`: string, `@IsString()`, `@MinLength(6)`, `@MaxLength(255)`
- `role`: UserRole, `@IsOptional()`, `@IsEnum(UserRole)`
- `companyId`: string, `@IsOptional()`, `@IsUUID()`
- `branchId`: string, `@IsOptional()`, `@IsUUID()`
- `departmentId`: string, `@IsOptional()`, `@IsUUID()`
- `positionId`: string, `@IsOptional()`, `@IsUUID()`
- `managerId`: string, `@IsOptional()`, `@IsUUID()`
- `workScheduleId`: string, `@IsOptional()`, `@IsUUID()`
- `employeeNo`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(100)`
- `firstName`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(255)`
- `lastName`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(255)`
- `middleName`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(255)`
- `phone`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(50)`
- `email`: string, `@IsOptional()`, `@IsEmail()`, `@MaxLength(255)`
- `address`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
- `passportSerial`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(100)`
- `dateOfBirth`: string, `@IsOptional()`, `@IsISO8601({ strict: true })`
- `avatarUrl`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
- `baseSalary`: number, `@IsOptional()`, `@IsNumber({ maxDecimalPlaces: 2 })`, `@Min(0)`

**5. Service:**
- `UserService.create` (`src/modules/user/user.service.ts`)
- Yangi foydalanuvchini yaratadi. Parolni hashlash, unikal maydonlarni va bog'lanishlarni tekshirish kabi ishlarni bajarib, User modeliga yozadi.

**6. Response:**
Foydalanuvchi obyekti qaytariladi:
- `id`: string
- `login`: string
- `role`: enum
- `companyId`: string
- `branchId`: string
- `departmentId`: string
- `positionId`: string
- `managerId`: string
- `workScheduleId`: string
- `employeeNo`: string
- `firstName`: string
- `lastName`: string
- `middleName`: string
- `phone`: string
- `email`: string
- `address`: string
- `passportSerial`: string
- `dateOfBirth`: date
- `avatarUrl`: string
- `faceDeviceUserId`: string
- `faceImageUrl`: string
- `baseSalary`: decimal
- `isActive`: boolean
- `isBlocked`: boolean
- `createdAt`: date
- `updatedAt`: date

**7. Error case:**
- `ForbiddenException` (superadmin yaratilayotganda)
- `ConflictException` (login req bo'lganda, login yoki email bazada bo'lganda)
- `NotFoundException` (company, branch, department, position, manager, work schedule topilmaganda)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: GET /api/v1/users
**Controller:** src/modules/user/user.controller.ts:`findAll`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/users`
- Controller class + method nomi: `UserController` `findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

Query parametrlar:
companyId: misol yo'q
branchId: misol yo'q
departmentId: misol yo'q
positionId: misol yo'q
role: misol yo'q
isActive: true
isBlocked: false
search: 'john'
page: 1
limit: 10

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `UserQueryDto` (`src/modules/user/dto/user-query.dto.ts`)
- `companyId`: string, `@IsOptional()`, `@IsUUID()`
- `branchId`: string, `@IsOptional()`, `@IsUUID()`
- `departmentId`: string, `@IsOptional()`, `@IsUUID()`
- `positionId`: string, `@IsOptional()`, `@IsUUID()`
- `role`: UserRole, `@IsOptional()`, `@IsEnum(UserRole)`
- `isActive`: boolean, `@IsOptional()`, `@IsBoolean()`
- `isBlocked`: boolean, `@IsOptional()`, `@IsBoolean()`
- `search`: string, `@IsOptional()`, `@IsString()`
- `page`: number, `@IsOptional()`, `@IsInt()`, `@Min(1)`
- `limit`: number, `@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- `UserService.findAll` (`src/modules/user/user.service.ts`)
- Query parametrlariga ko'ra foydalanuvchilar (User) ro'yxatini filtrlash, qidirish va paginatsiya bilan o'qiydi. Shuningdek har bir rol bo'yicha statistika qaytaradi.

**6. Response:**
Paginatsiya qilingan javob obyekti:
- `items`: Foydalanuvchilar massivi (har birida id, login, role, companyId va hk `USER_SELECT` bo'yicha)
- `total`: number
- `page`: number
- `limit`: number
- `totalPages`: number
- `stats`: Object (har bir rol bo'yicha sanoq)

**7. Error case:**
Odatda tashlanmaydi, auth va ruxsat xatolari bo'lishi mumkin (`ForbiddenException`, `UnauthorizedException`).


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: GET /api/v1/users/:id
**Controller:** src/modules/user/user.controller.ts:`findOne`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/users/:id`
- Controller class + method nomi: `UserController` `findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `ID (param)` (`yo'q`)
Request DTO class yo'q, faqat `@Param('id', ParseUUIDPipe) id: string` qabul qiladi.

**5. Service:**
- `UserService.findOne` (`src/modules/user/user.service.ts`)
- Berilgan ID orqali bitta User'ni o'qiydi, so'rov yuborgan actorning (superadmin/admin/manager) ko'rish doirasiga kirishini tekshiradi.

**6. Response:**
Bitta foydalanuvchi obyekti (`USER_SELECT` dagi maydonlar bilan: `id`, `login`, `role`, `companyId` va h.k.)

**7. Error case:**
- `NotFoundException` (User topilmasa)
- `ForbiddenException` (Foydalanuvchi actorning ko'rish doirasidan tashqarida bo'lsa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/users/me
**Controller:** src/modules/user/user.controller.ts:`updateOwnProfile`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/users/me`
- Controller class + method nomi: `UserController` `updateOwnProfile`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
firstName: 'John'
lastName: 'Doe'
middleName: 'Michael'
phone: '+998901234567'
email: 'john@example.com'
address: 'Tashkent, Yunusobod'
passportSerial: 'AA1234567'
dateOfBirth: '1990-05-15'
avatarUrl: 'https://cdn.example.com/avatars/john.png'

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `UpdateOwnProfileDto` (`src/modules/user/dto/update-own-profile.dto.ts`)
- Barcha maydonlar `CreateUserDto` dan olingan ixtiyoriy (optional) maydonlar:
- `firstName`: string
- `lastName`: string
- `middleName`: string
- `phone`: string
- `email`: string
- `address`: string
- `passportSerial`: string
- `dateOfBirth`: string
- `avatarUrl`: string

**5. Service:**
- `UserService.updateOwnProfile` (`src/modules/user/user.service.ts`)
- Joriy foydalanuvchining o'z profil ma'lumotlarini (User modeli) yangilaydi. Email kiritilsa band emasligini tekshiradi.

**6. Response:**
Yangilangan bitta foydalanuvchi obyekti (`USER_SELECT` bo'yicha)

**7. Error case:**
- `NotFoundException` (Joriy foydalanuvchi bazadan topilmasa)
- `ConflictException` (Email allaqachon band bo'lsa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/users/:id
**Controller:** src/modules/user/user.controller.ts:`update`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/users/:id`
- Controller class + method nomi: `UserController` `update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Barcha maydonlar `CreateUserDto` ga o'xshaydi (`password` dan tashqari), hech biriga specific example qayta yozilmagan. 
Misollar `CreateUserDto` dagi misollar bilan bir xil, barchasi optional.

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `UpdateUserDto` (`src/modules/user/dto/update-user.dto.ts`)
`CreateUserDto` dan `password` maydonini olib tashlab, qolgan barcha maydonlarni `PartialType` qilingan versiyasi. Barcha maydonlar ixtiyoriy (optional).

**5. Service:**
- `UserService.update` (`src/modules/user/user.service.ts`)
- Berilgan ID dagi User obyektini yangilaydi. Administrator/manager huquqlari va ko'rish doirasini tekshiradi, noyob maydonlar band emasligini tekshiradi, va yozadi.

**6. Response:**
Yangilangan bitta foydalanuvchi obyekti (`USER_SELECT` bo'yicha)

**7. Error case:**
- `NotFoundException` (User topilmasa yoki relation modellar topilmasa)
- `ForbiddenException` (Huquq yetarli bo'lmasa yoki boshqa kompaniya ma'lumoti o'zgartirilayotgan bo'lsa)
- `ConflictException` (Login, email yoki employeeNo band bo'lsa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/users/:id/toggle-status
**Controller:** src/modules/user/user.controller.ts:`toggleStatus`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/users/:id/toggle-status`
- Controller class + method nomi: `UserController` `toggleStatus`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
isActive: false

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `ToggleUserStatusDto` (`src/modules/user/dto/toggle-user-status.dto.ts`)
- `isActive`: boolean, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- `UserService.toggleStatus` (`src/modules/user/user.service.ts`)
- Foydalanuvchining aktivlik holatini (`isActive`) teskarisiga yoki berilgan qiymatga o'zgartiradi.

**6. Response:**
Yangilangan bitta foydalanuvchi obyekti (`USER_SELECT` bo'yicha)

**7. Error case:**
- `NotFoundException` (User topilmasa)
- `ForbiddenException` (Actorning ruxsati bo'lmasa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/users/:id/toggle-blocked
**Controller:** src/modules/user/user.controller.ts:`toggleBlocked`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/users/:id/toggle-blocked`
- Controller class + method nomi: `UserController` `toggleBlocked`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
isBlocked: true

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `ToggleUserBlockedDto` (`src/modules/user/dto/toggle-user-blocked.dto.ts`)
- `isBlocked`: boolean, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- `UserService.toggleBlocked` (`src/modules/user/user.service.ts`)
- Foydalanuvchini bloklangan yoki blokdan chiqarilgan holatga (`isBlocked`) o'tkazadi.

**6. Response:**
Yangilangan bitta foydalanuvchi obyekti (`USER_SELECT` bo'yicha)

**7. Error case:**
- `NotFoundException` (User topilmasa)
- `ForbiddenException` (Actorning ruxsati bo'lmasa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/users/:id/change-password
**Controller:** src/modules/user/user.controller.ts:`changePassword`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/users/:id/change-password`
- Controller class + method nomi: `UserController` `changePassword`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
newPassword: 'NewStrongPass123'

**3. Guard:**
- `@Roles('superadmin', 'admin')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `ChangePasswordDto` (`src/modules/user/dto/change-password.dto.ts`)
- `newPassword`: string, `@IsString()`, `@MinLength(6)`, `@MaxLength(255)`

**5. Service:**
- `UserService.changePassword` (`src/modules/user/user.service.ts`)
- Foydalanuvchining parolini yangilaydi (heshlaydi va saqlaydi).

**6. Response:**
Yangilangan bitta foydalanuvchi obyekti (`USER_SELECT` bo'yicha)

**7. Error case:**
- `NotFoundException` (User topilmasa)
- `ForbiddenException` (Actorning ruxsati bo'lmasa yoki admin superadmin parolini o'zgartirmoqchi bo'lsa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

### Endpoint: DELETE /api/v1/users/:id
**Controller:** src/modules/user/user.controller.ts:`delete`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/users/:id`
- Controller class + method nomi: `UserController` `delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin')`
- Yopiq endpoint (Bearer auth kutiladi)

**4. DTO:**
- Request DTO: `ID (param)` (`yo'q`)
Request DTO class yo'q, faqat `@Param('id', ParseUUIDPipe) id: string` qabul qiladi.

**5. Service:**
- `UserService.delete` (`src/modules/user/user.service.ts`)
- Berilgan ID ga ega User yozuvini bazadan butunlay o'chirib tashlaydi.

**6. Response:**
O'chirish holati: `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException` (User topilmasa)
- `ForbiddenException` (Actorning ruxsati bo'lmasa, yoxud admin superadminni o'chirmoqchi bo'lsa)


**8. DB struktura:**
- Tegishli Prisma model: `User`
- Maydonlar ta'rifi (barchasi, `schema.prisma` bo'yicha):
  - `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
  - `login`: String, majburiy, `@unique @db.VarChar(255)`
  - `passwordHash`: String, majburiy, `@db.VarChar(255)`
  - `role`: UserRole (enum), majburiy, `@default(employee)`
  - `companyId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `branchId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `departmentId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `positionId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `managerId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `workScheduleId`: String, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeNo`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `firstName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `lastName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `middleName`: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - `phone`: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - `email`: String, ixtiyoriy (`?`), `@unique @db.VarChar(255)`
  - `address`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `passportSerial`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `dateOfBirth`: DateTime, ixtiyoriy (`?`), `@db.Date`
  - `avatarUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `faceDeviceUserId`: String, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `faceDescriptor`: String, ixtiyoriy (`?`)
  - `faceImageUrl`: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - `baseSalary`: Decimal, ixtiyoriy (`?`), `@db.Decimal(15, 2)`
  - `isActive`: Boolean, majburiy, `@default(true)`
  - `isBlocked`: Boolean, majburiy, `@default(false)`
  - `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
  - `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`
- Chiquvchi relations (outgoing):
  - `User.companyId -> Company.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
  - `User.positionId -> Position.id (onDelete: SetNull)`
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Kiruvchi relations (incoming):
  - `Attendance.employeeId -> User.id (onDelete: Cascade)`
  - `RawAttendanceLog.employeeId -> User.id (onDelete: SetNull)`
  - `SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
  - `EmployeeLeave.employeeId -> User.id (onDelete: Cascade)`
  - `Payroll.employeeId -> User.id (onDelete: Cascade)`
  - `Notification.userId -> User.id (onDelete: Cascade)`
  - `PushToken.userId -> User.id (onDelete: Cascade)`
  - `RefreshToken.userId -> User.id (onDelete: Cascade)`
  - `User.managerId -> User.id (onDelete: SetNull)`
- Model index/unique:
  - `@@unique([companyId, employeeNo])`
  - `@@unique([companyId, faceDeviceUserId])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([departmentId])`
  - `@@index([positionId])`
  - `@@index([managerId])`
  - `@@index([role])`
  - `@@index([isActive])`

---

