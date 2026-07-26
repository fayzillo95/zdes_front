### Endpoint: POST /api/v1/companies
**Controller:** src/modules/company/company.controller.ts:create

**1. Point (yo'nalish):**
- POST /api/v1/companies
- Controller class: CompanyController, method: create

**2. ApiBody / Misollar (Swagger example qiymatlar):**
name: 'ZDES'
legalName: 'ZDES LLC'
phone: '+998901234567'
email: 'info@zdes.uz'
address: 'Tashkent city, Yunusobod district'
logoUrl: 'https://cdn.example.com/logos/zdes.png'

**3. Guard:**
- Class darajasida: `@Roles('superadmin')` (faqat superadmin ruxsat etilgan)
- Hech qanday `@Public()` qo'llanilmagan.

**4. DTO:**
- CreateCompanyDto (src/modules/company/dto/create-company.dto.ts)
- name: string, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- legalName: string, `@IsOptional()`, `@IsString()`, `@MaxLength(255)`
- phone: string, `@IsOptional()`, `@IsString()`, `@MaxLength(50)`
- email: string, `@IsOptional()`, `@IsEmail()`, `@MaxLength(255)`
- address: string, `@IsOptional()`, `@IsString()`, `@MaxLength(500)`
- logoUrl: string, `@IsOptional()`, `@IsString()`, `@MaxLength(500)`

**5. Service:**
- CompanyService:create (src/modules/company/company.service.ts)
- Kompaniya nomini (name) normalizatsiya qilib (trimToNull orqali), uning yagonaligini (unique) tekshiradi va Prisma orqali bazaga yangi kompaniya yozuvini yaratadi.

**6. Response:**
- Yaratilgan Company obyekti to'liq qaytariladi.
- id: string
- name: string
- legalName: string | null
- phone: string | null
- email: string | null
- address: string | null
- logoUrl: string | null
- isActive: boolean
- stoppedAt: Date | null
- createdAt: Date
- updatedAt: Date

**7. Error case:**
- `ConflictException`: Kompaniya nomi kiritilmagan bo'lsa ('Company name is required') yoki shu nomdagi kompaniya allaqachon mavjud bo'lsa ('Company name already exists') (409 Conflict).

**8. DB struktura:**
- Model: `Company`
- O'qiydigan/yozadigan maydonlar:
  - id: String, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - name: String, majburiy, `@unique`, `@db.VarChar(255)`
  - legalName: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - phone: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - email: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - address: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - logoUrl: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - isActive: Boolean, majburiy, `@default(true)`
  - stoppedAt: DateTime, ixtiyoriy (`?`), `@db.Timestamptz(6)`
  - createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references: Company modelida boshqa modelga ishora qiluvchi FK (`@relation(fields: [...])`) yo'q. Ammo bu boshqa modellar uchun asosiy (parent) model hisoblanadi.

---

### Endpoint: GET /api/v1/companies
**Controller:** src/modules/company/company.controller.ts:findAll

**1. Point (yo'nalish):**
- GET /api/v1/companies
- Controller class: CompanyController, method: findAll

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q.
Query parametrlari uchun misollar (CompanyQueryDto):
search: 'zdes' (misol yo'q qismidan olingan ApiPropertyOptional example)
isActive: true
page: 1
limit: 10

**3. Guard:**
- Class darajasida: `@Roles('superadmin')` (faqat superadmin ruxsat etilgan)

**4. DTO:**
- CompanyQueryDto (src/modules/company/dto/company-query.dto.ts)
- search: string, `@IsOptional()`, `@IsString()`
- isActive: boolean, `@IsOptional()`, `@Transform`, `@IsBoolean()`
- page: number = 1, `@IsOptional()`, `@Type`, `@IsInt()`, `@Min(1)`
- limit: number = 10, `@IsOptional()`, `@Type`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- CompanyService:findAll (src/modules/company/company.service.ts)
- Kompaniyalar ro'yxatini paginatsiya (page, limit) va filter (isActive, search) bilan bazadan olib beradi. `search` qidiruvi `name`, `legalName`, `phone`, va `email` bo'yicha ishlaydi.

**6. Response:**
- Paginatsiya shaklidagi ob'ekt:
  - items: Company[] (Kompaniyalar ro'yxati)
  - total: number
  - page: number
  - limit: number
  - totalPages: number

**7. Error case:**
- Maxsus biznes mantiqi xatolari yo'q. Noto'g'ri so'rov parametrlari berilsa (masalan limit = 0), 400 Bad Request validatsiya xatosi chiqishi mumkin.

**8. DB struktura:**
- Model: `Company`
- O'qiladigan maydonlar: Barcha maydonlar o'qiladi (id, name, legalName, phone, email, address, logoUrl, isActive, stoppedAt, createdAt, updatedAt). Ularning tiplari yuqoridagi Endpoint POST /api/v1/companies bo'limida keltirilganidek.
- Indekslar: 
  - `@@index([isActive])` (findAll usulida filterlash tezligi uchun ishlaydi).
- Relations / references: Hech qanday bog'lanish (FK) ishlatilmaydi.

---

### Endpoint: GET /api/v1/companies/:id
**Controller:** src/modules/company/company.controller.ts:findOne

**1. Point (yo'nalish):**
- GET /api/v1/companies/:id
- Controller class: CompanyController, method: findOne

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q.

**3. Guard:**
- Class darajasida: `@Roles('superadmin')`

**4. DTO:**
- DTO class ishlatilmagan. Parametrda `id: string` qabul qilinadi (`ParseUUIDPipe` orqali validatsiya qilinadi).

**5. Service:**
- CompanyService:findOne (src/modules/company/company.service.ts)
- Berilgan UUID yordamida bazadan aniq bitta kompaniyani qidirib topib beradi. Topilmasa exception tashlaydi.

**6. Response:**
- Bitta to'liq Company obyekti (id, name, legalName, phone, email, address, logoUrl, isActive, stoppedAt, createdAt, updatedAt) qaytariladi.

**7. Error case:**
- `NotFoundException`: Berilgan ID bo'yicha kompaniya bazadan topilmasa ('Company not found') (404 Not Found).
- 400 Bad Request: ID to'g'ri UUID formatida bo'lmasa (`ParseUUIDPipe` orqali).

**8. DB struktura:**
- Model: `Company`
- O'qiladigan maydon: `id` String, majburiy, `@default(uuid())`, `@db.Uuid`, `@id` (va kompaniyaning boshqa barcha maydonlari qaytariladi).
- Relations / references: Company o'zida tashqi modelga `@relation` (fields bilan) yo'q.

---

### Endpoint: PATCH /api/v1/companies/:id
**Controller:** src/modules/company/company.controller.ts:update

**1. Point (yo'nalish):**
- PATCH /api/v1/companies/:id
- Controller class: CompanyController, method: update

**2. ApiBody / Misollar (Swagger example qiymatlar):**
*(UpdateCompanyDto CreateCompanyDto'ning PartialType versiyasi bo'lgani uchun barcha misol qiymatlar o'zgarishsiz o'tadi)*
name: 'ZDES'
legalName: 'ZDES LLC'
phone: '+998901234567'
email: 'info@zdes.uz'
address: 'Tashkent city, Yunusobod district'
logoUrl: 'https://cdn.example.com/logos/zdes.png'

**3. Guard:**
- Class darajasida: `@Roles('superadmin')`

**4. DTO:**
- UpdateCompanyDto (src/modules/company/dto/update-company.dto.ts)
- PartialType(CreateCompanyDto) (barcha name, legalName, phone, email, address, logoUrl maydonlari ixtiyoriy holatda).

**5. Service:**
- CompanyService:update (src/modules/company/company.service.ts)
- Kompaniyani ID orqali qidirib topadi, yuborilgan yangi maydonlarni (agar mavjud bo'lsa) normalizatsiya qilib bazada yangilaydi. `name` yuborilgan bo'lsa boshqa kompaniyalar ismlari bilan to'qnashmasligini tekshiradi.

**6. Response:**
- Yangilangan Company obyekti to'liq qaytariladi.

**7. Error case:**
- `NotFoundException`: Kompaniya topilmasa ('Company not found') (404 Not Found).
- `ConflictException`: Yangi uzatilgan `name` boshqa kompaniyada allaqachon mavjud bo'lsa ('Company name already exists') (409 Conflict).

**8. DB struktura:**
- Model: `Company`
- Yoziladigan (o'zgartirilishi mumkin bo'lgan) maydonlar:
  - id: String, majburiy, `@default(uuid())`, `@db.Uuid`, `@id` (qidiruv uchun)
  - name: String, majburiy, `@unique`, `@db.VarChar(255)`
  - legalName: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - phone: String, ixtiyoriy (`?`), `@db.VarChar(50)`
  - email: String, ixtiyoriy (`?`), `@db.VarChar(255)`
  - address: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - logoUrl: String, ixtiyoriy (`?`), `@db.VarChar(500)`
  - updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references: FK bog'lanish ishlatilmaydi.

---

### Endpoint: PATCH /api/v1/companies/:id/toggle-status
**Controller:** src/modules/company/company.controller.ts:toggleStatus

**1. Point (yo'nalish):**
- PATCH /api/v1/companies/:id/toggle-status
- Controller class: CompanyController, method: toggleStatus

**2. ApiBody / Misollar (Swagger example qiymatlar):**
isActive: false

**3. Guard:**
- Class darajasida: `@Roles('superadmin')`

**4. DTO:**
- ToggleCompanyStatusDto (src/modules/company/dto/toggle-company-status.dto.ts)
- isActive: boolean, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- CompanyService:toggleStatus (src/modules/company/company.service.ts)
- Kompaniyaning holatini faol yoki nofaol holatga o'tkazadi (isActive). Agar isActive=false qilinsa, qo'shimcha tarzda `stoppedAt` maydoniga hozirgi vaqtni yozib qo'yadi.

**6. Response:**
- Holati o'zgargan (yangilangan) Company obyekti qaytariladi.

**7. Error case:**
- `NotFoundException`: Kompaniya topilmasa (404 Not Found).

**8. DB struktura:**
- Model: `Company`
- O'qiydigan va yozadigan maydonlar:
  - id: String, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
  - isActive: Boolean, majburiy, `@default(true)`
  - stoppedAt: DateTime, ixtiyoriy (`?`), `@db.Timestamptz(6)`
  - updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Indekslar: `@@index([isActive])` (holati bo'yicha filterlarni tezlatish uchun yozilgan).

---

### Endpoint: DELETE /api/v1/companies/:id
**Controller:** src/modules/company/company.controller.ts:delete

**1. Point (yo'nalish):**
- DELETE /api/v1/companies/:id
- Controller class: CompanyController, method: delete

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q.

**3. Guard:**
- Class darajasida: `@Roles('superadmin')`

**4. DTO:**
- DTO yo'q. Parametrda id: string (`ParseUUIDPipe`).

**5. Service:**
- CompanyService:delete (src/modules/company/company.service.ts)
- Kompaniyaning mavjudligini ID orqali tekshiradi va topilsa bazadan o'chiradi.

**6. Response:**
- O'chirilganligini tasdiqlovchi ob'ekt: `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException`: Kompaniya topilmasa ('Company not found') (404 Not Found).

**8. DB struktura:**
- Model: `Company`
- O'chiriladigan asosiy yozuv ID si qidiriladi:
  - id: String, majburiy, `@default(uuid())`, `@db.Uuid`, `@id`
- **Relations / references:** (O'chirish operatsiyasida Company'ga qaram bo'lgan jadvallar to'liq ta'sir qiladi, chunki ular quyidagicha bog'langan):
  - `Branch.companyId -> Company.id (onDelete: Cascade)`
  - `Department.companyId -> Company.id (onDelete: Cascade)`
  - `Position.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `Terminal.companyId -> Company.id (onDelete: Cascade)`
  - `Attendance.companyId -> Company.id (onDelete: Cascade)`
  - `RawAttendanceLog.companyId -> Company.id (onDelete: Cascade)`
  - `SalaryAdjustment.companyId -> Company.id (onDelete: Cascade)`
  - `Advance.companyId -> Company.id (onDelete: Cascade)`
  - `Holiday.companyId -> Company.id (onDelete: Cascade)`
  - `EmployeeLeave.companyId -> Company.id (onDelete: Cascade)`
  - `Payroll.companyId -> Company.id (onDelete: Cascade)`
  - `Setting.companyId -> Company.id (onDelete: Cascade)`
  - `User.companyId -> Company.id (onDelete: SetNull)`
  (Bu degani kompaniya o'chganda User'larda companyId NULL bo'ladi, boshqa barcha bog'langan ma'lumotlar esa zanjirli tarzda to'liq o'chib ketadi.)
