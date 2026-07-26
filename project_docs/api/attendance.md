### Endpoint: GET /api/v1/attendance/kpi-template/:companyId
**Controller:** zdes_backend/src/modules/attendance/attendance.controller.ts:getKpiTemplate

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/attendance/kpi-template/:companyId`
- Controller class + method nomi: `AttendanceController.getKpiTemplate`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- Qo'llangan guard'lar: class yoki metod darajasida `@UseGuards(...)` ko'rsatilmagan (lekin `@ApiBearerAuth()` bor, ehtimol global guard)
- Ruxsat etilgan rollar: `@Roles('superadmin', 'admin')`

**4. DTO:**
- Request DTO: Yo'q (faqat Param: `companyId` ParseUUIDPipe)

**5. Service:**
- Chaqirilayotgan service method: `AttendanceService.getKpiTemplate` (`zdes_backend/src/modules/attendance/services/attendance.service.ts`)
- Mantiq tavsifi: Bajaruvchi ko'rsatilgan kompaniyaga tegishli yoki ruxsati borligini tekshiradi va shu kompaniya uchun KPI shablonini (`Setting` jadvalidan) yoki bazaviy standart (default) shablonni qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli (AttendanceKpiTemplateDto):
  - companyId: string (UUID)
  - latePenaltyPerMinute: number
  - earlyLeavePenaltyPerMinute: number
  - overtimeBonusPerMinute: number
  - faceSimilarityThreshold: number

**7. Error case:**
- `ForbiddenException`: Agar actor shu kompaniyaga tegishli/ruxsati bo'lmasa.
- `NotFoundException`: Agar kompaniya bazada topilmasa.

**8. DB struktura:**
Model: `Setting`, `Company` (ushbu endpoint asosan shablon o'qiydi).
Umumiy modul uchun tegishli `Attendance` modeli tarkibi:
- `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
- `companyId`: String, majburiy, `@db.Uuid`
- `branchId`: String?, ixtiyoriy, `@db.Uuid`
- `employeeId`: String, majburiy, `@db.Uuid`
- `terminalId`: String?, ixtiyoriy, `@db.Uuid`
- `date`: DateTime, majburiy, `@db.Date`
- `checkIn`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `checkOut`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `status`: enum AttendanceStatus, majburiy, `@default(present)`
- `source`: enum AttendanceSource, majburiy, `@default(terminal)`
- `workStartTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workEndTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workedMinutes`: Int, majburiy, `@default(0)`
- `lateMinutes`: Int, majburiy, `@default(0)`
- `earlyLeaveMinutes`: Int, majburiy, `@default(0)`
- `overtimeMinutes`: Int, majburiy, `@default(0)`
- `checkInImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `checkOutImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `notes`: String?, ixtiyoriy
- `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
- `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`

Chiquvchi (Outgoing Relations):
- `Attendance.companyId -> Company.id (onDelete: Cascade)`
- `Attendance.branchId -> Branch.id (onDelete: SetNull)`
- `Attendance.employeeId -> User.id (onDelete: Cascade)`
- `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`

Kiruvchi (Incoming Relations):
- `RawAttendanceLog.attendanceId -> Attendance.id (onDelete: SetNull)`

Indekslar/Uniquelar (Attendance):
- `@@unique([employeeId, date])`
- `@@index([companyId])`
- `@@index([branchId])`
- `@@index([employeeId])`
- `@@index([terminalId])`
- `@@index([date])`
- `@@index([status])`

---
### Endpoint: PUT /api/v1/attendance/kpi-template
**Controller:** zdes_backend/src/modules/attendance/attendance.controller.ts:upsertKpiTemplate

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PUT /api/v1/attendance/kpi-template`
- Controller class + method nomi: `AttendanceController.upsertKpiTemplate`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `companyId`: misol yo'q
- `latePenaltyPerMinute`: 1000
- `earlyLeavePenaltyPerMinute`: 1000
- `overtimeBonusPerMinute`: 1000
- `faceSimilarityThreshold`: 90

**3. Guard:**
- Qo'llangan guard'lar: class yoki metod darajasida `@UseGuards(...)` ko'rsatilmagan
- Ruxsat etilgan rollar: `@Roles('superadmin', 'admin')`

**4. DTO:**
- Request DTO: `AttendanceKpiTemplateDto` (`zdes_backend/src/modules/attendance/dto/attendance-kpi-template.dto.ts`)
- Maydonlar:
  - `companyId`: string, `@IsOptional()`, `@IsUUID()`
  - `latePenaltyPerMinute`: number, `@IsOptional()`, `@IsNumber()`, `@Min(0)`
  - `earlyLeavePenaltyPerMinute`: number, `@IsOptional()`, `@IsNumber()`, `@Min(0)`
  - `overtimeBonusPerMinute`: number, `@IsOptional()`, `@IsNumber()`, `@Min(0)`
  - `faceSimilarityThreshold`: number, `@IsOptional()`, `@IsNumber()`, `@Min(0)`, `@Max(100)`

**5. Service:**
- Chaqirilayotgan service method: `AttendanceService.upsertKpiTemplate` (`zdes_backend/src/modules/attendance/services/attendance.service.ts`)
- Mantiq tavsifi: Kompaniya mavjudligini tekshiradi va DTO dagi ma'lumotlar bilan `Setting` jadvaliga `ATTENDANCE_KPI_SETTING_KEY` kaliti ostida KPI shablonini yangilaydi yoki yaratadi (upsert).

**6. Response:**
- Qaytariladigan javob shakli (AttendanceKpiTemplateDto):
  - companyId: string
  - latePenaltyPerMinute: number
  - earlyLeavePenaltyPerMinute: number
  - overtimeBonusPerMinute: number
  - faceSimilarityThreshold: number

**7. Error case:**
- `ForbiddenException`: Agar foydalanuvchi ko'rsatilgan kompaniyaga huquqi bo'lmasa.
- `NotFoundException`: Agar kompaniya bazada topilmasa.

**8. DB struktura:**
Model: `Setting`, `Company` (ushbu endpoint shablonni Settings ga yozadi).
Model `Attendance` (modul asosi):
- (Yuqoridagi Endpoint 1dagi kabi majburiy qatorlar bu yerda ham amalda, barchasi yuqorida to'liq keltirilgan: id, companyId, date va h.k.)

Chiquvchi (Outgoing Relations):
- `Attendance.companyId -> Company.id (onDelete: Cascade)`
- `Attendance.branchId -> Branch.id (onDelete: SetNull)`
- `Attendance.employeeId -> User.id (onDelete: Cascade)`
- `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`

Kiruvchi (Incoming Relations):
- `RawAttendanceLog.attendanceId -> Attendance.id (onDelete: SetNull)`

---
### Endpoint: POST /api/v1/attendance/check-in
**Controller:** zdes_backend/src/modules/attendance/attendance.controller.ts:checkIn

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/attendance/check-in`
- Controller class + method nomi: `AttendanceController.checkIn`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `employeeId`: misol yo'q
- `terminalId`: misol yo'q
- `imageBase64`: misol yo'q
- `contentType`: 'image/jpeg'
- `eventTime`: '2026-06-08T09:05:00.000Z'
- `notes`: misol yo'q

**3. Guard:**
- Qo'llangan guard'lar: class yoki metod darajasida `@UseGuards(...)` yo'q
- Ruxsat etilgan rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: `AttendanceCheckInDto` (`zdes_backend/src/modules/attendance/dto/attendance-check-in.dto.ts`)
- Maydonlar:
  - `employeeId`: string, `@IsUUID()`
  - `terminalId`: string (optional), `@IsOptional()`, `@IsUUID()`
  - `imageBase64`: string, `@IsString()`, `@MinLength(10)`
  - `contentType`: string (optional), `@IsOptional()`, `@IsString()`, `@MaxLength(100)`
  - `eventTime`: string (optional), `@IsOptional()`, `@IsISO8601()`
  - `notes`: string (optional), `@IsOptional()`, `@IsString()`, `@MaxLength(1000)`

**5. Service:**
- Chaqirilayotgan service method: `AttendanceService.checkIn` (`zdes_backend/src/modules/attendance/services/attendance.service.ts`)
- Mantiq tavsifi: Xodimni AWS yordamida yuz orqali verifikatsiya qiladi va tekshiradi. Shundan so'ng `Attendance` jadvaliga check-in vaqtini (yangi yozuv yaratish yoki update qilish orqali) qayd etadi, kechikish va qo'shimcha ishlashni hisoblab `SalaryAdjustment` yozuvlarini ham yaratadi (yoki eskilarini o'chirib qayta yozadi).

**6. Response:**
- Qaytariladigan javob shakli:
  - id: string
  - companyId: string
  - branchId: string | null
  - employeeId: string
  - terminalId: string | null
  - date: Date
  - checkIn: Date | null
  - checkOut: Date | null
  - status: AttendanceStatus
  - source: AttendanceSource
  - workStartTime: string | null
  - workEndTime: string | null
  - workedMinutes: number
  - lateMinutes: number
  - earlyLeaveMinutes: number
  - overtimeMinutes: number
  - checkInImageUrl: string | null
  - checkOutImageUrl: string | null
  - notes: string | null
  - faceSimilarity: number | undefined
  - appliedAdjustments: AttendanceAdjustmentDto[]
  - createdAt: Date
  - updatedAt: Date

**7. Error case:**
- `BadRequestException`: Yuz rasmi bo'sh bo'lsa yoki noto'g'ri sanali vaqt kelsa.
- `NotFoundException`: Xodim yoki Terminal topilmasa.
- `ConflictException`: Xodim rasmi bo'lmasa, Terminal noto'g'ri kompaniyaga tegishli bo'lmasa, yuz tekshiruvi yetarli similarity bermasa yoki shu sana uchun xodim allaqachon check-in qilgan bo'lsa.
- `ForbiddenException`: Xodim bloklangan bo'lsa.

**8. DB struktura:**
Model: `Attendance`
- `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
- `companyId`: String, majburiy, `@db.Uuid`
- `branchId`: String?, ixtiyoriy, `@db.Uuid`
- `employeeId`: String, majburiy, `@db.Uuid`
- `terminalId`: String?, ixtiyoriy, `@db.Uuid`
- `date`: DateTime, majburiy, `@db.Date`
- `checkIn`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `checkOut`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `status`: enum AttendanceStatus, majburiy, `@default(present)`
- `source`: enum AttendanceSource, majburiy, `@default(terminal)`
- `workStartTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workEndTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workedMinutes`: Int, majburiy, `@default(0)`
- `lateMinutes`: Int, majburiy, `@default(0)`
- `earlyLeaveMinutes`: Int, majburiy, `@default(0)`
- `overtimeMinutes`: Int, majburiy, `@default(0)`
- `checkInImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `checkOutImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `notes`: String?, ixtiyoriy
- `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
- `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`

Chiquvchi (Outgoing Relations):
- `Attendance.companyId -> Company.id (onDelete: Cascade)`
- `Attendance.branchId -> Branch.id (onDelete: SetNull)`
- `Attendance.employeeId -> User.id (onDelete: Cascade)`
- `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`

Kiruvchi (Incoming Relations):
- `RawAttendanceLog.attendanceId -> Attendance.id (onDelete: SetNull)`

Indekslar/Uniquelar:
- `@@unique([employeeId, date])`
- `@@index([companyId])`
- `@@index([branchId])`
- `@@index([employeeId])`
- `@@index([terminalId])`
- `@@index([date])`
- `@@index([status])`

---
### Endpoint: POST /api/v1/attendance/check-out
**Controller:** zdes_backend/src/modules/attendance/attendance.controller.ts:checkOut

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/attendance/check-out`
- Controller class + method nomi: `AttendanceController.checkOut`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `employeeId`: misol yo'q
- `terminalId`: misol yo'q
- `imageBase64`: misol yo'q
- `contentType`: 'image/jpeg'
- `eventTime`: '2026-06-08T18:10:00.000Z'
- `notes`: misol yo'q

**3. Guard:**
- Qo'llangan guard'lar: class yoki metod darajasida `@UseGuards(...)` yo'q
- Ruxsat etilgan rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: `AttendanceCheckOutDto` (`zdes_backend/src/modules/attendance/dto/attendance-check-out.dto.ts`)
- Maydonlar:
  - `employeeId`: string, `@IsUUID()`
  - `terminalId`: string (optional), `@IsOptional()`, `@IsUUID()`
  - `imageBase64`: string, `@IsString()`, `@MinLength(10)`
  - `contentType`: string (optional), `@IsOptional()`, `@IsString()`, `@MaxLength(100)`
  - `eventTime`: string (optional), `@IsOptional()`, `@IsISO8601()`
  - `notes`: string (optional), `@IsOptional()`, `@IsString()`, `@MaxLength(1000)`

**5. Service:**
- Chaqirilayotgan service method: `AttendanceService.checkOut` (`zdes_backend/src/modules/attendance/services/attendance.service.ts`)
- Mantiq tavsifi: Xodimni AWS orqali yuz orqali verifikatsiya qiladi va tekshiradi. Shundan so'ng bazadagi bugungi check-in yozuvini yangilab, `checkOut` vaqtini qo'shadi hamda KPI bo'yicha ishlagan vaqt/overtime larni hisoblab `SalaryAdjustment` qatorlarini sinxronizatsiya qiladi.

**6. Response:**
- Qaytariladigan javob shakli: Check-in bilan bir xil shaklda (id, date, status, checkIn, checkOut, workStartTime, lateMinutes va h.k. obyekti + faceSimilarity + appliedAdjustments massivi).

**7. Error case:**
- `BadRequestException`: Yuz rasmi bo'sh bo'lsa yoki noto'g'ri sana kelsa.
- `NotFoundException`: Xodim, Terminal topilmasa.
- `ConflictException`: Xodim rasmi bo'lmasa, check-in qilinmagan bo'lsa, allaqachon check-out qilingan bo'lsa yoki verifikatsiya darajasi past bo'lsa.
- `ForbiddenException`: Xodim bloklangan bo'lsa.

**8. DB struktura:**
Model: `Attendance`
- `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
- `companyId`: String, majburiy, `@db.Uuid`
- `branchId`: String?, ixtiyoriy, `@db.Uuid`
- `employeeId`: String, majburiy, `@db.Uuid`
- `terminalId`: String?, ixtiyoriy, `@db.Uuid`
- `date`: DateTime, majburiy, `@db.Date`
- `checkIn`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `checkOut`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `status`: enum AttendanceStatus, majburiy, `@default(present)`
- `source`: enum AttendanceSource, majburiy, `@default(terminal)`
- `workStartTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workEndTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workedMinutes`: Int, majburiy, `@default(0)`
- `lateMinutes`: Int, majburiy, `@default(0)`
- `earlyLeaveMinutes`: Int, majburiy, `@default(0)`
- `overtimeMinutes`: Int, majburiy, `@default(0)`
- `checkInImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `checkOutImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `notes`: String?, ixtiyoriy
- `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
- `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`

Chiquvchi (Outgoing Relations):
- `Attendance.companyId -> Company.id (onDelete: Cascade)`
- `Attendance.branchId -> Branch.id (onDelete: SetNull)`
- `Attendance.employeeId -> User.id (onDelete: Cascade)`
- `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`

Kiruvchi (Incoming Relations):
- `RawAttendanceLog.attendanceId -> Attendance.id (onDelete: SetNull)`

Indekslar/Uniquelar:
- `@@unique([employeeId, date])`
- `@@index([companyId])`
- `@@index([branchId])`
- `@@index([employeeId])`
- `@@index([terminalId])`
- `@@index([date])`
- `@@index([status])`

---
### Endpoint: GET /api/v1/attendance
**Controller:** zdes_backend/src/modules/attendance/attendance.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/attendance`
- Controller class + method nomi: `AttendanceController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- Qo'llangan guard'lar: class yoki metod darajasida `@UseGuards(...)` yo'q
- Ruxsat etilgan rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: `AttendanceQueryDto` (`zdes_backend/src/modules/attendance/dto/attendance-query.dto.ts`) (Query parametrlar)
- Maydonlar:
  - `companyId`: string (optional), `@IsOptional()`, `@IsUUID()`
  - `branchId`: string (optional), `@IsOptional()`, `@IsUUID()`
  - `employeeId`: string (optional), `@IsOptional()`, `@IsUUID()`
  - `terminalId`: string (optional), `@IsOptional()`, `@IsUUID()`
  - `status`: AttendanceStatus (optional), `@IsOptional()`, `@IsEnum(AttendanceStatus)`
  - `dateFrom`: string (optional), `@IsOptional()`, `@IsISO8601({ strict: true })`
  - `dateTo`: string (optional), `@IsOptional()`, `@IsISO8601({ strict: true })`
  - `page`: number (optional), `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
  - `limit`: number (optional), `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Chaqirilayotgan service method: `AttendanceService.findAll` (`zdes_backend/src/modules/attendance/services/attendance.service.ts`)
- Mantiq tavsifi: Bajaruvchining huquqlari bo'yicha filial yoki kompaniya ma'lumotlari filtrlanadi. Query parametrlar bo'yicha paginatsiya asosida Attendance jadvallarini sanaga va yaratilgan vaqtiga ko'ra kamayish tartibida ro'yxatini qaytaradi. Har bir element uchun salary adjustments ham yuklanadi.

**6. Response:**
- Qaytariladigan javob shakli (Paginatsiya):
  - `items`: [Attendance javob obyekti massivi (id, checkIn, status, va boshqalar qatori appliedAdjustments)]
  - `total`: number
  - `page`: number
  - `limit`: number
  - `totalPages`: number

**7. Error case:**
- Asosan ruxsatlar bilan bog'liq bo'lishi mumkin (masalan, scope dan tashqaridagi companyId kiritilsa).

**8. DB struktura:**
Model: `Attendance`
- `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
- `companyId`: String, majburiy, `@db.Uuid`
- `branchId`: String?, ixtiyoriy, `@db.Uuid`
- `employeeId`: String, majburiy, `@db.Uuid`
- `terminalId`: String?, ixtiyoriy, `@db.Uuid`
- `date`: DateTime, majburiy, `@db.Date`
- `checkIn`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `checkOut`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `status`: enum AttendanceStatus, majburiy, `@default(present)`
- `source`: enum AttendanceSource, majburiy, `@default(terminal)`
- `workStartTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workEndTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workedMinutes`: Int, majburiy, `@default(0)`
- `lateMinutes`: Int, majburiy, `@default(0)`
- `earlyLeaveMinutes`: Int, majburiy, `@default(0)`
- `overtimeMinutes`: Int, majburiy, `@default(0)`
- `checkInImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `checkOutImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `notes`: String?, ixtiyoriy
- `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
- `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`

Chiquvchi (Outgoing Relations):
- `Attendance.companyId -> Company.id (onDelete: Cascade)`
- `Attendance.branchId -> Branch.id (onDelete: SetNull)`
- `Attendance.employeeId -> User.id (onDelete: Cascade)`
- `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`

Kiruvchi (Incoming Relations):
- `RawAttendanceLog.attendanceId -> Attendance.id (onDelete: SetNull)`

Indekslar/Uniquelar (Qidiruv ushbu indekslarga tayanadi):
- `@@unique([employeeId, date])`
- `@@index([companyId])`
- `@@index([branchId])`
- `@@index([employeeId])`
- `@@index([terminalId])`
- `@@index([date])`
- `@@index([status])`

---
### Endpoint: GET /api/v1/attendance/:id
**Controller:** zdes_backend/src/modules/attendance/attendance.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/attendance/:id`
- Controller class + method nomi: `AttendanceController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q

**3. Guard:**
- Qo'llangan guard'lar: class yoki metod darajasida `@UseGuards(...)` yo'q
- Ruxsat etilgan rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: Yo'q (faqat Param: `id` ParseUUIDPipe)

**5. Service:**
- Chaqirilayotgan service method: `AttendanceService.findOne` (`zdes_backend/src/modules/attendance/services/attendance.service.ts`)
- Mantiq tavsifi: Baza ichidan belgilangan id yordamida Attendance yozuvini oladi. Bajaruvchi uchun scope ni tekshiradi va adjustmentlar ro'yxatini yuklab obyekt qilib qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli: Bitta obyekt sifatida.
  - id: string
  - companyId: string
  - branchId: string | null
  - employeeId: string
  - terminalId: string | null
  - date: Date
  - checkIn: Date | null
  - checkOut: Date | null
  - status: AttendanceStatus
  - source: AttendanceSource
  - workStartTime: string | null
  - workEndTime: string | null
  - workedMinutes: number
  - lateMinutes: number
  - earlyLeaveMinutes: number
  - overtimeMinutes: number
  - checkInImageUrl: string | null
  - checkOutImageUrl: string | null
  - notes: string | null
  - faceSimilarity: number | undefined
  - appliedAdjustments: AttendanceAdjustmentDto[]
  - createdAt: Date
  - updatedAt: Date

**7. Error case:**
- `NotFoundException`: Agar Attendance bazada topilmasa.
- `ForbiddenException`: Agar topilgan yozuv foydalanuvchining huquq doirasida bo'lmasa (`assertWithinScope` orqali).

**8. DB struktura:**
Model: `Attendance`
- `id`: String, majburiy, `@id @default(uuid()) @db.Uuid`
- `companyId`: String, majburiy, `@db.Uuid`
- `branchId`: String?, ixtiyoriy, `@db.Uuid`
- `employeeId`: String, majburiy, `@db.Uuid`
- `terminalId`: String?, ixtiyoriy, `@db.Uuid`
- `date`: DateTime, majburiy, `@db.Date`
- `checkIn`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `checkOut`: DateTime?, ixtiyoriy, `@db.Timestamptz(6)`
- `status`: enum AttendanceStatus, majburiy, `@default(present)`
- `source`: enum AttendanceSource, majburiy, `@default(terminal)`
- `workStartTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workEndTime`: String?, ixtiyoriy, `@db.VarChar(10)`
- `workedMinutes`: Int, majburiy, `@default(0)`
- `lateMinutes`: Int, majburiy, `@default(0)`
- `earlyLeaveMinutes`: Int, majburiy, `@default(0)`
- `overtimeMinutes`: Int, majburiy, `@default(0)`
- `checkInImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `checkOutImageUrl`: String?, ixtiyoriy, `@db.VarChar(500)`
- `notes`: String?, ixtiyoriy
- `createdAt`: DateTime, majburiy, `@default(now()) @db.Timestamptz(6)`
- `updatedAt`: DateTime, majburiy, `@updatedAt @db.Timestamptz(6)`

Chiquvchi (Outgoing Relations):
- `Attendance.companyId -> Company.id (onDelete: Cascade)`
- `Attendance.branchId -> Branch.id (onDelete: SetNull)`
- `Attendance.employeeId -> User.id (onDelete: Cascade)`
- `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`

Kiruvchi (Incoming Relations):
- `RawAttendanceLog.attendanceId -> Attendance.id (onDelete: SetNull)`

Indekslar/Uniquelar:
- `@@unique([employeeId, date])`
- `@@index([companyId])`
- `@@index([branchId])`
- `@@index([employeeId])`
- `@@index([terminalId])`
- `@@index([date])`
- `@@index([status])`
