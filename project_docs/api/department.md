# Department modulini backend tahlili

### Endpoint: POST /api/v1/departments
**Controller:** `zdes_backend/src/modules/department/department.controller.ts` : `create`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/departments`
- Controller class + method nomi: `DepartmentController.create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `branchId`: misol yo'q
- `name`: `HR`

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)
- `@ApiBearerAuth()` / AccessTokenGuard (Controller darajasida)

**4. DTO:**
- Request DTO: `CreateDepartmentDto` (`zdes_backend/src/modules/department/dto/create-department.dto.ts`)
- Har bir maydon:
  - `companyId`: `string`, `@IsOptional()`, `@IsUUID()`
  - `branchId`: `string | null`, `@IsOptional()`, `@IsUUID()`
  - `name`: `string`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`

**5. Service:**
- Method: `DepartmentService.create` (`zdes_backend/src/modules/department/department.service.ts`)
- Mantiq: Actor'ning ruxsat doirasi (scope) hamda tegishli company va branch mavjudligini tekshiradi. Ushbu nomdagi bo'lim allaqachon mavjud bo'lmasa, `Department` jadvaliga yangi yozuv (bo'lim) qo'shadi.

**6. Response:**
- Qaytariladigan javob: Yaratilgan `Department` obyekti (maydonlari: `id`, `companyId`, `branchId`, `name`, `isActive`, `createdAt`, `updatedAt`).

**7. Error case:**
- `NotFoundException`: Kiritilgan `companyId` yoki `branchId` topilmasa.
- `ConflictException`: Branch ushbu company'ga tegishli bo'lmasa, yoki xuddi shunday `name` bo'lgan bo'lim ushbu filial/kompaniyada allaqachon mavjud bo'lsa, yoxud `name` faqat bo'sh joylardan iborat bo'lsa.
- `ForbiddenException`: Obyekt yaratish ruxsat doirasidan (scope) tashqarida bo'lsa.

**8. DB struktura:**
- Prisma modeli: `Department` (`prisma/schema.prisma` dan)
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `company -> Company.id (onDelete: Cascade)` (fields: `[companyId]`)
  - `branch -> Branch.id (onDelete: SetNull)` (fields: `[branchId]`)
- Relations / references (Kiruvchi):
  - `Position.departmentId -> Department.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
- Indexes:
  - `@@unique([companyId, branchId, name])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([isActive])`

---

### Endpoint: GET /api/v1/departments
**Controller:** `zdes_backend/src/modules/department/department.controller.ts` : `findAll`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/departments`
- Controller class + method nomi: `DepartmentController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q. (Query parametrlari uchun misollar: `search`: `hr`, `isActive`: `true`, `page`: `1`, `limit`: `10`)

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)
- `@ApiBearerAuth()` / AccessTokenGuard (Controller darajasida)

**4. DTO:**
- Request DTO (Query): `DepartmentQueryDto` (`zdes_backend/src/modules/department/dto/department-query.dto.ts`)
- Har bir maydon:
  - `companyId`: `string`, `@IsOptional()`, `@IsUUID()`
  - `branchId`: `string`, `@IsOptional()`, `@IsUUID()`
  - `search`: `string`, `@IsOptional()`, `@IsString()`
  - `isActive`: `boolean`, `@IsOptional()`, `@Transform()`, `@IsBoolean()`
  - `page`: `number`, `@IsOptional()`, `@Type()`, `@IsInt()`, `@Min(1)`
  - `limit`: `number`, `@IsOptional()`, `@Type()`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Method: `DepartmentService.findAll` (`zdes_backend/src/modules/department/department.service.ts`)
- Mantiq: Foydalanuvchining ruxsat darajasiga qarab (scope) va filterlarga (`companyId`, `branchId`, `search`, `isActive`) mos keluvchi bo'limlar ro'yxatini va umumiy sonini ma'lumotlar bazasidan paginatsiya shaklida qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli (paginatsiya): `{ items: Department[], total: number, page: number, limit: number, totalPages: number }`

**7. Error case:**
- `ForbiddenException`: Scope yoki rol doirasida muammo bo'lsa (Access Token / Role).

**8. DB struktura:**
- Prisma modeli: `Department`
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `company -> Company.id (onDelete: Cascade)`
  - `branch -> Branch.id (onDelete: SetNull)`
- Relations / references (Kiruvchi):
  - `Position.departmentId -> Department.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
- Indexes:
  - `@@unique([companyId, branchId, name])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([isActive])` (Filter/search operatsiyalariga ta'sir qiluvchi indekslar)

---

### Endpoint: GET /api/v1/departments/:id
**Controller:** `zdes_backend/src/modules/department/department.controller.ts` : `findOne`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/departments/:id`
- Controller class + method nomi: `DepartmentController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q.

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)
- `@ApiBearerAuth()` / AccessTokenGuard (Controller darajasida)

**4. DTO:**
- Request DTO: Yo'q (Faqat Param orqali `id`, `ParseUUIDPipe` bilan olinadi).

**5. Service:**
- Method: `DepartmentService.findOne` (`zdes_backend/src/modules/department/department.service.ts`)
- Mantiq: Berilgan UUID bo'yicha bo'limni ma'lumotlar bazasidan qidiradi, va so'rovchi ushbu bo'limni o'qishga (scope) haqli ekanini tasdiqlab, obyektni qaytaradi.

**6. Response:**
- Qaytariladigan javob: Topilgan `Department` obyekti.

**7. Error case:**
- `NotFoundException`: Berilgan ID bo'yicha bo'lim topilmasa.
- `ForbiddenException`: Topilgan bo'limga kirish actor'ning ruxsat doirasidan (scope) chetda bo'lsa.

**8. DB struktura:**
- Prisma modeli: `Department`
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `company -> Company.id (onDelete: Cascade)`
  - `branch -> Branch.id (onDelete: SetNull)`
- Relations / references (Kiruvchi):
  - `Position.departmentId -> Department.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
- Indexes:
  - `@@unique([companyId, branchId, name])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/departments/:id
**Controller:** `zdes_backend/src/modules/department/department.controller.ts` : `update`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/departments/:id`
- Controller class + method nomi: `DepartmentController.update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `branchId`: misol yo'q
- `name`: `HR`

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)
- `@ApiBearerAuth()` / AccessTokenGuard (Controller darajasida)

**4. DTO:**
- Request DTO: `UpdateDepartmentDto` (`zdes_backend/src/modules/department/dto/update-department.dto.ts`, `PartialType` bilan)
- Har bir maydon (barchasi ixtiyoriy):
  - `companyId`: `string`, `@IsOptional()`, `@IsUUID()`
  - `branchId`: `string | null`, `@IsOptional()`, `@IsUUID()`
  - `name`: `string`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`

**5. Service:**
- Method: `DepartmentService.update` (`zdes_backend/src/modules/department/department.service.ts`)
- Mantiq: Mavjud bo'limni tekshiradi, o'zgartirish doirasini ruxsat asosida tahlil qiladi (scope) va kiritilgan yangi ma'lumotlarni tekshirib (`name` va h.k.), `Department` obyektini bazada yangilaydi.

**6. Response:**
- Qaytariladigan javob: Yangilangan `Department` obyekti.

**7. Error case:**
- `NotFoundException`: Berilgan ID bo'yicha bo'lim yoxud bog'langan yangi kompaniya topilmasa.
- `ConflictException`: Yangi `name` bazada takrorlansa (aynan shu kompaniya va filial ichida) yoki filial kompaniyaga tegishli bo'lmasa.
- `ForbiddenException`: Obyekt o'zgartirish ruxsat doirasidan tashqarida bo'lsa.

**8. DB struktura:**
- Prisma modeli: `Department`
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `company -> Company.id (onDelete: Cascade)`
  - `branch -> Branch.id (onDelete: SetNull)`
- Relations / references (Kiruvchi):
  - `Position.departmentId -> Department.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
- Indexes:
  - `@@unique([companyId, branchId, name])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/departments/:id/toggle-status
**Controller:** `zdes_backend/src/modules/department/department.controller.ts` : `toggleStatus`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/departments/:id/toggle-status`
- Controller class + method nomi: `DepartmentController.toggleStatus`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `isActive`: `false`

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)
- `@ApiBearerAuth()` / AccessTokenGuard (Controller darajasida)

**4. DTO:**
- Request DTO: `ToggleDepartmentStatusDto` (`zdes_backend/src/modules/department/dto/toggle-department-status.dto.ts`)
- Har bir maydon:
  - `isActive`: `boolean`, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- Method: `DepartmentService.toggleStatus` (`zdes_backend/src/modules/department/department.service.ts`)
- Mantiq: Bo'lim holatini (`isActive`) agarda parametrda uzatilgan bo'lsa shunga, aks holda esa bazadagi teskari holatga (`!department.isActive`) o'zgartiradi.

**6. Response:**
- Qaytariladigan javob: Yangilangan holatdagi `Department` obyekti.

**7. Error case:**
- `NotFoundException`: Berilgan ID bo'yicha bo'lim topilmasa.
- `ForbiddenException`: Obyekt o'zgartirish ruxsat doirasidan tashqarida bo'lsa.

**8. DB struktura:**
- Prisma modeli: `Department`
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `company -> Company.id (onDelete: Cascade)`
  - `branch -> Branch.id (onDelete: SetNull)`
- Relations / references (Kiruvchi):
  - `Position.departmentId -> Department.id (onDelete: SetNull)`
  - `User.departmentId -> Department.id (onDelete: SetNull)`
- Indexes:
  - `@@unique([companyId, branchId, name])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([isActive])` (Aynan shu jarayon shu ustun bilan ishlaydi)

---

### Endpoint: DELETE /api/v1/departments/:id
**Controller:** `zdes_backend/src/modules/department/department.controller.ts` : `delete`

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/departments/:id`
- Controller class + method nomi: `DepartmentController.delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q.

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (Controller darajasida)
- `@ApiBearerAuth()` / AccessTokenGuard (Controller darajasida)

**4. DTO:**
- Request DTO: Yo'q (Param orqali `id` `ParseUUIDPipe` yordamida olinadi).

**5. Service:**
- Method: `DepartmentService.delete` (`zdes_backend/src/modules/department/department.service.ts`)
- Mantiq: Bo'limni bazadan qidirib, agar topsa va o'chirishga huquq bo'lsa (scope tekshiruvi orqali), uni butunlay o'chirib tashlaydi.

**6. Response:**
- Qaytariladigan javob: Muvaffaqiyatni bildiruvchi obyekti: `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException`: Berilgan ID bo'yicha bo'lim topilmasa.
- `ForbiddenException`: O'chiriladigan bo'lim actor'ning ruxsat doirasidan tashqarida bo'lsa.

**8. DB struktura:**
- Prisma modeli: `Department`
- Ustun ta'riflari:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references (Chiquvchi):
  - `company -> Company.id (onDelete: Cascade)`
  - `branch -> Branch.id (onDelete: SetNull)`
- Relations / references (Kiruvchi — o'chirishda ta'siri):
  - `Position.departmentId -> Department.id (onDelete: SetNull)` — Ya'ni, ushbu Department o'chirilganda unga aloqador Position'larning departmentId maydoni NULL bo'lib qoladi, jadvallar kaskad o'chmaydi.
  - `User.departmentId -> Department.id (onDelete: SetNull)` — Xuddi shunday, o'chirilgan bo'limdagi xodimlarning (User) departmentId maydoni NULL qiymatiga o'tadi.
- Indexes:
  - `@@unique([companyId, branchId, name])`
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([isActive])`
