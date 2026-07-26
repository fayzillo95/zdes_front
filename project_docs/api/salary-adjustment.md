# SalaryAdjustment modulini backend tahlili

### Endpoint: POST /api/v1/salary-adjustments
**Controller:** src/modules/salary-adjustment/salary-adjustment.controller.ts:create

**1. Point (yo'nalish):**
- POST /api/v1/salary-adjustments
- SalaryAdjustmentController create

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- employeeId: misol yo'q
- type: AdjustmentType.bonus
- category: AdjustmentCategory.manual
- amount: 150000
- date: 2026-06-08
- month: 2026-06
- reason: Manual bonus

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- Request DTO: CreateSalaryAdjustmentDto (src/modules/salary-adjustment/dto/create-salary-adjustment.dto.ts)
- companyId: string, @IsOptional(), @IsUUID()
- employeeId: string, @IsUUID()
- type: AdjustmentType, @IsEnum(AdjustmentType)
- category: AdjustmentCategory, @IsOptional(), @IsEnum(AdjustmentCategory)
- amount: number, @Type(() => Number), @IsNumber()
- date: string, @IsDateString()
- month: string, @IsOptional(), @IsString()
- reason: string, @IsOptional(), @IsString(), @MaxLength(1000)

**5. Service:**
- Service method: salaryAdjustmentService.create (src/modules/salary-adjustment/salary-adjustment.service.ts)
- Kiritilgan ma'lumotlarga asosan yangi oylik tuzatish (salary adjustment) yozuvini `SalaryAdjustment` jadvaliga saqlaydi. Bunga qadar kompaniya va xodimning berilgan doira (scope) ichida ekanligini tekshiradi (ensureCompanyExists, ensureEmployeeInScope).

**6. Response:**
- Qaytariladigan javob shakli: Yaratilgan oylik tuzatish obyekti (aniq qaytadigan tiplar prisma modelidagi tiplardir)
- id: string
- companyId: string
- employeeId: string
- type: enum
- category: enum
- amount: number
- date: date
- month: string
- reason: string
- createdById: string
- updatedById: string
- createdAt: datetime
- updatedAt: datetime

**7. Error case:**
- NotFoundException: 'Company not found' (shart bajarilmasa, HTTP 404)
- NotFoundException: 'Employee not found' (shart bajarilmasa, HTTP 404)
- ConflictException: 'Employee does not belong to the selected company' (shart bajarilmasa, HTTP 409)
- ForbiddenException: Agar record actor doirasida (scope) bo'lmasa (HTTP 403)

**8. DB struktura:**
- Tegishli model: SalaryAdjustment
- id: String (Majburiy) @default(uuid()) @db.Uuid
- companyId: String (Majburiy) @db.Uuid
- employeeId: String (Majburiy) @db.Uuid
- type: AdjustmentType (Majburiy)
- category: AdjustmentCategory (Majburiy) @default(manual)
- amount: Decimal (Majburiy) @db.Decimal(15, 2)
- date: DateTime (Majburiy) @db.Date
- month: String (Majburiy) @db.VarChar(7)
- reason: String? (Ixtiyoriy)
- createdById: String? (Ixtiyoriy) @db.Uuid
- updatedById: String? (Ixtiyoriy) @db.Uuid
- createdAt: DateTime (Majburiy) @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime (Majburiy) @updatedAt @db.Timestamptz(6)
- Chiquvchi relations:
  - SalaryAdjustment.companyId -> Company.id (onDelete: Cascade)
  - SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi relations: Yo'q
- Indexes:
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([type])
  - @@index([category])


### Endpoint: GET /api/v1/salary-adjustments
**Controller:** src/modules/salary-adjustment/salary-adjustment.controller.ts:findAll

**1. Point (yo'nalish):**
- GET /api/v1/salary-adjustments
- SalaryAdjustmentController findAll

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q
- companyId: misol yo'q
- employeeId: misol yo'q
- type: misol yo'q
- category: misol yo'q
- month: 2026-06
- search: bonus
- dateFrom: 2026-06-01
- dateTo: 2026-06-30
- page: 1
- limit: 10

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- Request DTO: SalaryAdjustmentQueryDto (src/modules/salary-adjustment/dto/salary-adjustment-query.dto.ts)
- companyId: string, @IsOptional(), @IsUUID()
- employeeId: string, @IsOptional(), @IsUUID()
- type: AdjustmentType, @IsOptional(), @IsEnum(AdjustmentType)
- category: AdjustmentCategory, @IsOptional(), @IsEnum(AdjustmentCategory)
- month: string, @IsOptional(), @IsString()
- search: string, @IsOptional(), @IsString()
- dateFrom: string, @IsOptional(), @IsString()
- dateTo: string, @IsOptional(), @IsString()
- page: number, @IsOptional(), @Type(() => Number), @IsInt(), @Min(1)
- limit: number, @IsOptional(), @Type(() => Number), @IsInt(), @Min(1), @Max(100)

**5. Service:**
- Service method: salaryAdjustmentService.findAll (src/modules/salary-adjustment/salary-adjustment.service.ts)
- Mavjud oylik tuzatishlarni filtrlar, qidiruv va paginatsiya orqali `SalaryAdjustment` jadvalidan o'qib keladi. Natijalarni ro'yxat va jami soni bilan qaytaradi.

**6. Response:**
- Paginatsiya obyekti qaytadi:
  - items: SalaryAdjustment[] (oylik tuzatishlar massivi)
  - total: number (jami yozuvlar soni)
  - page: number (joriy sahifa)
  - limit: number (sahifadagi yozuvlar chegarasi)
  - totalPages: number (jami sahifalar soni)

**7. Error case:**
- ForbiddenException: Agar scope dan tashqarida bo'lsa (HTTP 403)

**8. DB struktura:**
- Tegishli model: SalaryAdjustment
- id: String (Majburiy) @default(uuid()) @db.Uuid
- companyId: String (Majburiy) @db.Uuid
- employeeId: String (Majburiy) @db.Uuid
- type: AdjustmentType (Majburiy)
- category: AdjustmentCategory (Majburiy) @default(manual)
- amount: Decimal (Majburiy) @db.Decimal(15, 2)
- date: DateTime (Majburiy) @db.Date
- month: String (Majburiy) @db.VarChar(7)
- reason: String? (Ixtiyoriy)
- createdById: String? (Ixtiyoriy) @db.Uuid
- updatedById: String? (Ixtiyoriy) @db.Uuid
- createdAt: DateTime (Majburiy) @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime (Majburiy) @updatedAt @db.Timestamptz(6)
- Chiquvchi relations:
  - SalaryAdjustment.companyId -> Company.id (onDelete: Cascade)
  - SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi relations: Yo'q
- Indexes:
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([type])
  - @@index([category])


### Endpoint: GET /api/v1/salary-adjustments/:id
**Controller:** src/modules/salary-adjustment/salary-adjustment.controller.ts:findOne

**1. Point (yo'nalish):**
- GET /api/v1/salary-adjustments/:id
- SalaryAdjustmentController findOne

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- Request DTO yo'q
- @Param('id') id: string, ParseUUIDPipe

**5. Service:**
- Service method: salaryAdjustmentService.findOne (src/modules/salary-adjustment/salary-adjustment.service.ts)
- Bitta aniq ID ga ega oylik tuzatishni topadi va foydalanuvchining huquq doirasidaligini tekshirib qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli: Topilgan oylik tuzatish obyekti
- id: string
- companyId: string
- employeeId: string
- type: enum
- category: enum
- amount: number
- date: date
- month: string
- reason: string
- createdById: string
- updatedById: string
- createdAt: datetime
- updatedAt: datetime

**7. Error case:**
- NotFoundException: 'Salary adjustment not found' (agar topilmasa, HTTP 404)
- ForbiddenException: Agar record actor doirasida (scope) bo'lmasa (HTTP 403)

**8. DB struktura:**
- Tegishli model: SalaryAdjustment
- id: String (Majburiy) @default(uuid()) @db.Uuid
- companyId: String (Majburiy) @db.Uuid
- employeeId: String (Majburiy) @db.Uuid
- type: AdjustmentType (Majburiy)
- category: AdjustmentCategory (Majburiy) @default(manual)
- amount: Decimal (Majburiy) @db.Decimal(15, 2)
- date: DateTime (Majburiy) @db.Date
- month: String (Majburiy) @db.VarChar(7)
- reason: String? (Ixtiyoriy)
- createdById: String? (Ixtiyoriy) @db.Uuid
- updatedById: String? (Ixtiyoriy) @db.Uuid
- createdAt: DateTime (Majburiy) @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime (Majburiy) @updatedAt @db.Timestamptz(6)
- Chiquvchi relations:
  - SalaryAdjustment.companyId -> Company.id (onDelete: Cascade)
  - SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi relations: Yo'q
- Indexes:
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([type])
  - @@index([category])


### Endpoint: PATCH /api/v1/salary-adjustments/:id
**Controller:** src/modules/salary-adjustment/salary-adjustment.controller.ts:update

**1. Point (yo'nalish):**
- PATCH /api/v1/salary-adjustments/:id
- SalaryAdjustmentController update

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- employeeId: misol yo'q
- type: AdjustmentType.bonus
- category: AdjustmentCategory.manual
- amount: 150000
- date: 2026-06-08
- month: 2026-06
- reason: Manual bonus

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- Request DTO: UpdateSalaryAdjustmentDto (src/modules/salary-adjustment/dto/update-salary-adjustment.dto.ts) (PartialType of CreateSalaryAdjustmentDto)
- Barcha maydonlar ixtiyoriy:
- companyId: string, @IsOptional(), @IsUUID()
- employeeId: string, @IsUUID()
- type: AdjustmentType, @IsEnum(AdjustmentType)
- category: AdjustmentCategory, @IsOptional(), @IsEnum(AdjustmentCategory)
- amount: number, @Type(() => Number), @IsNumber()
- date: string, @IsDateString()
- month: string, @IsOptional(), @IsString()
- reason: string, @IsOptional(), @IsString(), @MaxLength(1000)

**5. Service:**
- Service method: salaryAdjustmentService.update (src/modules/salary-adjustment/salary-adjustment.service.ts)
- Mavjud oylik tuzatish yozuvini yangilaydi, agar kompaniya yoki xodim ID o'zgarsa yana huquq va mavjudlikni tekshiradi, keyin o'zgarishlarni ma'lumotlar bazasida `SalaryAdjustment` modeliga saqlaydi.

**6. Response:**
- Qaytariladigan javob shakli: Yangilangan oylik tuzatish obyekti
- id: string
- companyId: string
- employeeId: string
- type: enum
- category: enum
- amount: number
- date: date
- month: string
- reason: string
- createdById: string
- updatedById: string
- createdAt: datetime
- updatedAt: datetime

**7. Error case:**
- NotFoundException: 'Salary adjustment not found' (shart bajarilmasa, HTTP 404)
- NotFoundException: 'Company not found' (shart bajarilmasa, HTTP 404)
- NotFoundException: 'Employee not found' (shart bajarilmasa, HTTP 404)
- ConflictException: 'Employee does not belong to the selected company' (shart bajarilmasa, HTTP 409)
- ForbiddenException: Agar record actor doirasida (scope) bo'lmasa (HTTP 403)

**8. DB struktura:**
- Tegishli model: SalaryAdjustment
- id: String (Majburiy) @default(uuid()) @db.Uuid
- companyId: String (Majburiy) @db.Uuid
- employeeId: String (Majburiy) @db.Uuid
- type: AdjustmentType (Majburiy)
- category: AdjustmentCategory (Majburiy) @default(manual)
- amount: Decimal (Majburiy) @db.Decimal(15, 2)
- date: DateTime (Majburiy) @db.Date
- month: String (Majburiy) @db.VarChar(7)
- reason: String? (Ixtiyoriy)
- createdById: String? (Ixtiyoriy) @db.Uuid
- updatedById: String? (Ixtiyoriy) @db.Uuid
- createdAt: DateTime (Majburiy) @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime (Majburiy) @updatedAt @db.Timestamptz(6)
- Chiquvchi relations:
  - SalaryAdjustment.companyId -> Company.id (onDelete: Cascade)
  - SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi relations: Yo'q
- Indexes:
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([type])
  - @@index([category])


### Endpoint: DELETE /api/v1/salary-adjustments/:id
**Controller:** src/modules/salary-adjustment/salary-adjustment.controller.ts:delete

**1. Point (yo'nalish):**
- DELETE /api/v1/salary-adjustments/:id
- SalaryAdjustmentController delete

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- @ApiBearerAuth()
- @Roles('superadmin', 'admin', 'manager')

**4. DTO:**
- Request DTO yo'q
- @Param('id') id: string, ParseUUIDPipe

**5. Service:**
- Service method: salaryAdjustmentService.delete (src/modules/salary-adjustment/salary-adjustment.service.ts)
- Berilgan ID ga mos oylik tuzatish yozuvini bazadan o'chiradi, avval uning huquq doirasidaligini tekshiradi.

**6. Response:**
- Obyekt qaytadi:
  - success: boolean (true)
  - id: string (o'chirilgan yozuv id si)

**7. Error case:**
- NotFoundException: 'Salary adjustment not found' (shart bajarilmasa, HTTP 404)
- ForbiddenException: Agar record actor doirasida (scope) bo'lmasa (HTTP 403)

**8. DB struktura:**
- Tegishli model: SalaryAdjustment
- id: String (Majburiy) @default(uuid()) @db.Uuid
- companyId: String (Majburiy) @db.Uuid
- employeeId: String (Majburiy) @db.Uuid
- type: AdjustmentType (Majburiy)
- category: AdjustmentCategory (Majburiy) @default(manual)
- amount: Decimal (Majburiy) @db.Decimal(15, 2)
- date: DateTime (Majburiy) @db.Date
- month: String (Majburiy) @db.VarChar(7)
- reason: String? (Ixtiyoriy)
- createdById: String? (Ixtiyoriy) @db.Uuid
- updatedById: String? (Ixtiyoriy) @db.Uuid
- createdAt: DateTime (Majburiy) @default(now()) @db.Timestamptz(6)
- updatedAt: DateTime (Majburiy) @updatedAt @db.Timestamptz(6)
- Chiquvchi relations:
  - SalaryAdjustment.companyId -> Company.id (onDelete: Cascade)
  - SalaryAdjustment.employeeId -> User.id (onDelete: Cascade)
- Kiruvchi relations: Yo'q (bu o'chirilganda boshqa hech narsa o'chmaydi yoki ta'sirlanmaydi)
- Indexes:
  - @@index([companyId])
  - @@index([employeeId])
  - @@index([month])
  - @@index([type])
  - @@index([category])
