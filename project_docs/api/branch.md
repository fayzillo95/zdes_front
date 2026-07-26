### Endpoint: POST /api/v1/branches
**Controller:** src/modules/branch/branch.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/branches`
- Controller class + method nomi: `BranchController.create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- name: 'Main Branch'
- address: 'Tashkent city, Chilonzor district'
- latitude: 41.2995
- longitude: 69.2401
- radius: 100

**3. Guard:**
- Token talab qilinadi (`@ApiBearerAuth()` va `@CurrentUser()` dekoratorlari yordamida `AccessTokenPayload` kutiladi)
- `@Roles('superadmin', 'admin')` ruxsat etilgan.

**4. DTO:**
- Request DTO: `CreateBranchDto` (`src/modules/branch/dto/create-branch.dto.ts`)
- `companyId`: string, `@IsOptional()`, `@IsUUID()`
- `name`: string, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- `address`: string, `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
- `latitude`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsLatitude()`
- `longitude`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsLongitude()`
- `radius`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`

**5. Service:**
- Service method: `BranchService.create` (`src/modules/branch/branch.service.ts`)
- Kompaniya mavjudligini va branch nomining yagonaligini tekshiradi, so'ng yangi `Branch` yozuvini yaratadi. Yozuv radiusiga default qiymat sifatida 100 olinadi (agar kiritilmagan bo'lsa).

**6. Response:**
- Yaratilgan yangi `Branch` obyekti to'liq qaytariladi.
- Maydonlar: id, companyId, name, address, latitude, longitude, radius, isActive, createdAt, updatedAt.

**7. Error case:**
- `NotFoundException` ("Company not found") - Kompaniya topilmasa.
- `ConflictException` ("Branch name is required") - Branch nomi bo'sh jo'natilganda.
- `ConflictException` ("Branch name already exists in this company") - Shu kompaniyada bu nomli branch allaqachon mavjud bo'lsa.

**8. DB struktura:**
- Model: `Branch` (va aloqador modellar)
- `id`: String, Majburiy, `@default(uuid())`, `@db.Uuid`
- `companyId`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.Uuid`
- `name`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.VarChar(255)`
- `address`: String, Ixtiyoriy (`?`), `@db.VarChar(500)`
- `latitude`: Float, Ixtiyoriy (`?`)
- `longitude`: Float, Ixtiyoriy (`?`)
- `radius`: Int, Ixtiyoriy (`?`), `@default(100)`
- `isActive`: Boolean, Majburiy, `@default(true)`
- `createdAt`: DateTime, Majburiy, `@default(now())`, `@db.Timestamptz(6)`
- `updatedAt`: DateTime, Majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- **Relations / references:**
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
- **Indexes:**
  - `@@unique([companyId, name])`
  - `@@index([companyId])`
  - `@@index([isActive])`

---

### Endpoint: GET /api/v1/branches
**Controller:** src/modules/branch/branch.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/branches`
- Controller class + method nomi: `BranchController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q. (Query parametrlar)
- companyId: misol yo'q
- search: 'main'
- isActive: true
- page: 1
- limit: 10

**3. Guard:**
- Token talab qilinadi
- `@Roles('superadmin', 'admin')` ruxsat etilgan.

**4. DTO:**
- Request DTO: `BranchQueryDto` (`src/modules/branch/dto/branch-query.dto.ts`)
- `companyId`: string, `@IsOptional()`, `@IsUUID()`
- `search`: string, `@IsOptional()`, `@IsString()`
- `isActive`: boolean, `@IsOptional()`, `@Transform`, `@IsBoolean()`
- `page`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- `limit`: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Service method: `BranchService.findAll` (`src/modules/branch/branch.service.ts`)
- DB'dan ko'rsatilgan filterlar (companyId, isActive, search) bo'yicha branch'lar ro'yxatini va jami sonini paginatsiya qilib o'qib keladi. `search` qiymati nomi va manzili bo'yicha izlanadi.

**6. Response:**
- Paginatsiya qilingan javob qaytadi:
  - `items`: Topilgan `Branch` obyektlari massivi
  - `total`: Umumiy elementlar soni (number)
  - `page`: Joriy sahifa (number)
  - `limit`: Sahifadagi limit (number)
  - `totalPages`: Jami sahifalar soni (number)

**7. Error case:**
- Alohida error tashlanmaydi (barcha query parametrlar ixtiyoriy). 

**8. DB struktura:**
- Model: `Branch` (va aloqador modellar)
- `id`: String, Majburiy, `@default(uuid())`, `@db.Uuid`
- `companyId`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.Uuid`
- `name`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.VarChar(255)`
- `address`: String, Ixtiyoriy (`?`), `@db.VarChar(500)`
- `latitude`: Float, Ixtiyoriy (`?`)
- `longitude`: Float, Ixtiyoriy (`?`)
- `radius`: Int, Ixtiyoriy (`?`), `@default(100)`
- `isActive`: Boolean, Majburiy, `@default(true)`
- `createdAt`: DateTime, Majburiy, `@default(now())`, `@db.Timestamptz(6)`
- `updatedAt`: DateTime, Majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- **Relations / references:**
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
- **Indexes:**
  - `@@unique([companyId, name])`
  - `@@index([companyId])`
  - `@@index([isActive])`

---

### Endpoint: GET /api/v1/branches/:id
**Controller:** src/modules/branch/branch.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/branches/:id`
- Controller class + method nomi: `BranchController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q.

**3. Guard:**
- Token talab qilinadi
- `@Roles('superadmin', 'admin')` ruxsat etilgan.

**4. DTO:**
- Request DTO yo'q. Faqat route param `id` (`@Param('id', ParseUUIDPipe)`).

**5. Service:**
- Service method: `BranchService.findOne` (`src/modules/branch/branch.service.ts`)
- Berilgan UUID ID si bo'yicha branch ni izlaydi, agar foydalanuvchining ko'rishga ruxsati bo'lsa (scope tekshiruvidan o'tsa) javob sifatida qaytaradi.

**6. Response:**
- Topilgan bitta `Branch` obyekti to'liq qaytariladi.
- Maydonlar: id, companyId, name, address, latitude, longitude, radius, isActive, createdAt, updatedAt.

**7. Error case:**
- `NotFoundException` ("Branch not found") - ID orqali DB dan branch topilmaganda yuzaga keladi.

**8. DB struktura:**
- Model: `Branch` (va aloqador modellar)
- `id`: String, Majburiy, `@default(uuid())`, `@db.Uuid`
- `companyId`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.Uuid`
- `name`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.VarChar(255)`
- `address`: String, Ixtiyoriy (`?`), `@db.VarChar(500)`
- `latitude`: Float, Ixtiyoriy (`?`)
- `longitude`: Float, Ixtiyoriy (`?`)
- `radius`: Int, Ixtiyoriy (`?`), `@default(100)`
- `isActive`: Boolean, Majburiy, `@default(true)`
- `createdAt`: DateTime, Majburiy, `@default(now())`, `@db.Timestamptz(6)`
- `updatedAt`: DateTime, Majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- **Relations / references:**
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
- **Indexes:**
  - `@@unique([companyId, name])`
  - `@@index([companyId])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/branches/:id
**Controller:** src/modules/branch/branch.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/branches/:id`
- Controller class + method nomi: `BranchController.update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- name: 'Main Branch'
- address: 'Tashkent city, Chilonzor district'
- latitude: 41.2995
- longitude: 69.2401
- radius: 100

**3. Guard:**
- Token talab qilinadi
- `@Roles('superadmin', 'admin')` ruxsat etilgan.

**4. DTO:**
- Request DTO: `UpdateBranchDto` (`src/modules/branch/dto/update-branch.dto.ts`)
- Barcha `CreateBranchDto` maydonlari `PartialType` orqali ixtiyoriy (optional) bo'ladi.

**5. Service:**
- Service method: `BranchService.update` (`src/modules/branch/branch.service.ts`)
- Branche borligi tekshiriladi, berilgan ixtiyoriy field'larni avvalgilariga o'zgartiradi. Agar ismi yoki kompaniyasi o'zgarsa, yangi nomning unikal ligini tekshiradi va DB da saqlaydi.

**6. Response:**
- Yangilangan `Branch` obyekti to'liq qaytariladi.
- Maydonlar: id, companyId, name, address, latitude, longitude, radius, isActive, createdAt, updatedAt.

**7. Error case:**
- `NotFoundException` ("Branch not found") - Ko'rsatilgan ID bilan branch topilmasa.
- `NotFoundException` ("Company not found") - Agar companyId o'zgartirilmoqchi bo'lsa va bu company topilmasa.
- `ConflictException` ("Branch name is required") - Branch nomiga bo'sh satr jo'natilganda.
- `ConflictException` ("Branch name already exists in this company") - Shu kompaniyada bu yangi nomli branch allaqachon mavjud bo'lsa.

**8. DB struktura:**
- Model: `Branch` (va aloqador modellar)
- `id`: String, Majburiy, `@default(uuid())`, `@db.Uuid`
- `companyId`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.Uuid`
- `name`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.VarChar(255)`
- `address`: String, Ixtiyoriy (`?`), `@db.VarChar(500)`
- `latitude`: Float, Ixtiyoriy (`?`)
- `longitude`: Float, Ixtiyoriy (`?`)
- `radius`: Int, Ixtiyoriy (`?`), `@default(100)`
- `isActive`: Boolean, Majburiy, `@default(true)`
- `createdAt`: DateTime, Majburiy, `@default(now())`, `@db.Timestamptz(6)`
- `updatedAt`: DateTime, Majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- **Relations / references:**
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
- **Indexes:**
  - `@@unique([companyId, name])`
  - `@@index([companyId])`
  - `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/branches/:id/toggle-status
**Controller:** src/modules/branch/branch.controller.ts:toggleStatus

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/branches/:id/toggle-status`
- Controller class + method nomi: `BranchController.toggleStatus`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- isActive: false

**3. Guard:**
- Token talab qilinadi
- `@Roles('superadmin', 'admin')` ruxsat etilgan.

**4. DTO:**
- Request DTO: `ToggleBranchStatusDto` (`src/modules/branch/dto/toggle-branch-status.dto.ts`)
- `isActive`: boolean, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- Service method: `BranchService.toggleStatus` (`src/modules/branch/branch.service.ts`)
- ID bo'yicha filialni oladi. Agar status berilgan bo'lsa uni o'zlashtiradi, aks holda oldingisining teskarisi qilib yangilaydi (toggle).

**6. Response:**
- Yangilangan `Branch` obyekti to'liq qaytariladi.
- Maydonlar: id, companyId, name, address, latitude, longitude, radius, isActive, createdAt, updatedAt.

**7. Error case:**
- `NotFoundException` ("Branch not found") - Ko'rsatilgan ID bilan branch topilmasa yuzaga keladi.

**8. DB struktura:**
- Model: `Branch` (va aloqador modellar)
- `id`: String, Majburiy, `@default(uuid())`, `@db.Uuid`
- `companyId`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.Uuid`
- `name`: String, Majburiy, `@@unique([companyId, name])` da qatnashadi, `@db.VarChar(255)`
- `address`: String, Ixtiyoriy (`?`), `@db.VarChar(500)`
- `latitude`: Float, Ixtiyoriy (`?`)
- `longitude`: Float, Ixtiyoriy (`?`)
- `radius`: Int, Ixtiyoriy (`?`), `@default(100)`
- `isActive`: Boolean, Majburiy, `@default(true)`
- `createdAt`: DateTime, Majburiy, `@default(now())`, `@db.Timestamptz(6)`
- `updatedAt`: DateTime, Majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- **Relations / references:**
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
- **Indexes:**
  - `@@unique([companyId, name])`
  - `@@index([companyId])`
  - `@@index([isActive])`

---

### Endpoint: DELETE /api/v1/branches/:id
**Controller:** src/modules/branch/branch.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/branches/:id`
- Controller class + method nomi: `BranchController.delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q.

**3. Guard:**
- Token talab qilinadi
- `@Roles('superadmin', 'admin')` ruxsat etilgan.

**4. DTO:**
- Request DTO yo'q. Faqat route param `id` (`@Param('id', ParseUUIDPipe)`).

**5. Service:**
- Service method: `BranchService.delete` (`src/modules/branch/branch.service.ts`)
- ID bo'yicha DB'dan filial topiladi va tekshiriladi, ruxsat bo'lsa bu filial DB dan o'chirib tashlanadi (pastdagi "Relations" bandiga qarang — bu yerda CASCADE emas, balki SetNull ustunlik qiladi, ya'ni bog'liq yozuvlar o'chmaydi, faqat `branchId` ularda NULL bo'lib qoladi).

**6. Response:**
- JSON obyekt qaytadi:
  - `success`: `true`
  - `id`: o'chirilgan filialning id qiymati (string)

**7. Error case:**
- `NotFoundException` ("Branch not found") - ID orqali branch topilmasa yuzaga keladi.

**8. DB struktura:**
- Model: `Branch` (o'chiriladigan asosiy yozuv)
- `id`: String, Majburiy, `@default(uuid())`, `@db.Uuid`
- **Relations / references — bu Branch modelining O'ZI qaysi modelga bog'liq:**
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
- **Relations / references — Branch'ga qaysi modellar BOG'LANGAN (o'chirilganda ta'sirlanadi, barchasi `onDelete: SetNull`, ya'ni CASCADE emas — bog'liq qator o'chmaydi, faqat `branchId` NULL bo'ladi):**
  - `Department.branchId -> Branch.id (onDelete: SetNull)`
  - `User.branchId -> Branch.id (onDelete: SetNull)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
  - `Terminal.branchId -> Branch.id (onDelete: SetNull)`
  - `Attendance.branchId -> Branch.id (onDelete: SetNull)`
  - `Holiday.branchId -> Branch.id (onDelete: SetNull)`
  - `EmployeeLeave.branchId -> Branch.id (onDelete: SetNull)`
- **Indexes:**
  - `@@unique([companyId, name])`
  - `@@index([companyId])`
  - `@@index([isActive])`
