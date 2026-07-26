### Endpoint: POST /api/v1/auth/login
**Controller:** src/modules/auth/controllers/auth.controller.ts:login

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/auth/login`
- Controller class + method nomi: `AuthController.login`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- login: 'admin'
- password: '1234'
- deviceType: 'web' (ixtiyoriy, misol bor)
- deviceName: 'Chrome on Windows' (ixtiyoriy, misol bor)

**3. Guard:**
- Qo'llangan guard'lar: `@Public()` (bu endpoint authentication talab qilmaydi)

**4. DTO:**
- Request DTO class nomi + fayl yo'li: `LoginDto` (`src/modules/auth/dto/login.dto.ts`)
- Har bir maydon:
  - `login`: `string`, `@IsString()`
  - `password`: `string`, `@IsString()`, `@MinLength(1)`
  - `deviceType`: `string` (ixtiyoriy), `@IsOptional()`, `@IsString()`
  - `deviceName`: `string` (ixtiyoriy), `@IsOptional()`, `@IsString()`

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AuthService.login` (`src/modules/auth/services/auth.service.ts`)
- Mantiq tavsifi: Baza bo'yicha `login` yoki `email` orqali foydalanuvchini izlaydi va parolni tekshiradi (faqat superadmin, admin, manager ruxsat etilgan). Muvaffaqiyatli bo'lsa yangi refresh token yaratib bazaga (`RefreshToken` modeliga) yozadi va JWT access token hamda foydalanuvchi ma'lumotlarini qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli:
  - `tokenType`: `string` ('Bearer')
  - `accessToken`: `string`
  - `refreshToken`: `string`
  - `expiresIn`: `number`
  - `user`: ob'ekt (`id`, `login`, `role`, `companyId`, `branchId`, `departmentId`, `positionId`, `firstName`, `lastName`, `middleName`, `phone`, `email`, `employeeNo`, `faceDeviceUserId`, `isActive`, `isBlocked`)

**7. Error case:**
- `UnauthorizedException` ('Login and password are required') - login yoki parol jo'natilmasa.
- `UnauthorizedException` ('Invalid login or password') - foydalanuvchi topilmasa yoki parol noto'g'ri bo'lsa.
- `ForbiddenException` ('Only superadmin, admin, and manager users can login. Employee users authenticate through turnstile integration.') - foydalanuvchi roli ruxsat etilmagan bo'lsa.
- `ForbiddenException` ('User is inactive') - foydalanuvchi faol bo'lmasa.
- `ForbiddenException` ('User is blocked') - foydalanuvchi bloklangan bo'lsa.

**8. DB struktura:**
- `User` modeli (o'qish):
  - `id`: `String @id @default(uuid()) @db.Uuid`
  - `login`: `String @unique @db.VarChar(255)`
  - `email`: `String? @unique @db.VarChar(255)` (ixtiyoriy, `login` bo'yicha topilmasa shu orqali ham qidiriladi)
  - `passwordHash`: `String @db.VarChar(255)`
  - `role`: `UserRole @default(employee)` (enum)
  - `isActive`: `Boolean @default(true)`
  - `isBlocked`: `Boolean @default(false)`
  - `companyId`, `branchId`, `departmentId`, `positionId`: hammasi `String? @db.Uuid` (ixtiyoriy FK)
  - `firstName`, `lastName`, `middleName`, `phone`: `String? @db.VarChar(...)` (ixtiyoriy)
  - `employeeNo`: `String? @db.VarChar(100)`
  - `faceDeviceUserId`: `String? @db.VarChar(100)`
- **Relations (User):**
  - `User.companyId -> Company.id` (`onDelete: SetNull`)
  - `User.branchId -> Branch.id` (`onDelete: SetNull`)
  - `User.departmentId -> Department.id` (`onDelete: SetNull`)
  - `User.positionId -> Position.id` (`onDelete: SetNull`)
- `RefreshToken` modeli (yozish/create):
  - `id`: `String @id @default(uuid()) @db.Uuid`
  - `userId`: `String @db.Uuid` (majburiy FK)
  - `token`: `String` (xeshlangan refresh token qiymati)
  - `expiresAt`: `DateTime @db.Timestamptz(6)` (majburiy)
  - `deviceType`: `String? @db.VarChar(100)` (ixtiyoriy)
  - `deviceName`: `String? @db.VarChar(255)` (ixtiyoriy)
  - `userAgent`: `String?` (ixtiyoriy)
  - `ipAddress`: `String? @db.VarChar(100)` (ixtiyoriy)
  - `lastUsedAt`: `DateTime? @db.Timestamptz(6)` (bu yozuvda `new Date()` bilan to'ldiriladi)
- **Relations (RefreshToken):**
  - `RefreshToken.userId -> User.id` (`onDelete: Cascade` — user o'chirilsa uning barcha refresh tokenlari ham o'chadi)
- **Indexlar:** `@@index([userId])`, `@@index([expiresAt])` (`RefreshToken`); `User.login`/`User.email` `@unique`.


### Endpoint: POST /api/v1/auth/refresh
**Controller:** src/modules/auth/controllers/auth.controller.ts:refresh

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/auth/refresh`
- Controller class + method nomi: `AuthController.refresh`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- refreshToken: misol yo'q (`@ApiProperty()` — example ko'rsatilmagan)
- deviceType: 'web' (ixtiyoriy, misol bor)
- deviceName: 'Chrome on Windows' (ixtiyoriy, misol bor)

**3. Guard:**
- Qo'llangan guard'lar: `@Public()` (bu endpoint authentication talab qilmaydi)

**4. DTO:**
- Request DTO class nomi + fayl yo'li: `RefreshTokenDto` (`src/modules/auth/dto/refresh-token.dto.ts`)
- Har bir maydon:
  - `refreshToken`: `string`, `@IsString()`, `@MinLength(1)`
  - `deviceType`: `string` (ixtiyoriy), `@IsOptional()`, `@IsString()`
  - `deviceName`: `string` (ixtiyoriy), `@IsOptional()`, `@IsString()`

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AuthService.refresh` (`src/modules/auth/services/auth.service.ts`)
- Mantiq tavsifi: Berilgan refresh tokenni xeshlangan holatda bazadan qidiradi va amal qilish muddati o'tmaganligini tekshiradi. Muddat o'tgan bo'lsa, tokenni o'chiradi; agar amal qilsa `RefreshToken` ni so'nggi ishlatilgan vaqti va meta-ma'lumotlarini yangilaydi hamda yangi access token qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli:
  - `tokenType`: `string` ('Bearer')
  - `accessToken`: `string`
  - `refreshToken`: mavjud emas (undefined)
  - `expiresIn`: `number`
  - `user`: ob'ekt (`id`, `login`, `role`, `companyId`, `branchId`, `departmentId`, `positionId`, `firstName`, `lastName`, `middleName`, `phone`, `email`, `employeeNo`, `faceDeviceUserId`, `isActive`, `isBlocked`)

**7. Error case:**
- `UnauthorizedException` ('Refresh token is required') - refresh token jo'natilmasa.
- `UnauthorizedException` ('Refresh token is invalid') - token bazadan topilmasa.
- `UnauthorizedException` ('Refresh token expired') - tokenning amal qilish muddati tugagan bo'lsa.
- `ForbiddenException` ('Only superadmin, admin, and manager users can login...') - topilgan foydalanuvchi roli noto'g'ri bo'lsa.
- `ForbiddenException` ('User is inactive' / 'User is blocked') - foydalanuvchi bloklangan yoki faol bo'lmasa.

**8. DB struktura:**
- `RefreshToken` modeli (o'qish + yangilash):
  - `id`: `String @id @default(uuid()) @db.Uuid`
  - `userId`: `String @db.Uuid` (majburiy FK)
  - `token`: `String` (xeshlangan qiymat bo'yicha qidiriladi, `findFirst`)
  - `expiresAt`: `DateTime @db.Timestamptz(6)` — muddat tekshiriladi, o'tgan bo'lsa yozuv o'chiriladi (`delete`)
  - `deviceType`, `deviceName`: `String? @db.VarChar(...)` (yangilanadi, `update`)
  - `userAgent`: `String?`, `ipAddress`: `String? @db.VarChar(100)` (yangilanadi)
  - `lastUsedAt`: `DateTime? @db.Timestamptz(6)` (yangilanadi, `new Date()`)
- **Relations (RefreshToken):**
  - `RefreshToken.userId -> User.id` (`onDelete: Cascade`) — `include: { user: true }` bilan birga o'qiladi
- `User` modeli (o'qish, `RefreshToken.user` orqali):
  - `id`, `login`, `role` (`UserRole`), `isActive` (`Boolean`), `isBlocked` (`Boolean`) — `ensureUserCanLogin` tekshiruvi uchun
  - `companyId`, `branchId`, `departmentId`, `positionId`: `String? @db.Uuid` — javobga qaytariladi
- **Relations (User, javobga qaytarilganda):**
  - `User.companyId -> Company.id`, `User.branchId -> Branch.id`,
    `User.departmentId -> Department.id`, `User.positionId -> Position.id`
    (barchasi `onDelete: SetNull`)
- **Indexlar:** `@@index([userId])`, `@@index([expiresAt])`.


### Endpoint: POST /api/v1/auth/logout
**Controller:** src/modules/auth/controllers/auth.controller.ts:logout

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/auth/logout`
- Controller class + method nomi: `AuthController.logout`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- refreshToken: misol yo'q (`@ApiProperty()` — example ko'rsatilmagan)
- deviceType: 'web' (ixtiyoriy, misol bor)
- deviceName: 'Chrome on Windows' (ixtiyoriy, misol bor)

**3. Guard:**
- Qo'llangan guard'lar: `@Public()` (bu endpoint authentication talab qilmaydi)

**4. DTO:**
- Request DTO class nomi + fayl yo'li: `RefreshTokenDto` (`src/modules/auth/dto/refresh-token.dto.ts`)
- Har bir maydon:
  - `refreshToken`: `string`, `@IsString()`, `@MinLength(1)`
  - `deviceType`: `string` (ixtiyoriy), `@IsOptional()`, `@IsString()`
  - `deviceName`: `string` (ixtiyoriy), `@IsOptional()`, `@IsString()`

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AuthService.logout` (`src/modules/auth/services/auth.service.ts`)
- Mantiq tavsifi: Berilgan refresh tokenni xeshlangan holatda bazadan izlaydi va mos keluvchi yozuvlarni `RefreshToken` jadvalidan o'chiradi. Token bo'sh bo'lsa, xato bermasdan muvaffaqiyat holatini qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli:
  - `success`: `boolean` (`true`)

**7. Error case:**
- Ushbu endpoint to'g'ridan-to'g'ri xatolik (Exception) tashlamaydi. Noto'g'ri yoki bo'sh token yuborilsa ham `{ success: true }` qaytaradi.

**8. DB struktura:**
- `RefreshToken` modeli (o'chirish, `deleteMany`):
  - `token`: `String` — xeshlangan qiymat bo'yicha mos yozuvlar qidiriladi va o'chiriladi (`where: { token: ... }`)
  - Boshqa maydonlarga (`userId`, `expiresAt`, va h.k.) bu operatsiyada tegilmaydi, faqat `token` shart sifatida ishlatiladi.
- **Relations (RefreshToken):**
  - `RefreshToken.userId -> User.id` (`onDelete: Cascade`) — bu endpointda ishlatilmaydi (foydalanuvchi o'qilmaydi), lekin modelning o'zida mavjud.


### Endpoint: GET /api/v1/auth/me
**Controller:** src/modules/auth/controllers/auth.controller.ts:me

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/auth/me`
- Controller class + method nomi: `AuthController.me`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
- Body yo'q (GET so'rov, DTO ishlatilmaydi).

**3. Guard:**
- Qo'llangan guard'lar: Metod darajasida `@Roles('superadmin', 'admin', 'manager')`.
- Qaysi rollar ruxsat etilgan: `superadmin`, `admin`, `manager`

**4. DTO:**
- Request DTO class nomi + fayl yo'li: Body qabul qilinmaydi, faqat tokendan kirgan user payloadi ishlatiladi (DTO yo'q, `@CurrentUser() user: AccessTokenPayload` ishlatilgan).

**5. Service:**
- Chaqirilayotgan service method nomi + fayl yo'li: `AuthService.getCurrentUser` (`src/modules/auth/services/auth.service.ts`)
- Mantiq tavsifi: Token orqali olingan foydalanuvchi id'si bo'yicha `User` jadvalidan ma'lumotlarni qidiradi. Uning faolligini tekshiradi va ruxsat berilgan bo'lsa, foydalanuvchining ochiq profil ma'lumotlarini qaytaradi.

**6. Response:**
- Qaytariladigan javob shakli:
  - Foydalanuvchi ob'ekti (`id`, `login`, `role`, `companyId`, `branchId`, `departmentId`, `positionId`, `firstName`, `lastName`, `middleName`, `phone`, `email`, `employeeNo`, `faceDeviceUserId`, `isActive`, `isBlocked`)

**7. Error case:**
- `UnauthorizedException` ('User not found') - bazadan foydalanuvchi topilmasa.
- `ForbiddenException` ('Only superadmin, admin, and manager users can login...') - topilgan foydalanuvchi roli noto'g'ri bo'lsa.
- `ForbiddenException` ('User is inactive') - foydalanuvchi faol bo'lmasa.
- `ForbiddenException` ('User is blocked') - foydalanuvchi bloklangan bo'lsa.

**8. DB struktura:**
- `User` modeli (o'qish, `findUnique({ where: { id } })`):
  - `id`: `String @id @default(uuid()) @db.Uuid` (token payload'dagi `sub` bilan qidiriladi)
  - `login`, `role` (`UserRole`), `isActive` (`Boolean`), `isBlocked` (`Boolean`) — `ensureUserCanLogin` tekshiruvi uchun
  - `companyId`, `branchId`, `departmentId`, `positionId`: `String? @db.Uuid`
  - `firstName`, `lastName`, `middleName`, `phone`, `email`, `employeeNo`, `faceDeviceUserId`: javobga qaytariladi
- **Relations (User):**
  - `User.companyId -> Company.id` (`onDelete: SetNull`)
  - `User.branchId -> Branch.id` (`onDelete: SetNull`)
  - `User.departmentId -> Department.id` (`onDelete: SetNull`)
  - `User.positionId -> Position.id` (`onDelete: SetNull`)
- **Indexlar:** `User.id` — `@id` (birlamchi kalit, qo'shimcha indeks shart emas).
