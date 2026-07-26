### Endpoint: POST /api/v1/positions
**Controller:** src/modules/position/position.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/positions`
- Controller class + method nomi: `PositionController.create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
companyId: 'uuid-company-id'
departmentId: 'uuid-department-id'
name: 'Backend Developer'

**3. Guard:**
- Qo'llangan guard'lar: Metodda emas, Controller darajasida `@ApiBearerAuth()` va `@Roles(...)` qo'llangan.
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi: `CreatePositionDto` (`src/modules/position/dto/create-position.dto.ts`)
- Maydonlar:
  - `companyId`: string, `@IsOptional()`, `@IsUUID()`
  - `departmentId`: string, `@IsOptional()`, `@IsUUID()`
  - `name`: string, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`

**5. Service:**
- Chaqirilayotgan service method nomi: `PositionService.create` (`src/modules/position/position.service.ts`)
- Mantiq: Foydalanuvchi roli asosida (masalan manager uchun majburiy departmentId tekshiruvi bilan) ruxsatlarni aniqlaydi. Ko'rsatilgan nom, kompaniya va departament bo'yicha unikallikni ta'minlaydi va yangi `Position` yozuvini yaratadi.

**6. Response:**
- Qaytariladigan javob shakli: Yaratilgan `Position` obyekti. (Maydonlari: `id` (String), `companyId` (String), `departmentId` (String?), `name` (String), `isActive` (Boolean), `createdAt` (DateTime), `updatedAt` (DateTime)).

**7. Error case:**
- `NotFoundException`: 'Company not found' yoki 'Department not found'
- `ForbiddenException`: 'departmentId is required to create a position within your branch' yoki "You cannot access another branch's department"
- `ConflictException`: 'Department does not belong to the selected company', 'Position name already exists for this company and department', yoki 'Position name is required'

**8. DB struktura:**
- Prisma modeli: `Position`
- Maydonlar ta'rifi:
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `departmentId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi (bu model → boshqa model):
     - `Company`: `fields: [companyId]`, `references: [id]`, `onDelete: Cascade`
     - `Department`: `fields: [departmentId]`, `references: [id]`, `onDelete: SetNull`
  2. Kiruvchi (boshqa modellar → bu model):
     - `User.positionId -> Position.id (onDelete: SetNull)`
- Tegishli indekslar:
  - `@@unique([companyId, departmentId, name])`
  - `@@index([companyId])`
  - `@@index([departmentId])`
  - `@@index([isActive])`

---

### Endpoint: GET /api/v1/positions
**Controller:** src/modules/position/position.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/positions`
- Controller class + method nomi: `PositionController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q. Qidiruv parametrlari uchun misollar (Query DTO):
search: 'developer'
isActive: true
page: 1
limit: 10
companyId: misol yo'q
departmentId: misol yo'q

**3. Guard:**
- Qo'llangan guard'lar: Controller darajasida `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi: `PositionQueryDto` (`src/modules/position/dto/position-query.dto.ts`)
- Maydonlar:
  - `companyId`: string, `@IsOptional()`, `@IsUUID()`
  - `departmentId`: string, `@IsOptional()`, `@IsUUID()`
  - `search`: string, `@IsOptional()`, `@IsString()`
  - `isActive`: boolean, `@IsOptional()`, `@IsBoolean()`, `@Transform` qilingan
  - `page`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
  - `limit`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Chaqirilayotgan service method nomi: `PositionService.findAll` (`src/modules/position/position.service.ts`)
- Mantiq: Foydalanuvchining filiali va kompaniyasini inobatga olgan holda ro'yxatni filtrlaydi. Qidiruv kalit so'zi (`search`) va `isActive` bo'yicha filterlarni qo'llaydi, hamda ma'lumotlarni paginatsiya (skip, take) qilib qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli: Paginatsiya obyekti.
  - `items`: `Position` obyektlari massivi
  - `total`: jami soni (Int)
  - `page`: joriy sahifa (Int)
  - `limit`: sahifa sig'imi (Int)
  - `totalPages`: jami sahifalar soni (Int)

**7. Error case:**
- Validatsiya (class-validator) xatolaridan tashqari to'g'ridan-to'g'ri exceptionlar tashlanmaydi, lekin guard'lar tomonidan ruxsat berilmagan xatolar (Forbidden) ehtimoli mavjud.

**8. DB struktura:**
- Prisma modeli: `Position`
- Maydonlar ta'rifi: (yuqoridagi kabi, barcha qidiriladigan va qaytadigan maydonlar `Position` modeliga tegishli).
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `departmentId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Company` (Cascade), `Department` (SetNull)
  2. Kiruvchi: `User.positionId -> Position.id (onDelete: SetNull)`
- Tegishli indekslar: `@@index([companyId])`, `@@index([departmentId])`, `@@index([isActive])`, hamda qidiruv uchun qulaylik.

---

### Endpoint: GET /api/v1/positions/:id
**Controller:** src/modules/position/position.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/positions/:id`
- Controller class + method nomi: `PositionController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q. Param: `id` (UUID)

**3. Guard:**
- Qo'llangan guard'lar: Controller darajasida `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: Alohida DTO klassi yo'q, `ParseUUIDPipe` orqali id qabul qilinadi.

**5. Service:**
- Chaqirilayotgan service method nomi: `PositionService.findOne` (`src/modules/position/position.service.ts`)
- Mantiq: Berilgan ID asosida bazadan pozitsiyani izlaydi. Foydalanuvchining tegishli kompaniya va filialga doir ma'lumotlarini tekshiradi (manager faqat o'z filialidagi pozitsiyalarni ko'ra oladi).

**6. Response:**
- Qaytariladigan javob shakli: Topilgan `Position` obyekti (faqat bitta).

**7. Error case:**
- `NotFoundException`: 'Position not found' (agar topilmasa)
- `ForbiddenException`: 'You cannot access a position outside your branch' yoki "You cannot access another branch's data" (manager o'z vakolatidan chetga chiqsa). Va `assertWithinScope` orqali umuman kompaniyaga kirish ruxsati tekshiriladi.

**8. DB struktura:**
- Prisma modeli: `Position`
- Maydonlar ta'rifi, Relations va Indekslar `POST` va `GET` holatlaridagi bilan aynan bir xil. (Kiruvchi relation o'chirish yoki o'zgartirish bo'lmagani uchun to'g'ridan-to'g'ri ta'sir etmaydi, lekin model ta'rifining bir qismidir).

---

### Endpoint: PATCH /api/v1/positions/:id
**Controller:** src/modules/position/position.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/positions/:id`
- Controller class + method nomi: `PositionController.update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
companyId: 'uuid-company-id' (ixtiyoriy, UpdatePositionDto orqali)
departmentId: 'uuid-department-id' (ixtiyoriy)
name: 'Backend Developer' (ixtiyoriy)

**3. Guard:**
- Qo'llangan guard'lar: Controller darajasida `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi: `UpdatePositionDto` (`src/modules/position/dto/update-position.dto.ts`) (CreatePositionDto dan meros olingan).
- Maydonlar: Barcha maydonlar (`companyId`, `departmentId`, `name`) `PartialType` bo'lgani uchun ixtiyoriy hisoblanadi.

**5. Service:**
- Chaqirilayotgan service method nomi: `PositionService.update` (`src/modules/position/position.service.ts`)
- Mantiq: Pozitsiyani topadi va unga tegishli ruxsatlarni tekshiradi. Yuborilgan qiymatlar (masalan nom o'zgarganda) asosida yangi ismning kompaniya/departament miqyosida ochiq (band emasligini) tekshiradi va pozitsiyani yangilaydi.

**6. Response:**
- Qaytariladigan javob shakli: Yangilangan `Position` obyekti.

**7. Error case:**
- `NotFoundException`: 'Position not found' yoki 'Company not found' yoki 'Department not found'
- `ForbiddenException`: 'departmentId is required to keep a position within your branch', yoki ruxsat qilinmagan hududdagi ma'lumotga kirishda
- `ConflictException`: 'Position name already exists for this company and department', 'Position name is required', 'Department does not belong to the selected company'

**8. DB struktura:**
- Prisma modeli: `Position`
- Maydonlar ta'rifi: (Oldingi endpointlar bilan aynan bir xil).
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `departmentId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi: `Company` (Cascade), `Department` (SetNull)
  2. Kiruvchi: `User.positionId -> Position.id (onDelete: SetNull)`
- Tegishli indekslar: `@@unique([companyId, departmentId, name])` (tahrirlashda nom takroriyligi shu orqali baholanadi).

---

### Endpoint: PATCH /api/v1/positions/:id/toggle-status
**Controller:** src/modules/position/position.controller.ts:toggleStatus

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/positions/:id/toggle-status`
- Controller class + method nomi: `PositionController.toggleStatus`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
isActive: false

**3. Guard:**
- Qo'llangan guard'lar: Controller darajasida `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO class nomi: `TogglePositionStatusDto` (`src/modules/position/dto/toggle-position-status.dto.ts`)
- Maydonlar:
  - `isActive`: boolean, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- Chaqirilayotgan service method nomi: `PositionService.toggleStatus` (`src/modules/position/position.service.ts`)
- Mantiq: Pozitsiyaning mavjud holatini tekshiradi, ruxsatlari mos bo'lsa `isActive` qiymatini kiritilgan holatga (yoki teskarisiga) o'zgartiradi va saqlaydi.

**6. Response:**
- Qaytariladigan javob shakli: Yangilangan `Position` obyekti (o'zgartirilgan `isActive` statusi bilan).

**7. Error case:**
- `NotFoundException`: 'Position not found'
- `ForbiddenException`: O'z filialidan/vakolatidan tashqaridagi ma'lumotga ta'sir qilishda.

**8. DB struktura:**
- Prisma modeli: `Position`
- Maydonlar ta'rifi: Asosan `isActive` maydoniga yoziladi.
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - boshqalari: (yuqoridagi kabi)
- Relations / references: (yuqoridagi kabi).
- Tegishli indekslar: `@@index([isActive])`

---

### Endpoint: DELETE /api/v1/positions/:id
**Controller:** src/modules/position/position.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/positions/:id`
- Controller class + method nomi: `PositionController.delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q.

**3. Guard:**
- Qo'llangan guard'lar: Controller darajasida `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: Alohida DTO klassi yo'q, faqat ID parametr `ParseUUIDPipe` orqali yuboriladi.

**5. Service:**
- Chaqirilayotgan service method nomi: `PositionService.delete` (`src/modules/position/position.service.ts`)
- Mantiq: Pozitsiya obyektini avval izlab topib (va foydalanuvchining unga ruxsati borligiga ishonch hosil qilib), undan so'ng bazadan o'chiradi.

**6. Response:**
- Qaytariladigan javob shakli: Muvaffaqiyat (success obyekti): `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException`: 'Position not found'
- `ForbiddenException`: "You cannot access another branch's data" (ruxsati bo'lmagan branch).

**8. DB struktura:**
- Prisma modeli: `Position`
- Maydonlar ta'rifi: Barcha maydonlar o'chib ketadi (id: String...).
  - `id`: `String`, majburiy, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `departmentId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `isActive`: `Boolean`, majburiy, `@default(true)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  1. Chiquvchi (bu model → boshqa model):
     - `Company`: `fields: [companyId]`, `references: [id]`, `onDelete: Cascade`
     - `Department`: `fields: [departmentId]`, `references: [id]`, `onDelete: SetNull`
  2. Kiruvchi (boshqa modellar → bu model) — MAJBURIY o'chirish harakati natijasi:
     - `User.positionId -> Position.id (onDelete: SetNull)`
       (Bu degani: Position o'chirilganda, shu pozitsiyada ishlagan foydalanuvchilar (`User`) o'chib ketmaydi, faqatgina ularning `positionId` maydoni `NULL` qiymat qabul qiladi.)
- Tegishli indekslar: Unikallik uchun bo'lgan barcha indekslar.
