### Endpoint: POST /api/v1/payrolls
**Controller:** src/modules/payroll/payroll.controller.ts:create

**1. Point (yo'nalish):**
- POST /api/v1/payrolls
- PayrollController create

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- employeeId: misol yo'q
- month: 2026-06
- baseSalary: 4000000
- totalBonus: 500000
- totalPenalty: 100000
- totalAdvance: 200000
- netSalary: 4200000
- status: draft
- paidAt: 2026-06-30T10:00:00.000Z
- paidById: misol yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- CreatePayrollDto src/modules/payroll/dto/create-payroll.dto.ts
- companyId: string, @IsOptional(), @IsUUID()
- employeeId: string, @IsUUID()
- month: string, @IsString()
- baseSalary: number, @IsOptional(), @Type(() => Number), @IsNumber()
- totalBonus: number, @IsOptional(), @Type(() => Number), @IsNumber()
- totalPenalty: number, @IsOptional(), @Type(() => Number), @IsNumber()
- totalAdvance: number, @IsOptional(), @Type(() => Number), @IsNumber()
- netSalary: number, @IsOptional(), @Type(() => Number), @IsNumber()
- status: PayrollStatus, @IsOptional(), @IsEnum(PayrollStatus)
- paidAt: string, @IsOptional(), @IsDateString()
- paidById: string, @IsOptional(), @IsUUID()

**5. Service:**
- create src/modules/payroll/payroll.service.ts
- Yaratilish jarayonida ruxsatlarni tekshiradi, company va employee borligini tekshiradi, shu oydagi xodimga tegishli payroll yo'qligini tekshirib keyin bazaga Payroll yozadi.

**6. Response:**
- Payroll obyektini qaytaradi (id, companyId, employeeId, month, baseSalary, totalBonus, totalPenalty, totalAdvance, netSalary, status, paidAt, paidById, createdById, updatedById, createdAt, updatedAt)

**7. Error case:**
- NotFoundException: 'Company not found' - company topilmasa
- NotFoundException: 'Employee not found' - employee topilmasa
- ConflictException: 'Employee does not belong to the selected company' - employee va company mos kelmasa
- ConflictException: 'Payroll month is required' - month probel bo'lsa
- NotFoundException: 'Paid by user not found' - to'lovchi foydalanuvchi topilmasa
- ConflictException: 'Payroll already exists for this employee and month' - unique constraint buzilsa (shu oydagi ishhaqi qilingan bo'lsa)

**8. DB struktura:**
- Model: Payroll
- id: String @id @default(uuid()) @db.Uuid
- companyId: String @db.Uuid
- employeeId: String @db.Uuid
- month: String @db.VarChar(7)
- baseSalary: Decimal @default(0) @db.Decimal(15, 2)
- totalBonus: Decimal @default(0) @db.Decimal(15, 2)
- totalPenalty: Decimal @default(0) @db.Decimal(15, 2)
- totalAdvance: Decimal @default(0) @db.Decimal(15, 2)
- netSalary: Decimal @default(0) @db.Decimal(15, 2)
- status: PayrollStatus @default(draft)
- paidAt: DateTime? @db.Timestamptz(6)
- paidById: String? @db.Uuid
- createdById: String? @db.Uuid
- updatedById: String? @db.Uuid
- createdAt: DateTime @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime @updatedAt @db.Timestamptz(6)
- Chiquvchi:
  - Company.companyId -> Company.id (onDelete: Cascade)
  - User.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi:
  - (Yo'q)
- Index/Unique:
  - @@unique([employeeId, month])
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([status])

### Endpoint: GET /api/v1/payrolls
**Controller:** src/modules/payroll/payroll.controller.ts:findAll

**1. Point (yo'nalish):**
- GET /api/v1/payrolls
- PayrollController findAll

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- PayrollQueryDto src/modules/payroll/dto/payroll-query.dto.ts
- companyId: string, @IsOptional(), @IsUUID()
- employeeId: string, @IsOptional(), @IsUUID()
- month: string, @IsOptional(), @IsString()
- status: PayrollStatus, @IsOptional(), @IsEnum(PayrollStatus)
- page: number, @IsOptional(), @Type(() => Number), @IsInt(), @Min(1)
- limit: number, @IsOptional(), @Type(() => Number), @IsInt(), @Min(1), @Max(100)

**5. Service:**
- findAll src/modules/payroll/payroll.service.ts
- Ruxsat etilgan scope bo'yicha filterlab, page va limit yordamida ro'yxatni paginatsiya bilan qaytaradi.

**6. Response:**
- Paginatsiya qilingan javob qaytaradi:
  - items: Payroll[] (massiv)
  - total: number
  - page: number
  - limit: number
  - totalPages: number

**7. Error case:**
- (Ochiq tashlanadigan alohida Exception yo'q, default validation exception)

**8. DB struktura:**
- Model: Payroll
- id: String @id @default(uuid()) @db.Uuid
- companyId: String @db.Uuid
- employeeId: String @db.Uuid
- month: String @db.VarChar(7)
- baseSalary: Decimal @default(0) @db.Decimal(15, 2)
- totalBonus: Decimal @default(0) @db.Decimal(15, 2)
- totalPenalty: Decimal @default(0) @db.Decimal(15, 2)
- totalAdvance: Decimal @default(0) @db.Decimal(15, 2)
- netSalary: Decimal @default(0) @db.Decimal(15, 2)
- status: PayrollStatus @default(draft)
- paidAt: DateTime? @db.Timestamptz(6)
- paidById: String? @db.Uuid
- createdById: String? @db.Uuid
- updatedById: String? @db.Uuid
- createdAt: DateTime @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime @updatedAt @db.Timestamptz(6)
- Chiquvchi:
  - Company.companyId -> Company.id (onDelete: Cascade)
  - User.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi:
  - (Yo'q)
- Index/Unique:
  - @@unique([employeeId, month])
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([status])

### Endpoint: GET /api/v1/payrolls/:id
**Controller:** src/modules/payroll/payroll.controller.ts:findOne

**1. Point (yo'nalish):**
- GET /api/v1/payrolls/:id
- PayrollController findOne

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- (Request DTO yo'q, faqat ParseUUIDPipe)

**5. Service:**
- findOne src/modules/payroll/payroll.service.ts
- Id bo'yicha bazadan izlaydi va ruxsatlarini tekshirib obyektni qaytaradi.

**6. Response:**
- Payroll obyektini qaytaradi (id, companyId, employeeId, month, baseSalary, totalBonus, totalPenalty, totalAdvance, netSalary, status, paidAt, paidById, createdById, updatedById, createdAt, updatedAt)

**7. Error case:**
- NotFoundException: 'Payroll not found' - berilgan id li yozuv topilmasa

**8. DB struktura:**
- Model: Payroll
- id: String @id @default(uuid()) @db.Uuid
- companyId: String @db.Uuid
- employeeId: String @db.Uuid
- month: String @db.VarChar(7)
- baseSalary: Decimal @default(0) @db.Decimal(15, 2)
- totalBonus: Decimal @default(0) @db.Decimal(15, 2)
- totalPenalty: Decimal @default(0) @db.Decimal(15, 2)
- totalAdvance: Decimal @default(0) @db.Decimal(15, 2)
- netSalary: Decimal @default(0) @db.Decimal(15, 2)
- status: PayrollStatus @default(draft)
- paidAt: DateTime? @db.Timestamptz(6)
- paidById: String? @db.Uuid
- createdById: String? @db.Uuid
- updatedById: String? @db.Uuid
- createdAt: DateTime @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime @updatedAt @db.Timestamptz(6)
- Chiquvchi:
  - Company.companyId -> Company.id (onDelete: Cascade)
  - User.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi:
  - (Yo'q)
- Index/Unique:
  - @@unique([employeeId, month])
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([status])

### Endpoint: PATCH /api/v1/payrolls/:id
**Controller:** src/modules/payroll/payroll.controller.ts:update

**1. Point (yo'nalish):**
- PATCH /api/v1/payrolls/:id
- PayrollController update

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- employeeId: misol yo'q
- month: 2026-06
- baseSalary: 4000000
- totalBonus: 500000
- totalPenalty: 100000
- totalAdvance: 200000
- netSalary: 4200000
- status: draft
- paidAt: 2026-06-30T10:00:00.000Z
- paidById: misol yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- UpdatePayrollDto src/modules/payroll/dto/update-payroll.dto.ts (PartialType)
- companyId: string, @IsOptional(), @IsUUID()
- employeeId: string, @IsUUID()
- month: string, @IsString()
- baseSalary: number, @IsOptional(), @Type(() => Number), @IsNumber()
- totalBonus: number, @IsOptional(), @Type(() => Number), @IsNumber()
- totalPenalty: number, @IsOptional(), @Type(() => Number), @IsNumber()
- totalAdvance: number, @IsOptional(), @Type(() => Number), @IsNumber()
- netSalary: number, @IsOptional(), @Type(() => Number), @IsNumber()
- status: PayrollStatus, @IsOptional(), @IsEnum(PayrollStatus)
- paidAt: string, @IsOptional(), @IsDateString()
- paidById: string, @IsOptional(), @IsUUID()

**5. Service:**
- update src/modules/payroll/payroll.service.ts
- Mavjud yozuvni topib, ma'lumotlarini ruxsatlar bilan tahrirlaydi (jumladan unique payroll bor-yo'qligini employee va oy bo'yicha tekshiradi).

**6. Response:**
- Yangilangan Payroll obyektini qaytaradi (id, companyId, employeeId, month, baseSalary, totalBonus, totalPenalty, totalAdvance, netSalary, status, paidAt, paidById, createdById, updatedById, createdAt, updatedAt)

**7. Error case:**
- NotFoundException: 'Payroll not found' - berilgan id bo'yicha ishhaqi topilmasa
- NotFoundException: 'Company not found' - company topilmasa
- NotFoundException: 'Employee not found' - employee topilmasa
- ConflictException: 'Employee does not belong to the selected company' - employee va company mos kelmasa
- ConflictException: 'Payroll month is required' - month probel bo'lsa
- NotFoundException: 'Paid by user not found' - to'lovchi foydalanuvchi topilmasa
- ConflictException: 'Payroll already exists for this employee and month' - unique constraint buzilsa (boshqa id li)

**8. DB struktura:**
- Model: Payroll
- id: String @id @default(uuid()) @db.Uuid
- companyId: String @db.Uuid
- employeeId: String @db.Uuid
- month: String @db.VarChar(7)
- baseSalary: Decimal @default(0) @db.Decimal(15, 2)
- totalBonus: Decimal @default(0) @db.Decimal(15, 2)
- totalPenalty: Decimal @default(0) @db.Decimal(15, 2)
- totalAdvance: Decimal @default(0) @db.Decimal(15, 2)
- netSalary: Decimal @default(0) @db.Decimal(15, 2)
- status: PayrollStatus @default(draft)
- paidAt: DateTime? @db.Timestamptz(6)
- paidById: String? @db.Uuid
- createdById: String? @db.Uuid
- updatedById: String? @db.Uuid
- createdAt: DateTime @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime @updatedAt @db.Timestamptz(6)
- Chiquvchi:
  - Company.companyId -> Company.id (onDelete: Cascade)
  - User.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi:
  - (Yo'q)
- Index/Unique:
  - @@unique([employeeId, month])
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([status])

### Endpoint: DELETE /api/v1/payrolls/:id
**Controller:** src/modules/payroll/payroll.controller.ts:delete

**1. Point (yo'nalish):**
- DELETE /api/v1/payrolls/:id
- PayrollController delete

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- (Request DTO yo'q, faqat ParseUUIDPipe)

**5. Service:**
- delete src/modules/payroll/payroll.service.ts
- Bazadan yozuvni izlaydi va o'chirib tashlaydi.

**6. Response:**
- `{ success: true, id: string }`

**7. Error case:**
- NotFoundException: 'Payroll not found' - berilgan id bo'yicha ishhaqi topilmasa

**8. DB struktura:**
- Model: Payroll
- id: String @id @default(uuid()) @db.Uuid
- companyId: String @db.Uuid
- employeeId: String @db.Uuid
- month: String @db.VarChar(7)
- baseSalary: Decimal @default(0) @db.Decimal(15, 2)
- totalBonus: Decimal @default(0) @db.Decimal(15, 2)
- totalPenalty: Decimal @default(0) @db.Decimal(15, 2)
- totalAdvance: Decimal @default(0) @db.Decimal(15, 2)
- netSalary: Decimal @default(0) @db.Decimal(15, 2)
- status: PayrollStatus @default(draft)
- paidAt: DateTime? @db.Timestamptz(6)
- paidById: String? @db.Uuid
- createdById: String? @db.Uuid
- updatedById: String? @db.Uuid
- createdAt: DateTime @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime @updatedAt @db.Timestamptz(6)
- Chiquvchi:
  - Company.companyId -> Company.id (onDelete: Cascade)
  - User.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi:
  - (Yo'q)
- Index/Unique:
  - @@unique([employeeId, month])
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([status])
