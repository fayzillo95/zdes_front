# Terminal Moduli Backend Tahlili

### Endpoint: POST /api/v1/terminals
**Controller:** src/modules/terminal/terminal.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/terminals` (API global prefix qo'shilishi hisobga olingan holda)
- Controller class + method nomi: `TerminalController.create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- companyId: misol yo'q
- branchId: misol yo'q
- name: 'Main gate terminal'
- serialNumber: 'TRN-001'
- ipAddress: '192.168.1.100'
- port: 4370
- type: TerminalType.zkteco_face
- status: TerminalStatus.active
- connectionConfig: { username: 'admin', password: '12345' }
- lastSyncAt: '2026-06-08T10:00:00.000Z'

**3. Guard:**
- Class darajasida qo'llanilgan Guard'lar yo'q lekin dekoratorlar mavjud:
- `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: `CreateTerminalDto` (`src/modules/terminal/dto/create-terminal.dto.ts`)
- companyId: `string | undefined`, `@IsOptional()`, `@IsUUID()`
- branchId: `string | undefined`, `@IsOptional()`, `@IsUUID()`
- name: `string`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- serialNumber: `string`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- ipAddress: `string | undefined`, `@IsOptional()`, `@IsIP()`
- port: `number | undefined`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(65535)`
- type: `TerminalType | undefined`, `@IsOptional()`, `@IsEnum(TerminalType)`
- status: `TerminalStatus | undefined`, `@IsOptional()`, `@IsEnum(TerminalStatus)`
- connectionConfig: `Record<string, unknown> | undefined`, `@IsOptional()`, `@IsObject()`
- lastSyncAt: `string | undefined`, `@IsOptional()`, `@IsString()`

**5. Service:**
- Service method: `TerminalService.create` (`src/modules/terminal/terminal.service.ts`)
- Mantiq: Yuborilgan `companyId` va `branchId` asosida joriy foydalanuvchining (actor) vakolatlari tekshiriladi (resolveCompanyBranchScope). Ko'rsatilgan company va branch mavjudligi hamda branch berilgan company'ga tegishliligi tasdiqlanadi. Serial raqami tizimda takrorlanmasligi tekshirib, xatosiz holatda yangi Terminal bazada yaratiladi.

**6. Response:**
- Qaytariladigan javob: Yangi yaratilgan `Terminal` obyekti to'liqligicha qaytariladi. Maydonlar: `id`, `companyId`, `branchId`, `name`, `serialNumber`, `ipAddress`, `port`, `type`, `status`, `connectionConfig`, `lastSyncAt`, `createdAt`, `updatedAt`.

**7. Error case:**
- `NotFoundException('Company not found')`: Agar berilgan companyId bo'yicha kompaniya topilmasa.
- `NotFoundException('Branch not found')`: Agar berilgan branchId bo'yicha filial topilmasa.
- `ConflictException('Branch does not belong to the selected company')`: Agar tanlangan filial ko'rsatilgan kompaniyaga tegishli bo'lmasa.
- `ConflictException('Terminal name is required')`: Agar nom probellardan iborat bo'lsa yoki noto'g'ri bo'lsa (400 Bad Request validatsiyadan tashqari).
- `ConflictException('Serial number is required')`: Agar serial raqami bo'sh bo'lsa.
- `ConflictException('Terminal serial number already exists')`: Agar xuddi shu serial raqamli terminal bazada allaqachon mavjud bo'lsa.

**8. DB struktura:**
- Model nomi: `Terminal` (`prisma/schema.prisma`)
- Maydonlar ta'rifi:
  - `id`: `String`, majburiy, `@id`, `@default(uuid())`, `@db.Uuid`
  - `companyId`: `String`, majburiy, `@db.Uuid`
  - `branchId`: `String`, ixtiyoriy (`?`), `@db.Uuid`
  - `name`: `String`, majburiy, `@db.VarChar(255)`
  - `serialNumber`: `String`, majburiy, `@unique`, `@db.VarChar(255)`
  - `ipAddress`: `String`, ixtiyoriy (`?`), `@db.VarChar(100)`
  - `port`: `Int`, ixtiyoriy (`?`)
  - `type`: `TerminalType`, majburiy, `@default(zkteco_face)`
  - `status`: `TerminalStatus`, majburiy, `@default(active)`
  - `connectionConfig`: `Json`, ixtiyoriy (`?`), `@db.Json`
  - `lastSyncAt`: `DateTime`, ixtiyoriy (`?`), `@db.Timestamptz(6)`
  - `createdAt`: `DateTime`, majburiy, `@default(now())`, `@db.Timestamptz(6)`
  - `updatedAt`: `DateTime`, majburiy, `@updatedAt`, `@db.Timestamptz(6)`
- Relations / references:
  - **Chiquvchi:**
    - `Company.id` ga ishora qiluvchi maydon: `company -> Company` (`fields: [companyId]`, `references: [id]`, `onDelete: Cascade`)
    - `Branch.id` ga ishora qiluvchi maydon: `branch -> Branch` (`fields: [branchId]`, `references: [id]`, `onDelete: SetNull`)
  - **Kiruvchi:**
    - `Attendance.terminalId -> Terminal.id (onDelete: SetNull)`
    - `RawAttendanceLog.terminalId -> Terminal.id (onDelete: Cascade)`
- Indexlar:
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([status])`

---

### Endpoint: GET /api/v1/terminals
**Controller:** src/modules/terminal/terminal.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/terminals`
- Controller class + method nomi: `TerminalController.findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q (Query qabul qiladi)
- search: 'TRN-001'
- page: 1
- limit: 10
- companyId: misol yo'q
- branchId: misol yo'q
- type: misol yo'q (Swaggerda type ko'rsatilmagan enumdan tashqari)
- status: misol yo'q

**3. Guard:**
- `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: `TerminalQueryDto` (`src/modules/terminal/dto/terminal-query.dto.ts`)
- companyId: `string | undefined`, `@IsOptional()`, `@IsUUID()`
- branchId: `string | undefined`, `@IsOptional()`, `@IsUUID()`
- type: `TerminalType | undefined`, `@IsOptional()`, `@IsEnum(TerminalType)`
- status: `TerminalStatus | undefined`, `@IsOptional()`, `@IsEnum(TerminalStatus)`
- search: `string | undefined`, `@IsOptional()`, `@IsString()`
- page: `number | undefined`, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`
- limit: `number | undefined`, `@IsOptional()`, `@Type(() => Number)`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Service method: `TerminalService.findAll` (`src/modules/terminal/terminal.service.ts`)
- Mantiq: Kiritilgan query parametrlari bo'yicha filtirlash, qidirish (`name` va `serialNumber` orqali case-insensitive izlash), actor ruxsatlarini inobatga olgan holda terminallarni va ularning umumiy miqdorini bazadan oladi (Paginatsiya bilan).

**6. Response:**
- Qaytariladigan javob: Paginatsiya obyekti
  - `items`: `Terminal[]` (Terminal modeliga mos array)
  - `total`: `number`
  - `page`: `number`
  - `limit`: `number`
  - `totalPages`: `number`

**7. Error case:**
- Maxsus xatolar service tomonidan tashlanmaydi (validatsiya xatolarini hisobga olmasa). Malumot topilmasa ochiq holda bo'sh ro'yxat va total 0 qaytadi.

**8. DB struktura:**
- Model nomi: `Terminal` (`prisma/schema.prisma`)
- Maydonlar ta'rifi: `POST /api/v1/terminals` dagi kabi barchasi aynan bir xil.
- Relations / references: `POST /api/v1/terminals` dagi kabi barchasi aynan bir xil.
- Indexlar:
  - `@@index([companyId])`
  - `@@index([branchId])`
  - `@@index([status])`
  - *Izoh*: `search` qidiruvi uchun maxsus indeks (`name` yoki `serialNumber` da) yo'q, lekin `serialNumber` fieldda `@unique` borligi qisman samarali ishlashiga imkon beradi.

---

### Endpoint: GET /api/v1/terminals/:id
**Controller:** src/modules/terminal/terminal.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/terminals/:id`
- Controller class + method nomi: `TerminalController.findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q

**3. Guard:**
- `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- DTO yo'q. Faqat URL Parametric Data olinadi: `id` parametri `ParseUUIDPipe` orqali `string` ko'rinishida.

**5. Service:**
- Service method: `TerminalService.findOne` (`src/modules/terminal/terminal.service.ts`)
- Mantiq: Berilgan `id` yordamida terminal bazadan izlanadi. Topilgandan so'ng, ushbu terminalga foydalanuvchining (actor) ruxsati bor-yo'qligi (`assertWithinScope`) tekshiriladi.

**6. Response:**
- Qaytariladigan javob: Topilgan `Terminal` obyekti to'liq maydonlari bilan.

**7. Error case:**
- `NotFoundException('Terminal not found')`: Agar berilgan `id` bilan terminal bazadan topilmasa.
- (Ehtimolli scope exception): `assertWithinScope` dan kirishga ruxsat yo'q degan xato kelib chiqishi mumkin (Forbidden).

**8. DB struktura:**
- Model nomi: `Terminal` (`prisma/schema.prisma`)
- Maydonlar ta'rifi: Yuqoridagi barcha maydonlar bilan bir xil.
- Relations / references: `POST /api/v1/terminals` bilan bir xil.
- Indexlar: `id` `@id` orqali indexlangan.

---

### Endpoint: PATCH /api/v1/terminals/:id
**Controller:** src/modules/terminal/terminal.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/terminals/:id`
- Controller class + method nomi: `TerminalController.update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- `UpdateTerminalDto` obyekti qabul qilinadi, partial bo'lgani sababli `CreateTerminalDto` namunalari bilan bir xil, lekin barchasi ixtiyoriy:
  - name: 'Main gate terminal' (misol, Optional)
  - serialNumber: 'TRN-001' (misol, Optional)
  - ipAddress: '192.168.1.100' (misol, Optional)
  - port: 4370 (misol, Optional)
  - type: TerminalType.zkteco_face (misol, Optional)
  - status: TerminalStatus.active (misol, Optional)
  - connectionConfig: { username: 'admin', password: '12345' } (misol, Optional)
  - lastSyncAt: '2026-06-08T10:00:00.000Z' (misol, Optional)

**3. Guard:**
- `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- Request DTO: `UpdateTerminalDto` (`src/modules/terminal/dto/update-terminal.dto.ts`), `CreateTerminalDto`ning Partial ko'rinishi.
- `id` param qismi: URL dagi parametr, `ParseUUIDPipe` orqali olinadi.

**5. Service:**
- Service method: `TerminalService.update` (`src/modules/terminal/terminal.service.ts`)
- Mantiq: Bazadagi mavjud terminal topiladi. Foydalanuvchining unga ruxsati tekshiriladi. Agar `companyId` yoki `branchId` o'zgartirilayotgan bo'lsa ularning haqiqiyligi tekshiriladi. Agar `serialNumber` yangilanayotgan bo'lsa, tizimda takrorlanmasligi qayta tekshiriladi. Shundan so'ng, faqat yangilangan ma'lumotlar bazada yangilanadi (update operation).

**6. Response:**
- Qaytariladigan javob: Yangilangan `Terminal` obyekti to'liq ko'rinishda.

**7. Error case:**
- `NotFoundException('Terminal not found')`: O'zgartirilayotgan terminal topilmasa.
- `NotFoundException('Company not found')`: Yangi companyId bo'yicha kompaniya bo'lmasa.
- `NotFoundException('Branch not found')`: Yangi branchId bo'yicha filial bo'lmasa.
- `ConflictException('Branch does not belong to the selected company')`: Filial ko'rsatilgan kompaniyaga mos kelmasa.
- `ConflictException('Terminal serial number already exists')`: Yangi kiritilayotgan seriya raqami band bo'lsa.
- `ConflictException('Terminal name is required')`: Ism maydoni uzatilib uning qiymati bosh bo'shliq yoki null ga trim bo'lsa.
- `ConflictException('Serial number is required')`: Seriya raqamiga shunday xato holat kelsa.

**8. DB struktura:**
- Model nomi: `Terminal` (`prisma/schema.prisma`)
- Maydonlar ta'rifi: Yuqoridagidek `Terminal` barcha maydonlari mavjud.
- Relations / references: Yuqoridagidek barcha relatsiyalar amalda bir xil ishlatiladi.

---

### Endpoint: DELETE /api/v1/terminals/:id
**Controller:** src/modules/terminal/terminal.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/terminals/:id`
- Controller class + method nomi: `TerminalController.delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q.

**3. Guard:**
- `@ApiBearerAuth()`
- Rollar: `@Roles('superadmin', 'admin', 'manager')`

**4. DTO:**
- DTO yo'q. `id` URL'dan olinadi `ParseUUIDPipe` yordamida.

**5. Service:**
- Service method: `TerminalService.delete` (`src/modules/terminal/terminal.service.ts`)
- Mantiq: Id bo'yicha terminalni topadi, ruxsatini (scope) tekshiradi va keyin `delete` so'rovini bazaga jo'natib obyektni to'liq o'chiradi.

**6. Response:**
- Qaytariladigan javob: `{ success: true, id: string }`

**7. Error case:**
- `NotFoundException('Terminal not found')`: Agar o'chirilayotgan ID'ga ega terminal topilmasa.

**8. DB struktura:**
- Model nomi: `Terminal` (`prisma/schema.prisma`)
- Maydonlar ta'rifi: Yuqoridagilar kabi.
- Relations / references (O'chirish operatsiyasi uchun muhim):
  - **Chiquvchi:**
    - Terminal o'chirilganda u bog'langan Company yoki Branch larga ta'sir qilmaydi (Faqatgina ichki reference foreign key si uziladi).
  - **Kiruvchi (BU JUDA MUHIM):**
    - `Attendance.terminalId -> Terminal.id (onDelete: SetNull)` : Terminal o'chirilganda shu terminalda tekshiruvdan o'tgan attendance (davomat) yozuvlari **o'chirilmaydi**, balki ularning `terminalId` ustuni `NULL` qilib qo'yiladi.
    - `RawAttendanceLog.terminalId -> Terminal.id (onDelete: Cascade)` : Terminal o'chirilganda shu terminalga tegishli bo'lgan barcha asl xom davomat loglari (`RawAttendanceLog` dagi ma'lumotlar) **birgalikda butunlay o'chib ketadi**.
- Indexlar: `id` obyekti o'chiriladi va uning barcha bog'liqliklari triggerlar asosida ishlaydi.
