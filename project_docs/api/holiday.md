### Endpoint: POST /api/v1/holidays
**Controller:** src/modules/holiday/holiday.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/holidays`
- Controller class + method nomi: `HolidayController.create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `branchId`: misol yo'q
- `name`: `Navruz holiday`
- `startDate`: `2026-03-21`
- `endDate`: `2026-03-22`
- `affectsSalary`: `false`
- `note`: `Official company holiday`

**3. Guard:**
- `@ApiBearerAuth()` orqali himoyalangan.
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida ruxsat etilgan rollar).

**4. DTO:**
- Request DTO: `CreateHolidayDto` (src/modules/holiday/dto/create-holiday.dto.ts)
- `companyId`: string, `@IsOptional()`, `@IsUUID()`
- `branchId`: string, `@IsOptional()`, `@IsUUID()`
- `name`: string, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- `startDate`: string, `@Type(() => String)`, `@IsDateString()`
- `endDate`: string, `@Type(() => String)`, `@IsDateString()`
- `affectsSalary`: boolean, `@IsOptional()`, `@IsBoolean()`
- `note`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(1000)`

**5. Service:**
- Service method: `HolidayService.create` (src/modules/holiday/holiday.service.ts:create)
- Mantiq: Aktyor ruxsatlarini hisobga olgan holda kompaniya va (ixtiyoriy) filialni tekshiradi. Yozilgan sana oralig'ining to'g'riligini (endDate >= startDate) ham tekshiradi. Barcha shartlar bajarilganda, ma'lumotlar bazasida yangi Holiday (ta'til/bayram) yozuvini yaratadi.

**6. Response:**
- Qaytariladigan javob shakli: Yaratilgan `Holiday` obyekti to'liq qaytariladi.
- Maydonlari: `id` (String), `companyId` (String), `branchId` (String, null bo'lishi mumkin), `name` (String), `startDate` (DateTime), `endDate` (DateTime), `affectsSalary` (Boolean), `note` (String, null bo'lishi mumkin), `createdById` (String), `updatedById` (String), `createdAt` (DateTime), `updatedAt` (DateTime).

**7. Error case:**
- `NotFoundException`: "Company not found" - agar kompaniya topilmasa (404)
- `NotFoundException`: "Branch not found" - agar filial topilmasa (404)
- `ConflictException`: "Branch does not belong to the selected company" - agar filial boshqa kompaniyaga tegishli bo'lsa (409)
- `ConflictException`: "Holiday name is required" - agar nom bo'sh yoki faqat probellardan iborat bo'lsa (409)
- `BadRequestException`: "Holiday end date must be after start date" - agar tugash sanasi boshlanish sanasidan oldin bo'lsa (400)

**8. DB struktura:**
- Tegishli Prisma model nomi: `Holiday` (`prisma/schema.prisma`)
- Har bir maydon uchun ta'rif:
  - `id`: String, Majburiy, `@id`, `@default(uuid())`, `@db.Uuid`
  - `companyId`: String, Majburiy, `@db.Uuid`
  - `branchId`: String, Ixtiyoriy (`?`), `@db.Uuid`
  - `name`: String, Majburiy, `@db.VarChar(255)`
  - `startDate`: DateTime, Majburiy, `@db.Date`
  - `endDate`: DateTime, Majburiy, `@db.Date`
  - `affectsSalary`: Boolean, Majburiy, `@default(false)`
  - `note`: String, Ixtiyoriy (`?`)
  - `createdById`: String, Ixtiyoriy (`?`), `@db.Uuid`
  - `updatedById`: String, Ixtiyoriy (`?`), `@db.Uuid`
  - `createdAt`: DateTime, Majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: DateTime, Majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `Company`: `companyId -> Company.id (onDelete: Cascade)`
  - `Branch`: `branchId -> Branch.id (onDelete: SetNull)`
- Relations / references (Kiruvchi):
  - (Topilmadi - hech qaysi boshqa model Holiday modeliga ishora qilmaydi)
- Indekslar:
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([startDate])`
  - `@@index([endDate])`

---

### Endpoint: GET /api/v1/holidays
**Controller:** src/modules/holiday/holiday.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/holidays`
- Controller class + method nomi: `HolidayController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q (GET so'rovi bo'lgani uchun query parametrlar qabul qiladi).
- Query parametr misollari (`HolidayQueryDto` asosida):
  - `companyId`: misol yo'q
  - `branchId`: misol yo'q
  - `search`: `navruz`
  - `affectsSalary`: `true`
  - `dateFrom`: `2026-03-01`
  - `dateTo`: `2026-03-31`
  - `page`: `1` (default: 1)
  - `limit`: `10` (default: 10)

**3. Guard:**
- `@ApiBearerAuth()` orqali himoyalangan.
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida ruxsat etilgan rollar).

**4. DTO:**
- Request DTO: `HolidayQueryDto` (src/modules/holiday/dto/holiday-query.dto.ts)
- `companyId`: string, `@IsOptional()`, `@IsUUID()`
- `branchId`: string, `@IsOptional()`, `@IsUUID()`
- `search`: string, `@IsOptional()`, `@IsString()`
- `affectsSalary`: boolean, `@IsOptional()`, `@Transform`, `@IsBoolean()`
- `dateFrom`: string, `@IsOptional()`, `@IsString()`
- `dateTo`: string, `@IsOptional()`, `@IsString()`
- `page`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- `limit`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Service method: `HolidayService.findAll` (src/modules/holiday/holiday.service.ts:findAll)
- Mantiq: Berilgan filtrlarga (qidiruv so'zi, companyId, branchId, affectsSalary, va sana oralig'i) va aktyor ruxsat doirasiga asoslanib `Holiday` modelidan ma'lumotlarni izlaydi. Paginatsiya qilingan (limit/page) qilib ro'yxat va umumiy sonini (`total`) qaytaradi. Sana bo'yicha filter qilinganda Date(dateFrom) va Date(dateTo) obyektlari asosida qoplanishlar tekshiriladi.

**6. Response:**
- Qaytariladigan javob shakli: Paginatsiya qilingan obyekt:
  - `items`: `Holiday` model obyektlar massivi
  - `total`: Topilgan barcha yozuvlar soni (Number)
  - `page`: Joriy sahifa raqami (Number)
  - `limit`: Bitta sahifadagi yozuvlar limiti (Number)
  - `totalPages`: Jami sahifalar soni (Number)

**7. Error case:**
- Boshqa maxsus xatolar ko'rsatilmagan (lekin avtorizatsiya va noto'g'ri so'rov xatoliklari bo'lishi mumkin).

**8. DB struktura:**
- Tegishli Prisma model nomi: `Holiday` (`prisma/schema.prisma`)
- Har bir maydon uchun ta'rif (POST /api/v1/holidays dagi bilan bir xil).
- Relations / references (Chiquvchi va Kiruvchi) va Indekslar - yuqorida keltirilgandek bir xil. Paginatsiya va ro'yxat qidirish uchun `@@index([companyId])`, `@@index([branchId])`, `@@index([startDate])`, `@@index([endDate])` indekslar ishlatilishi nazarda tutilgan.

---

### Endpoint: GET /api/v1/holidays/:id
**Controller:** src/modules/holiday/holiday.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/holidays/:id`
- Controller class + method nomi: `HolidayController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q. Faqat url ichida `id` parametri keladi.

**3. Guard:**
- `@ApiBearerAuth()` orqali himoyalangan.
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida ruxsat etilgan rollar).

**4. DTO:**
- DTO klassi yo'q. Parametr sifatida `id: string` (`ParseUUIDPipe` bilan) qabul qiladi.

**5. Service:**
- Service method: `HolidayService.findOne` (src/modules/holiday/holiday.service.ts:findOne)
- Mantiq: Berilgan `id` yordamida `Holiday` ni qidiradi va joriy foydalanuvchi (actor) uchun ushbu obyektga kirish ruxsati borligini tekshiradi (`assertWithinScope`). Topilsa qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli: Topilgan bitta `Holiday` obyekti to'liq qaytariladi.

**7. Error case:**
- `NotFoundException`: "Holiday not found" - agar ushbu `id` bilan yozuv topilmasa (404)
- `ForbiddenException`: "Access denied" (yoki `assertWithinScope` ichida otiladigan huquq etishmovchiligi xatosi, agar aktyor ushbu company/branch ga ruxsati bo'lmasa). (403 odatda)

**8. DB struktura:**
- Tegishli Prisma model nomi: `Holiday` (`prisma/schema.prisma`)
- Har bir maydon uchun ta'rif va bog'lanishlar - POST dagi kabi bir xil. Bitta obyekt bo'yicha ma'lumotlar olinadi.

---

### Endpoint: PATCH /api/v1/holidays/:id
**Controller:** src/modules/holiday/holiday.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/holidays/:id`
- Controller class + method nomi: `HolidayController.update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `UpdateHolidayDto` (CreateHolidayDto ning Partial ko'rinishi) quyidagi ehtimoliy qiymatlarga ega:
  - `companyId`: misol yo'q
  - `branchId`: misol yo'q
  - `name`: `Navruz holiday`
  - `startDate`: `2026-03-21`
  - `endDate`: `2026-03-22`
  - `affectsSalary`: `false`
  - `note`: `Official company holiday`

**3. Guard:**
- `@ApiBearerAuth()` orqali himoyalangan.
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida ruxsat etilgan rollar).

**4. DTO:**
- Request DTO: `UpdateHolidayDto` (src/modules/holiday/dto/update-holiday.dto.ts) -> Bu `PartialType(CreateHolidayDto)` hisoblanadi.
- Barcha maydonlari (companyId, branchId, name, startDate, endDate, affectsSalary, note) ixtiyoriy (`@IsOptional()`). Validatsiya dekoratorlari xuddi `CreateHolidayDto` dagi kabi.

**5. Service:**
- Service method: `HolidayService.update` (src/modules/holiday/holiday.service.ts:update)
- Mantiq: Dastlab ko'rsatilgan `id` dagi holiday borligiga ishonch hosil qiladi va foydalanuvchining unga ruxsatini tekshiradi (`assertWithinScope`). So'ngra yangi kiritilgan ma'lumotlarga qarab tegishli `Company` va `Branch` larni bazada mavjudligini hamda aktyor ruxsatlarini qaytadan tekshiradi. Yana endDate >= startDate oraliq validatsiyasidan o'tadi va bazadagi ma'lumotni yangilaydi.

**6. Response:**
- Qaytariladigan javob shakli: Yangilangan `Holiday` obyekti to'liq qaytariladi.

**7. Error case:**
- `NotFoundException`: "Holiday not found" - holiday topilmasa (404)
- (Yana `assertWithinScope` xatoligi ehtimoli)
- `NotFoundException`: "Company not found" (404)
- `NotFoundException`: "Branch not found" (404)
- `ConflictException`: "Branch does not belong to the selected company" (409)
- `ConflictException`: "Holiday name is required" (409)
- `BadRequestException`: "Holiday end date must be after start date" (400)

**8. DB struktura:**
- Tegishli Prisma model nomi: `Holiday` (`prisma/schema.prisma`)
- Har bir maydon uchun ta'rif, Relations va Indekslar POST bo'limidagi bilan aynan bir xil.

---

### Endpoint: DELETE /api/v1/holidays/:id
**Controller:** src/modules/holiday/holiday.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/holidays/:id`
- Controller class + method nomi: `HolidayController.delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q.

**3. Guard:**
- `@ApiBearerAuth()` orqali himoyalangan.
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida ruxsat etilgan rollar).

**4. DTO:**
- DTO klassi yo'q. URL ichidan `id` parametri `ParseUUIDPipe` orqali keladi.

**5. Service:**
- Service method: `HolidayService.delete` (src/modules/holiday/holiday.service.ts:delete)
- Mantiq: Yozuvni qidirib topadi, foydalanuvchining huquqlarini tekshiradi (`assertWithinScope`) va `Holiday` jadvalidan to'liq o'chirib yuboradi (hard delete). 

**6. Response:**
- Qaytariladigan javob shakli: `success` (Boolean) true qiymati va o'chirilgan holidayning `id` si qatnashgan obyekt: `{ success: true, id: string }`.

**7. Error case:**
- `NotFoundException`: "Holiday not found" (404)
- Ruxsat etishmovchiligi xatosi (`assertWithinScope` orqali) (403)

**8. DB struktura:**
- Tegishli Prisma model nomi: `Holiday` (`prisma/schema.prisma`)
- Har bir maydon uchun ta'rif (POST bilan bir xil).
- Relations / references (Chiquvchi):
  - `Company`: `companyId -> Company.id (onDelete: Cascade)`
  - `Branch`: `branchId -> Branch.id (onDelete: SetNull)`
- **Relations / references (Kiruvchi - O'chirilganda nima bo'ladi):**
  - Hech qaysi boshqa model ushbu `Holiday` modeliga xorijiy kalit (Foreign Key) orqali ishora qilmaydi. Shuning uchun o'chirish hech qanday boshqa modellarda to'g'ridan-to'g'ri o'zgarishga (masalan SetNull yoki Cascade delete) sabab bo'lmaydi. Xavfsiz o'chirish mumkin.
- Indekslar: yuqoridagi bo'limlardagidek.
