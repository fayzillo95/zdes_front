### Endpoint: POST /api/v1/advances
**Controller:** src/modules/advance/advance.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/advances`
- Controller class + method nomi: `AdvanceController.create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `employeeId`: misol yo'q
- `amount`: 500000
- `date`: 2026-06-08
- `month`: 2026-06
- `note`: Advance for travel expenses

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi + fayl yo'li: `CreateAdvanceDto` (src/modules/advance/dto/create-advance.dto.ts)
- `companyId`: optional, string, `@IsOptional()`, `@IsUUID()`
- `employeeId`: required, string, `@IsUUID()`
- `amount`: required, number, `@Type(() => Number)`, `@IsNumber({ maxDecimalPlaces: 2 })`, `@Min(0)`
- `date`: required, string, `@IsISO8601({ strict: true })`
- `month`: optional, string, `@IsOptional()`, `@IsString()`, `@MaxLength(7)`
- `note`: optional, string, `@IsOptional()`, `@IsString()`, `@MaxLength(1000)`

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AdvanceService.create` (src/modules/advance/advance.service.ts)
- Tavsif: Yangi avans yozuvini yaratadi. Berilgan kompaniya va xodim (employeeId) foydalanuvchi huquqi (scope) doirasida ekanini tekshiradi va `advance` jadvaliga yangi yozuv qo'shadi.

**6. Response:**
- Qaytariladigan javob shakli: Yaratilgan Advance obyekti
  - `id`: String
  - `companyId`: String
  - `employeeId`: String
  - `amount`: Decimal
  - `date`: DateTime
  - `month`: String
  - `note`: String (yoki null)
  - `createdById`: String
  - `updatedById`: String
  - `createdAt`: DateTime
  - `updatedAt`: DateTime

**7. Error case:**
- `NotFoundException`: 'Company not found' - agar berilgan `companyId` topilmasa (404)
- `NotFoundException`: 'Employee not found' - agar xodim topilmasa (404)
- `ConflictException`: 'Employee does not belong to the selected company' - agar xodim ko'rsatilgan kompaniyada ishlamasa (409)
- `ForbiddenException`: (assertWithinScope orqali) agar foydalanuvchining ushbu ma'lumotga kirish huquqi bo'lmasa

**8. DB struktura:**
- Prisma model: `Advance`
- Maydonlar ta'rifi:
  - `id`: String @id @default(uuid()) @db.Uuid
  - `companyId`: String @db.Uuid
  - `employeeId`: String @db.Uuid
  - `amount`: Decimal @db.Decimal(15, 2)
  - `date`: DateTime @db.Date
  - `month`: String @db.VarChar(7)
  - `note`: String?
  - `createdById`: String? @db.Uuid
  - `updatedById`: String? @db.Uuid
  - `createdAt`: DateTime @default(now()) @db.Timestamptz(6)
  - `updatedAt`: DateTime @updatedAt @db.Timestamptz(6)
- **Relations / references (Chiquvchi):**
  - `Advance.companyId -> Company.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
- **Relations / references (Kiruvchi):**
  - Yo'q (Boshqa modellar Advance modeliga bog'lanmagan)
- Indekslar:
  - `@@index([companyId])`
  - `@@index([employeeId])`
  - `@@index([month])`
  - `@@index([date])`

---

### Endpoint: GET /api/v1/advances
**Controller:** src/modules/advance/advance.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/advances`
- Controller class + method nomi: `AdvanceController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q (Query orqali beriladi)
- Query misollari:
  - `companyId`: misol yo'q
  - `employeeId`: misol yo'q
  - `month`: 2026-06
  - `dateFrom`: 2026-06-01
  - `dateTo`: 2026-06-30
  - `page`: 1
  - `limit`: 10

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi + fayl yo'li: `AdvanceQueryDto` (src/modules/advance/dto/advance-query.dto.ts)
- `companyId`: optional, string, `@IsOptional()`, `@IsUUID()`
- `employeeId`: optional, string, `@IsOptional()`, `@IsUUID()`
- `month`: optional, string, `@IsOptional()`
- `dateFrom`: optional, string, `@IsOptional()`, `@IsISO8601({ strict: true })`
- `dateTo`: optional, string, `@IsOptional()`, `@IsISO8601({ strict: true })`
- `page`: optional, number (default 1), `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- `limit`: optional, number (default 10), `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AdvanceService.findAll` (src/modules/advance/advance.service.ts)
- Tavsif: Joriy foydalanuvchining huquqlaridan (scope) kelib chiqib tegishli kompaniya/filial uchun barcha avanslarni sahifalab (paginated) qaytaradi. Sana oralig'i, oyi, xodimi kabi filterlarni qo'llaydi.

**6. Response:**
- Qaytariladigan javob shakli: Paginatsiya qilingan obyekti
  - `items`: Advance modelidagi obyektlar massivi
  - `total`: number (jami elementlar soni)
  - `page`: number (joriy sahifa)
  - `limit`: number (sahifa hajmi)
  - `totalPages`: number (jami sahifalar soni)

**7. Error case:**
- Ushbu endpoint uchun asosan validation xatolari (BadRequestException) chiqadi. Alohida exception'lar yozilmagan. Maxsus ruxsatlar tekshiruvi doirasida natijalar avtomatik qisqartiriladi.

**8. DB struktura:**
- Prisma model: `Advance`
- Maydonlar ta'rifi:
  - `id`: String @id @default(uuid()) @db.Uuid
  - `companyId`: String @db.Uuid
  - `employeeId`: String @db.Uuid
  - `amount`: Decimal @db.Decimal(15, 2)
  - `date`: DateTime @db.Date
  - `month`: String @db.VarChar(7)
  - `note`: String?
  - `createdById`: String? @db.Uuid
  - `updatedById`: String? @db.Uuid
  - `createdAt`: DateTime @default(now()) @db.Timestamptz(6)
  - `updatedAt`: DateTime @updatedAt @db.Timestamptz(6)
- **Relations / references (Chiquvchi):**
  - `Advance.companyId -> Company.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
- **Relations / references (Kiruvchi):**
  - Yo'q
- Indekslar:
  - `@@index([companyId])`
  - `@@index([employeeId])`
  - `@@index([month])`
  - `@@index([date])`

---

### Endpoint: GET /api/v1/advances/:id
**Controller:** src/modules/advance/advance.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/advances/:id`
- Controller class + method nomi: `AdvanceController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- DTO yo'q. `@Param('id', ParseUUIDPipe)` orqali URL dan ID qabul qilinadi.

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AdvanceService.findOne` (src/modules/advance/advance.service.ts)
- Tavsif: Berilgan ID bo'yicha bitta avans (Advance) ma'lumotini bazadan topadi. Foydalanuvchining ushbu yozuvni ko'rishga huquqi bor-yo'qligini tekshiradi (scope check).

**6. Response:**
- Qaytariladigan javob shakli: Bitta Advance obyekti (xuddi create javobidagi kabi)

**7. Error case:**
- `NotFoundException`: 'Advance not found' - avans ID bo'yicha topilmasa (404)
- `ForbiddenException`: agar topilgan avans foydalanuvchi huquqlari (scope) doirasidan tashqarida bo'lsa (403)

**8. DB struktura:**
- Prisma model: `Advance`
- Maydonlar ta'rifi: (yuqoridagi kabi, bir xil)
  - `id`: String @id @default(uuid()) @db.Uuid
  - `companyId`: String @db.Uuid
  - `employeeId`: String @db.Uuid
  - `amount`: Decimal @db.Decimal(15, 2)
  - `date`: DateTime @db.Date
  - `month`: String @db.VarChar(7)
  - `note`: String?
  - `createdById`: String? @db.Uuid
  - `updatedById`: String? @db.Uuid
  - `createdAt`: DateTime @default(now()) @db.Timestamptz(6)
  - `updatedAt`: DateTime @updatedAt @db.Timestamptz(6)
- **Relations / references (Chiquvchi):**
  - `Advance.companyId -> Company.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
- **Relations / references (Kiruvchi):**
  - Yo'q
- Indekslar:
  - `@@index([companyId])`
  - `@@index([employeeId])`
  - `@@index([month])`
  - `@@index([date])`

---

### Endpoint: PATCH /api/v1/advances/:id
**Controller:** src/modules/advance/advance.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/advances/:id`
- Controller class + method nomi: `AdvanceController.update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- (CreateAdvanceDto dan meros bo'lgani uchun)
- `companyId`: misol yo'q
- `employeeId`: misol yo'q
- `amount`: 500000
- `date`: 2026-06-08
- `month`: 2026-06
- `note`: Advance for travel expenses

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi + fayl yo'li: `UpdateAdvanceDto` (src/modules/advance/dto/update-advance.dto.ts) (PartialType(CreateAdvanceDto))
- Barcha maydonlar ixtiyoriy (`@IsOptional`):
  - `companyId`: optional, string, `@IsUUID()`
  - `employeeId`: optional, string, `@IsUUID()`
  - `amount`: optional, number, `@Type(() => Number)`, `@IsNumber({ maxDecimalPlaces: 2 })`, `@Min(0)`
  - `date`: optional, string, `@IsISO8601({ strict: true })`
  - `month`: optional, string, `@IsString()`, `@MaxLength(7)`
  - `note`: optional, string, `@IsString()`, `@MaxLength(1000)`

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AdvanceService.update` (src/modules/advance/advance.service.ts)
- Tavsif: Berilgan ID bo'yicha mavjud avansni yangilaydi. Yangilanayotgan xodim va kompaniyaning foydalanuvchi scope'iga mos kelishini tekshiradi hamda ma'lumotlarni bazada o'zgartiradi.

**6. Response:**
- Qaytariladigan javob shakli: Yangilangan Advance obyekti

**7. Error case:**
- `NotFoundException`: 'Advance not found' - avans ID bo'yicha topilmasa (404)
- `ForbiddenException`: agar avans foydalanuvchi huquqlari (scope) doirasida bo'lmasa (403)
- `NotFoundException`: 'Company not found' - agar berilgan `companyId` topilmasa (404)
- `NotFoundException`: 'Employee not found' - agar berilgan `employeeId` topilmasa (404)
- `ConflictException`: 'Employee does not belong to the selected company' - xodim belgilangan kompaniyada ishlamasa (409)

**8. DB struktura:**
- Prisma model: `Advance`
- Maydonlar ta'rifi:
  - `id`: String @id @default(uuid()) @db.Uuid
  - `companyId`: String @db.Uuid
  - `employeeId`: String @db.Uuid
  - `amount`: Decimal @db.Decimal(15, 2)
  - `date`: DateTime @db.Date
  - `month`: String @db.VarChar(7)
  - `note`: String?
  - `createdById`: String? @db.Uuid
  - `updatedById`: String? @db.Uuid
  - `createdAt`: DateTime @default(now()) @db.Timestamptz(6)
  - `updatedAt`: DateTime @updatedAt @db.Timestamptz(6)
- **Relations / references (Chiquvchi):**
  - `Advance.companyId -> Company.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
- **Relations / references (Kiruvchi):**
  - Yo'q
- Indekslar:
  - `@@index([companyId])`
  - `@@index([employeeId])`
  - `@@index([month])`
  - `@@index([date])`

---

### Endpoint: DELETE /api/v1/advances/:id
**Controller:** src/modules/advance/advance.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/advances/:id`
- Controller class + method nomi: `AdvanceController.delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- DTO yo'q. `@Param('id', ParseUUIDPipe)` orqali URL dan ID qabul qilinadi.

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AdvanceService.delete` (src/modules/advance/advance.service.ts)
- Tavsif: Berilgan ID ga ko'ra avans yozuvini (Advance) topib o'chiradi. O'chirishdan oldin foydalanuvchining huquqlarini (scope check) tekshiradi.

**6. Response:**
- Qaytariladigan javob shakli: Muvaffaqiyat statusi va o'chirilgan ID (`{ success: true, id: string }`)

**7. Error case:**
- `NotFoundException`: 'Advance not found' - avans ID bo'yicha topilmasa (404)
- `ForbiddenException`: yozuvni o'chirishga foydalanuvchi huquqi bo'lmasa (403)

**8. DB struktura:**
- Prisma model: `Advance`
- Maydonlar ta'rifi:
  - `id`: String @id @default(uuid()) @db.Uuid
  - `companyId`: String @db.Uuid
  - `employeeId`: String @db.Uuid
  - `amount`: Decimal @db.Decimal(15, 2)
  - `date`: DateTime @db.Date
  - `month`: String @db.VarChar(7)
  - `note`: String?
  - `createdById`: String? @db.Uuid
  - `updatedById`: String? @db.Uuid
  - `createdAt`: DateTime @default(now()) @db.Timestamptz(6)
  - `updatedAt`: DateTime @updatedAt @db.Timestamptz(6)
- **Relations / references (Chiquvchi):**
  - `Advance.companyId -> Company.id (onDelete: Cascade)`
  - `Advance.employeeId -> User.id (onDelete: Cascade)`
- **Relations / references (Kiruvchi):**
  - Yo'q (Shuning uchun o'chirish paytida Cascade ta'sir qiladigan bog'liq obyektlar yo'q)
- Indekslar:
  - `@@index([companyId])`
  - `@@index([employeeId])`
  - `@@index([month])`
  - `@@index([date])`
