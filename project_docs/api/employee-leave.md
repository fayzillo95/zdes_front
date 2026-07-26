### Endpoint: POST /api/v1/employee-leaves
**Controller:** src/modules/employee-leave/employee-leave.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/employee-leaves`
- Controller class + method nomi: `EmployeeLeaveController` -> `create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `type`: `vacation`
- `fromDate`: `2026-06-10`
- `toDate`: `2026-06-12`
- `days`: `3`
- `affectsSalary`: `false`
- `reason`: `Medical leave`
- `companyId`: misol yo'q
- `branchId`: misol yo'q
- `employeeId`: misol yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida ruxsat etilgan rollar)

**4. DTO:**
- Request DTO: `CreateEmployeeLeaveDto` (src/modules/employee-leave/dto/create-employee-leave.dto.ts)
- `companyId`: Tip - String, Validatorlar - `@IsOptional()`, `@IsUUID()`
- `branchId`: Tip - String, Validatorlar - `@IsOptional()`, `@IsUUID()`
- `employeeId`: Tip - String, Validatorlar - `@IsUUID()`
- `type`: Tip - LeaveType (enum), Validatorlar - `@IsEnum(LeaveType)`
- `fromDate`: Tip - String, Validatorlar - `@Type(() => String)`, `@IsDateString()`
- `toDate`: Tip - String, Validatorlar - `@Type(() => String)`, `@IsDateString()`
- `days`: Tip - Number, Validatorlar - `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- `affectsSalary`: Tip - Boolean, Validatorlar - `@IsOptional()`, `@IsBoolean()`
- `reason`: Tip - String, Validatorlar - `@IsOptional()`, `@IsString()`, `@MaxLength(1000)`

**5. Service:**
- Service method: `create` (src/modules/employee-leave/employee-leave.service.ts)
- Tavsifi: Xodimni, kompaniya va filiallarni tekshiradi, kunlarni hisoblaydi (agar berilmagan bo'lsa) va `EmployeeLeave` jadvaliga yangi ta'til yozuvini qo'shadi.

**6. Response:**
- Qaytariladigan javob shakli: Prisma `EmployeeLeave` obyekti (aniq maydonlar: `id` (String), `companyId` (String), `branchId` (String?), `employeeId` (String), `type` (LeaveType), `fromDate` (DateTime), `toDate` (DateTime), `days` (Int), `affectsSalary` (Boolean), `reason` (String?), `createdById` (String?), `updatedById` (String?), `createdAt` (DateTime), `updatedAt` (DateTime)).

**7. Error case:**
- `NotFoundException`: 'Company not found' (kompaniya topilmasa), 'Branch not found' (filial topilmasa), 'Employee not found' (xodim topilmasa).
- `ConflictException`: 'Branch does not belong to the selected company' (filial tegishli emas), 'Employee does not belong to the selected company' (xodim tegishli emas), 'Employee does not belong to the selected branch' (xodim filialga tegishli emas).
- `BadRequestException`: 'Leave end date must be after start date' (sana xato bo'lsa).

**8. DB struktura:**
- Prisma modeli: `EmployeeLeave` (prisma/schema.prisma)
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeId`: `String`, majburiy, `@db.Uuid`
  - `type`: `LeaveType`, majburiy, `@default(vacation)`
  - `fromDate`: `DateTime`, majburiy, `@db.Date`
  - `toDate`: `DateTime`, majburiy, `@db.Date`
  - `days`: `Int`, majburiy
  - `affectsSalary`: `Boolean`, majburiy, `@default(false)`
  - `reason`: `String`, ixtiyoriy (`?`)
  - `createdById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `updatedById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations (Chiquvchi):
  - `companyId -> Company.id (onDelete: Cascade)`
  - `branchId -> Branch.id (onDelete: SetNull)`
  - `employeeId -> User.id (onDelete: Cascade)`
- Relations (Kiruvchi): Yo'q (Boshqa modellar ushbu modelga ishora qilmaydi).
- Indekslar: 
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([employeeId])`
  - `@@index([fromDate])`
  - `@@index([toDate])`

---

### Endpoint: GET /api/v1/employee-leaves
**Controller:** src/modules/employee-leave/employee-leave.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/employee-leaves`
- Controller class + method nomi: `EmployeeLeaveController` -> `findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q (Query parametrlari orqali ma'lumot keladi).
- Query parametr misollari:
  - `type`: `vacation`
  - `affectsSalary`: `false`
  - `search`: `medical`
  - `dateFrom`: `2026-06-01`
  - `dateTo`: `2026-06-30`
  - `page`: `1`
  - `limit`: `10`
  - `companyId`: misol yo'q
  - `branchId`: misol yo'q
  - `employeeId`: misol yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)

**4. DTO:**
- Request DTO: `EmployeeLeaveQueryDto` (src/modules/employee-leave/dto/employee-leave-query.dto.ts)
- `companyId`: Tip - String, Validatorlar - `@IsOptional()`, `@IsUUID()`
- `branchId`: Tip - String, Validatorlar - `@IsOptional()`, `@IsUUID()`
- `employeeId`: Tip - String, Validatorlar - `@IsOptional()`, `@IsUUID()`
- `type`: Tip - LeaveType, Validatorlar - `@IsOptional()`, `@IsEnum(LeaveType)`
- `affectsSalary`: Tip - Boolean, Validatorlar - `@IsOptional()`, `@Transform(...)`, `@IsBoolean()`
- `search`: Tip - String, Validatorlar - `@IsOptional()`, `@IsString()`
- `dateFrom`: Tip - String, Validatorlar - `@IsOptional()`, `@IsString()`
- `dateTo`: Tip - String, Validatorlar - `@IsOptional()`, `@IsString()`
- `page`: Tip - Number, Validatorlar - `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- `limit`: Tip - Number, Validatorlar - `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Service method: `findAll` (src/modules/employee-leave/employee-leave.service.ts)
- Tavsifi: Filterlar (kompaniya, xodim, filial, sana) bo'yicha ruxsat doirasida xodimlar ta'tillari ro'yxatini va paginatsiyani bazadan olib keladi.

**6. Response:**
- Paginatsiya shaklidagi obyekt:
  - `items`: EmployeeLeave obyektlari massivi (Array)
  - `total`: Umumiy miqdor (Number)
  - `page`: Joriy sahifa (Number)
  - `limit`: Sahifadagi limit (Number)
  - `totalPages`: Jami sahifalar soni (Number)

**7. Error case:**
- Maxsus xatolik tashlamaydi (bazaviy exception'lar bo'lishi mumkin xolos).

**8. DB struktura:**
- Prisma modeli: `EmployeeLeave` (prisma/schema.prisma)
- Ustun ta'riflari: (POST bilan bir xil)
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeId`: `String`, majburiy, `@db.Uuid`
  - `type`: `LeaveType`, majburiy, `@default(vacation)`
  - `fromDate`: `DateTime`, majburiy, `@db.Date`
  - `toDate`: `DateTime`, majburiy, `@db.Date`
  - `days`: `Int`, majburiy
  - `affectsSalary`: `Boolean`, majburiy, `@default(false)`
  - `reason`: `String`, ixtiyoriy (`?`)
  - `createdById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `updatedById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations (Chiquvchi):
  - `companyId -> Company.id (onDelete: Cascade)`
  - `branchId -> Branch.id (onDelete: SetNull)`
  - `employeeId -> User.id (onDelete: Cascade)`
- Relations (Kiruvchi): Yo'q.
- Indekslar: 
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([employeeId])`
  - `@@index([fromDate])`
  - `@@index([toDate])`

---

### Endpoint: GET /api/v1/employee-leaves/:id
**Controller:** src/modules/employee-leave/employee-leave.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/employee-leaves/:id`
- Controller class + method nomi: `EmployeeLeaveController` -> `findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)

**4. DTO:**
- Request DTO qo'llanilmagan (Faqat Param `id` string sifatida olinadi).

**5. Service:**
- Service method: `findOne` (src/modules/employee-leave/employee-leave.service.ts)
- Tavsifi: Berilgan ID yordamida bitta ta'til yozuvini oladi va foydalanuvchining unga ruxsati borligini (scope) tekshiradi.

**6. Response:**
- Qaytariladigan javob shakli: Prisma `EmployeeLeave` obyekti.

**7. Error case:**
- `NotFoundException`: 'Employee leave not found' (berilgan id dagi ta'til topilmasa).

**8. DB struktura:**
- Prisma modeli: `EmployeeLeave` (prisma/schema.prisma)
- Ustun ta'riflari: (POST bilan bir xil)
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeId`: `String`, majburiy, `@db.Uuid`
  - `type`: `LeaveType`, majburiy, `@default(vacation)`
  - `fromDate`: `DateTime`, majburiy, `@db.Date`
  - `toDate`: `DateTime`, majburiy, `@db.Date`
  - `days`: `Int`, majburiy
  - `affectsSalary`: `Boolean`, majburiy, `@default(false)`
  - `reason`: `String`, ixtiyoriy (`?`)
  - `createdById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `updatedById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations (Chiquvchi):
  - `companyId -> Company.id (onDelete: Cascade)`
  - `branchId -> Branch.id (onDelete: SetNull)`
  - `employeeId -> User.id (onDelete: Cascade)`
- Relations (Kiruvchi): Yo'q.
- Indekslar: 
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([employeeId])`
  - `@@index([fromDate])`
  - `@@index([toDate])`

---

### Endpoint: PATCH /api/v1/employee-leaves/:id
**Controller:** src/modules/employee-leave/employee-leave.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/employee-leaves/:id`
- Controller class + method nomi: `EmployeeLeaveController` -> `update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
(CreateEmployeeLeaveDto dan meros orqali olingan PartialType)
- `type`: `vacation`
- `fromDate`: `2026-06-10`
- `toDate`: `2026-06-12`
- `days`: `3`
- `affectsSalary`: `false`
- `reason`: `Medical leave`
- `companyId`: misol yo'q
- `branchId`: misol yo'q
- `employeeId`: misol yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)

**4. DTO:**
- Request DTO: `UpdateEmployeeLeaveDto` (src/modules/employee-leave/dto/update-employee-leave.dto.ts) - `PartialType(CreateEmployeeLeaveDto)`
- Maydonlar tip va validatorlari CreateEmployeeLeaveDto kabi, faqat barchasi ixtiyoriy bo'ladi.

**5. Service:**
- Service method: `update` (src/modules/employee-leave/employee-leave.service.ts)
- Tavsifi: Mavjud ta'tilni topib tekshiradi va uzatilgan yangi ma'lumotlar bilan ma'lumotlar bazasida yozuvni yangilaydi (shuningdek sana oralig'ini qayta hisoblaydi).

**6. Response:**
- Qaytariladigan javob shakli: Yangilangan Prisma `EmployeeLeave` obyekti.

**7. Error case:**
- `NotFoundException`: 'Employee leave not found' (ta'til obyektini yoki kompaniya, xodim filialni topa olmasa).
- `ConflictException`: Kompaniya va filiallar mos tushmaganda.
- `BadRequestException`: 'Leave end date must be after start date' (Sana noto'g'ri bo'lganda).

**8. DB struktura:**
- Prisma modeli: `EmployeeLeave` (prisma/schema.prisma)
- Ustun ta'riflari: (POST bilan bir xil)
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeId`: `String`, majburiy, `@db.Uuid`
  - `type`: `LeaveType`, majburiy, `@default(vacation)`
  - `fromDate`: `DateTime`, majburiy, `@db.Date`
  - `toDate`: `DateTime`, majburiy, `@db.Date`
  - `days`: `Int`, majburiy
  - `affectsSalary`: `Boolean`, majburiy, `@default(false)`
  - `reason`: `String`, ixtiyoriy (`?`)
  - `createdById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `updatedById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations (Chiquvchi):
  - `companyId -> Company.id (onDelete: Cascade)`
  - `branchId -> Branch.id (onDelete: SetNull)`
  - `employeeId -> User.id (onDelete: Cascade)`
- Relations (Kiruvchi): Yo'q.
- Indekslar: 
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([employeeId])`
  - `@@index([fromDate])`
  - `@@index([toDate])`

---

### Endpoint: DELETE /api/v1/employee-leaves/:id
**Controller:** src/modules/employee-leave/employee-leave.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/employee-leaves/:id`
- Controller class + method nomi: `EmployeeLeaveController` -> `delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)

**4. DTO:**
- Request DTO qo'llanilmagan (Faqat Param `id` string).

**5. Service:**
- Service method: `delete` (src/modules/employee-leave/employee-leave.service.ts)
- Tavsifi: Ta'til obyekti ID bo'yicha topiladi, scope orqali tekshiriladi va xavfsiz holatda o'chiriladi.

**6. Response:**
- Qaytariladigan javob shakli: `{ success: boolean, id: string }`

**7. Error case:**
- `NotFoundException`: 'Employee leave not found' (o'chirilishi kerak bo'lgan obyekt topilmasa).

**8. DB struktura:**
- Prisma modeli: `EmployeeLeave` (prisma/schema.prisma)
- Ustun ta'riflari: (POST bilan bir xil)
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `employeeId`: `String`, majburiy, `@db.Uuid`
  - `type`: `LeaveType`, majburiy, `@default(vacation)`
  - `fromDate`: `DateTime`, majburiy, `@db.Date`
  - `toDate`: `DateTime`, majburiy, `@db.Date`
  - `days`: `Int`, majburiy
  - `affectsSalary`: `Boolean`, majburiy, `@default(false)`
  - `reason`: `String`, ixtiyoriy (`?`)
  - `createdById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `updatedById`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations (Chiquvchi):
  - `companyId -> Company.id (onDelete: Cascade)`
  - `branchId -> Branch.id (onDelete: SetNull)`
  - `employeeId -> User.id (onDelete: Cascade)`
- Relations (Kiruvchi): Kiruvchi reference'lar (ya'ni ushbu `EmployeeLeave` ni ko'rsatadigan boshqa modellar) butunlay YO'Q. (Yani EmployeeLeave o'chirilsa, hech qaysi boshqa jadvalga cascade yoki null qilib ta'sir ko'rsatmaydi).
- Indekslar: 
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([employeeId])`
  - `@@index([fromDate])`
  - `@@index([toDate])`
