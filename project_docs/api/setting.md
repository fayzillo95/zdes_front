### Endpoint: POST /api/v1/settings
**Controller:** src/modules/setting/setting.controller.ts:create

**1. Point (yo'nalish):**
- POST /api/v1/settings
- SettingController.create

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `key`: attendance_kpi_template
- `value`: { "latePenaltyPerMinute": 1000 }

**3. Guard:**
- `@ApiBearerAuth()`
- `@Roles('superadmin', 'admin')` class-darajasida

**4. DTO:**
- `CreateSettingDto` (src/modules/setting/dto/create-setting.dto.ts)
- `companyId`: `string`, `@IsOptional()`, `@IsUUID()`
- `key`: `string`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- `value`: `Record<string, unknown>`, `@IsOptional()`, `@IsObject()`

**5. Service:**
- `SettingService.create` (src/modules/setting/setting.service.ts)
- Yangi sozlamani (Setting) yaratadi. Avval company mavjudligi tekshiriladi, so'ngra shu kompaniya uchun xuddi shu `key` (kalit) bilan boshqa sozlama yo'qligi tekshiriladi (yagona bo'lishi kerak). So'ng bazaga yoziladi.

**6. Response:**
- `Setting` obyekti:
  - `id`: `String`
  - `companyId`: `String`
  - `key`: `String`
  - `value`: `Json` (yoki `null`)
  - `createdAt`: `DateTime`
  - `updatedAt`: `DateTime`

**7. Error case:**
- `NotFoundException`: "Company not found" (Agar company topilmasa, HTTP 404)
- `ConflictException`: "Setting key is required" (Agar key bo'sh yoki probellardan iborat bo'lsa, HTTP 409)
- `ConflictException`: "Setting key already exists for this company" (Agar key takrorlansa, HTTP 409)

**8. DB struktura:**
- Prisma modeli: `Setting`
- Ustunlar:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `key`: `String`, majburiy, `@db.VarChar(255)`
  - `value`: `Json`, ixtiyoriy (`?`), `@db.Json`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Setting.companyId -> Company.id (onDelete: Cascade)`
  2. Kiruvchi: Yo'q (Boshqa modellar `Setting`ga bog'lanmagan)
- Indexes / Uniques:
  - `@@unique([companyId, key])`
  - `@@index([companyId])`

### Endpoint: GET /api/v1/settings
**Controller:** src/modules/setting/setting.controller.ts:findAll

**1. Point (yo'nalish):**
- GET /api/v1/settings
- SettingController.findAll

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@ApiBearerAuth()`
- `@Roles('superadmin', 'admin')` class-darajasida

**4. DTO:**
- `SettingQueryDto` (src/modules/setting/dto/setting-query.dto.ts)
- `companyId`: `string`, `@IsOptional()`, `@IsUUID()`
- `search`: `string`, `@IsOptional()`, `@IsString()` (misol: 'attendance')
- `page`: `number`, `@IsOptional()`, `@IsInt()`, `@Min(1)` (misol: 1)
- `limit`: `number`, `@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Max(100)` (misol: 10)

**5. Service:**
- `SettingService.findAll` (src/modules/setting/setting.service.ts)
- Sozlamalarni filter (search `key` bo'yicha) va kompaniya doirasida (`companyId`) paginatsiya bilan qaytaradi.

**6. Response:**
- Paginatsiya obyekti:
  - `items`: `Setting` qatorlari massivi
  - `total`: `number`
  - `page`: `number`
  - `limit`: `number`
  - `totalPages`: `number`

**7. Error case:**
- Xatoliklar tashlanmaydi (Faqat validatsiya xatolari bo'lishi mumkin)

**8. DB struktura:**
- Prisma modeli: `Setting`
- Ustunlar:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `key`: `String`, majburiy, `@db.VarChar(255)`
  - `value`: `Json`, ixtiyoriy (`?`), `@db.Json`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Setting.companyId -> Company.id (onDelete: Cascade)`
  2. Kiruvchi: Yo'q
- Indexes / Uniques:
  - `@@unique([companyId, key])`
  - `@@index([companyId])`

### Endpoint: GET /api/v1/settings/:id
**Controller:** src/modules/setting/setting.controller.ts:findOne

**1. Point (yo'nalish):**
- GET /api/v1/settings/:id
- SettingController.findOne

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@ApiBearerAuth()`
- `@Roles('superadmin', 'admin')` class-darajasida

**4. DTO:**
- Request body DTO yo'q, URL param `id`: `string`, `ParseUUIDPipe` bilan tasdiqlanadi.

**5. Service:**
- `SettingService.findOne` (src/modules/setting/setting.service.ts)
- Berilgan ID ga ko'ra sozlamani qidiradi va joriy foydalanuvchining ko'rish huquqini (scope) tekshiradi.

**6. Response:**
- `Setting` obyekti:
  - `id`: `String`
  - `companyId`: `String`
  - `key`: `String`
  - `value`: `Json` (yoki `null`)
  - `createdAt`: `DateTime`
  - `updatedAt`: `DateTime`

**7. Error case:**
- `NotFoundException`: "Setting not found" (Agar sozlama topilmasa, HTTP 404)
- (Yashirin xatolik) `ForbiddenException` ruxsat etilmagan scope xatoligi (`assertWithinScope` orqali chiqishi mumkin)

**8. DB struktura:**
- Prisma modeli: `Setting`
- Ustunlar:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `key`: `String`, majburiy, `@db.VarChar(255)`
  - `value`: `Json`, ixtiyoriy (`?`), `@db.Json`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Setting.companyId -> Company.id (onDelete: Cascade)`
  2. Kiruvchi: Yo'q
- Indexes / Uniques:
  - `@@unique([companyId, key])`
  - `@@index([companyId])`

### Endpoint: PATCH /api/v1/settings/:id
**Controller:** src/modules/setting/setting.controller.ts:update

**1. Point (yo'nalish):**
- PATCH /api/v1/settings/:id
- SettingController.update

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `key`: attendance_kpi_template
- `value`: { "latePenaltyPerMinute": 1000 }

**3. Guard:**
- `@ApiBearerAuth()`
- `@Roles('superadmin', 'admin')` class-darajasida

**4. DTO:**
- `UpdateSettingDto` (src/modules/setting/dto/update-setting.dto.ts) -> `PartialType(CreateSettingDto)`
- `companyId`: `string`, `@IsOptional()`, `@IsUUID()`
- `key`: `string`, `@IsOptional()`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- `value`: `Record<string, unknown>`, `@IsOptional()`, `@IsObject()`

**5. Service:**
- `SettingService.update` (src/modules/setting/setting.service.ts)
- Sozlamani id bo'yicha yangilaydi. Agar `key` yoki `companyId` o'zgarayotgan bo'lsa, ularning bazada unikalligi (`ensureUniqueKey`) va company mavjudligi (`ensureCompanyExists`) tekshiriladi.

**6. Response:**
- Yangilangan `Setting` obyekti:
  - `id`: `String`
  - `companyId`: `String`
  - `key`: `String`
  - `value`: `Json` (yoki `null`)
  - `createdAt`: `DateTime`
  - `updatedAt`: `DateTime`

**7. Error case:**
- `NotFoundException`: "Setting not found" (Agar sozlama topilmasa, HTTP 404)
- `NotFoundException`: "Company not found" (Agar companyId yuborilgan bo'lsa va topilmasa, HTTP 404)
- `ConflictException`: "Setting key is required" (Agar key bo'sh bo'lib qolsa, HTTP 409)
- `ConflictException`: "Setting key already exists for this company" (Agar yangi key takrorlansa, HTTP 409)
- (Yashirin xatolik) `ForbiddenException` ruxsat etilmagan scope xatoligi (`assertWithinScope` orqali)

**8. DB struktura:**
- Prisma modeli: `Setting`
- Ustunlar:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `key`: `String`, majburiy, `@db.VarChar(255)`
  - `value`: `Json`, ixtiyoriy (`?`), `@db.Json`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Setting.companyId -> Company.id (onDelete: Cascade)`
  2. Kiruvchi: Yo'q
- Indexes / Uniques:
  - `@@unique([companyId, key])`
  - `@@index([companyId])`

### Endpoint: DELETE /api/v1/settings/:id
**Controller:** src/modules/setting/setting.controller.ts:delete

**1. Point (yo'nalish):**
- DELETE /api/v1/settings/:id
- SettingController.delete

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@ApiBearerAuth()`
- `@Roles('superadmin', 'admin')` class-darajasida

**4. DTO:**
- Request body DTO yo'q, URL param `id`: `string`, `ParseUUIDPipe` bilan tasdiqlanadi.

**5. Service:**
- `SettingService.delete` (src/modules/setting/setting.service.ts)
- Sozlamani id bo'yicha qidirib, foydalanuvchi scope-da ekanligini tekshiradi va bazadan o'chirib yuboradi.

**6. Response:**
- Ob'ekt qaytariladi: `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException`: "Setting not found" (Agar sozlama topilmasa, HTTP 404)
- (Yashirin xatolik) `ForbiddenException` ruxsat etilmagan scope xatoligi (`assertWithinScope` orqali)

**8. DB struktura:**
- Prisma modeli: `Setting`
- Ustunlar:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `key`: `String`, majburiy, `@db.VarChar(255)`
  - `value`: `Json`, ixtiyoriy (`?`), `@db.Json`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Setting.companyId -> Company.id (onDelete: Cascade)`
  2. Kiruvchi: Yo'q
- Indexes / Uniques:
  - `@@unique([companyId, key])`
  - `@@index([companyId])`
