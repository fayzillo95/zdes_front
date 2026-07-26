### Endpoint: GET /api/v1/work-schedules
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:findAll

**1. Point (yo'nalish):**
- GET /api/v1/work-schedules
- WorkScheduleController class + findAll method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida qo'llangan)

**4. DTO:**
- Request DTO: WorkScheduleQueryDto, src/modules/work-schedule/dto/work-schedule-query.dto.ts
- companyId: string, `@IsOptional()`, `@IsUUID()`
- branchId: string, `@IsOptional()`, `@IsUUID()`
- search: string, `@IsOptional()`, `@IsString()`
- isDefault: boolean, `@IsOptional()`, `@Transform(...)`, `@IsBoolean()`
- isActive: boolean, `@IsOptional()`, `@Transform(...)`, `@IsBoolean()`
- page: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- limit: number, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- findAll, src/modules/work-schedule/work-schedule.service.ts
- Kiritilgan query parametrlari va aktiyor (actor) ruxsatlariga qarab ish grafiklari ro'yxatini filtrlash va paginatsiya qilib bazadan o'qib qaytarish vazifasini bajaradi.

**6. Response:**
- Paginatsiya qilingan ob'ekt: `{ items: WorkSchedule[], total: number, page: number, limit: number, totalPages: number }` shaklida.

**7. Error case:**
- `ForbiddenException` (ruxsat bo'lmasa, Guard'dan keladi)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: GET /api/v1/work-schedules/:id
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:findOne

**1. Point (yo'nalish):**
- GET /api/v1/work-schedules/:id
- WorkScheduleController class + findOne method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Request DTO: ID parametr sifatida olinadi (`@Param('id', ParseUUIDPipe) id: string`), alohida DTO yo'q.

**5. Service:**
- findOne, src/modules/work-schedule/work-schedule.service.ts
- ID bo'yicha bazadan tegishli ish grafigini izlaydi va topilsa foydalanuvchi (actor) ko'rishga ruxsati borligini (`scope`) tekshirib qaytaradi.

**6. Response:**
- Topilgan `WorkSchedule` obyekti (paginatsiyasiz, oddiy ob'ekt).

**7. Error case:**
- `NotFoundException` (Work schedule not found)
- `ForbiddenException` yoki `UnauthorizedException` (actor ruxsati bo'lmasa)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: POST /api/v1/work-schedules
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:create

**1. Point (yo'nalish):**
- POST /api/v1/work-schedules
- WorkScheduleController class + create method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
companyId: 'uuid-company-id'
branchId: 'uuid-branch-id'
name: 'Standart ish kuni'
startTime: '09:00'
endTime: '18:00'
workDays: [1, 2, 3, 4, 5]
graceMinutes: 15
isDefault: false
userId: 'uuid-user-id'

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Request DTO: CreateWorkScheduleDto, src/modules/work-schedule/dto/create-work-schedule.dto.ts
- companyId: string, `@IsOptional()`, `@IsUUID()`
- branchId: string, `@IsOptional()`, `@IsUUID()`
- name: string, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- startTime: string, `@IsString()`, `@Matches(/^\d{2}:\d{2}$/, { message: 'startTime must be in HH:mm format' })`
- endTime: string, `@IsString()`, `@Matches(/^\d{2}:\d{2}$/, { message: 'endTime must be in HH:mm format' })`
- workDays: number[], `@IsArray()`, `@ArrayMinSize(1)`, `@ArrayMaxSize(7)`, `@IsInt({ each: true })`, `@Min(1, { each: true })`, `@Max(7, { each: true })`
- graceMinutes: number, `@IsOptional()`, `@IsInt()`, `@Min(0)`, `@Max(120)`
- isDefault: boolean, `@IsOptional()`, `@IsBoolean()`
- userId: string, `@IsOptional()`, `@IsUUID()`

**5. Service:**
- create, src/modules/work-schedule/work-schedule.service.ts
- Yangi ish grafigini (WorkSchedule) yaratadi. Kiritilgan ma'lumotlarni validatsiya qilib (kompaniya, filial, nom takrorlanmasligi), jadvallarga yozadi va agar `userId` berilgan bo'lsa, foydalanuvchiga biriktiradi.

**6. Response:**
- Yaratilgan `WorkSchedule` obyekti.

**7. Error case:**
- `NotFoundException` (Company not found, Branch not found, User not found)
- `ConflictException` (User does not belong to the selected company, Branch does not belong to the selected company, Work schedule name already exists for this company, Work schedule name is required)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/work-schedules/:id
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:update

**1. Point (yo'nalish):**
- PATCH /api/v1/work-schedules/:id
- WorkScheduleController class + update method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
companyId: 'uuid-company-id'
branchId: 'uuid-branch-id'
name: 'Standart ish kuni'
startTime: '09:00'
endTime: '18:00'
workDays: [1, 2, 3, 4, 5]
graceMinutes: 15
isDefault: false
userId: 'uuid-user-id'

*(Izoh: `UpdateWorkScheduleDto` `CreateWorkScheduleDto` dan PartialType qilib olingan, barcha fieldlar va example'lar saqlanadi.)*

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Request DTO: UpdateWorkScheduleDto, src/modules/work-schedule/dto/update-work-schedule.dto.ts
- Barcha `CreateWorkScheduleDto` maydonlari `@IsOptional()` shaklida meros olinadi.

**5. Service:**
- update, src/modules/work-schedule/work-schedule.service.ts
- Belgilangan ish grafigining maydonlarini o'zgartiradi (update). ID orqali borligini tekshiradi, agar yangi isDefault berilsa boshqalarinikini tozalaydi.

**6. Response:**
- Yangilangan `WorkSchedule` obyekti.

**7. Error case:**
- `NotFoundException` (Work schedule not found, Company not found, Branch not found)
- `ConflictException` (Branch does not belong to the selected company, Work schedule name already exists for this company, Work schedule name is required)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/work-schedules/:id/toggle-status
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:toggleStatus

**1. Point (yo'nalish):**
- PATCH /api/v1/work-schedules/:id/toggle-status
- WorkScheduleController class + toggleStatus method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
isActive: false

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Request DTO: ToggleWorkScheduleStatusDto, src/modules/work-schedule/dto/toggle-work-schedule-status.dto.ts
- isActive: boolean, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- toggleStatus, src/modules/work-schedule/work-schedule.service.ts
- Ish grafigining `isActive` holatini teskarisiga (yoki ko'rsatilgan qiymatga) o'zgartiradi.

**6. Response:**
- Yangilangan `WorkSchedule` obyekti.

**7. Error case:**
- `NotFoundException` (Work schedule not found)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/work-schedules/:id/set-default
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:setDefault

**1. Point (yo'nalish):**
- PATCH /api/v1/work-schedules/:id/set-default
- WorkScheduleController class + setDefault method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Body qabul qilmaydi. ID parametrdan (ParseUUIDPipe) olinadi.

**5. Service:**
- setDefault, src/modules/work-schedule/work-schedule.service.ts
- Berilgan ish grafigini standart (`isDefault = true`) qilib belgilaydi va shu kompaniyaning boshqa barcha standart grafiklarining `isDefault` qiymatini `false` qilib bekor qiladi.

**6. Response:**
- Yangilangan `WorkSchedule` obyekti (isDefault: true bilan).

**7. Error case:**
- `NotFoundException` (Work schedule not found)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/work-schedules/:id/assign-user
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:assignUser

**1. Point (yo'nalish):**
- PATCH /api/v1/work-schedules/:id/assign-user
- WorkScheduleController class + assignUser method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
userId: 'uuid-user-id'

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Request DTO: AssignUserDto, src/modules/work-schedule/dto/assign-user.dto.ts
- userId: string, `@IsUUID()`

**5. Service:**
- assignUser, src/modules/work-schedule/work-schedule.service.ts
- Berilgan jadvalni (WorkSchedule) foydalanuvchiga (User) biriktiradi. User va WorkSchedule bitta kompaniyaga tegishliligini tekshiradi, keyin `User.workScheduleId` ni o'zgartiradi.

**6. Response:**
- Yangilangan `User` obyektining bir qismi: `{ id: string, login: string, companyId: string | null, workScheduleId: string | null }`

**7. Error case:**
- `NotFoundException` (Work schedule not found, User not found)
- `ConflictException` (Work schedule does not belong to the user's company)

**8. DB struktura:**
- Model: `WorkSchedule` va `User` ga ta'sir qiladi.
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: PATCH /api/v1/work-schedules/:id/unassign-user
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:unassignUser

**1. Point (yo'nalish):**
- PATCH /api/v1/work-schedules/:id/unassign-user
- WorkScheduleController class + unassignUser method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
userId: 'uuid-user-id'

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Request DTO: AssignUserDto, src/modules/work-schedule/dto/assign-user.dto.ts
- userId: string, `@IsUUID()`

**5. Service:**
- unassignUser, src/modules/work-schedule/work-schedule.service.ts
- Foydalanuvchidan (User) berilgan ish grafigini (WorkSchedule) olib tashlaydi (`User.workScheduleId` ni null ga aylantiradi).

**6. Response:**
- Yangilangan `User` obyektining bir qismi: `{ id: string, login: string, companyId: string | null, workScheduleId: string | null }`

**7. Error case:**
- `NotFoundException` (Work schedule not found, User not found)

**8. DB struktura:**
- Model: `WorkSchedule` va `User` (asosan User modifikatsiya qilinadi).
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)`
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`

---

### Endpoint: DELETE /api/v1/work-schedules/:id
**Controller:** src/modules/work-schedule/work-schedule.controller.ts:delete

**1. Point (yo'nalish):**
- DELETE /api/v1/work-schedules/:id
- WorkScheduleController class + delete method

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- `@Roles('superadmin', 'admin')` (class darajasida)

**4. DTO:**
- Body DTO yo'q. Faqat ID (ParseUUIDPipe).

**5. Service:**
- delete, src/modules/work-schedule/work-schedule.service.ts
- Ish grafigini bazadan butunlay o'chirib yuboradi (`delete`).

**6. Response:**
- Ob'ekt: `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException` (Work schedule not found)

**8. DB struktura:**
- Model: `WorkSchedule`
- id: String, majburiy, `@default(uuid())`, `@db.Uuid`
- companyId: String, majburiy, `@db.Uuid`
- branchId: String, ixtiyoriy (`?`), `@db.Uuid`
- name: String, majburiy, `@db.VarChar(255)`
- startTime: String, majburiy, `@db.VarChar(10)`
- endTime: String, majburiy, `@db.VarChar(10)`
- workDays: Json, majburiy, `@db.Json`
- graceMinutes: Int, majburiy, `@default(0)`
- isDefault: Boolean, majburiy, `@default(false)`
- isActive: Boolean, majburiy, `@default(true)`
- createdAt: DateTime, majburiy, `@default(now())`, `@db.Timestamptz(6)`
- updatedAt: DateTime, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Chiquvchi relations:
  - `WorkSchedule.companyId -> Company.id (onDelete: Cascade)`
  - `WorkSchedule.branchId -> Branch.id (onDelete: SetNull)`
- Kiruvchi relations:
  - `User.workScheduleId -> WorkSchedule.id (onDelete: SetNull)` (o'chirilganda foydalanuvchilarning workScheduleId null bo'lib qoladi, chunki onDelete: SetNull)
- Indekslar: `@@unique([companyId, name])`, `@@index([companyId])`, `@@index([branchId])`, `@@index([isDefault])`, `@@index([isActive])`
