### Endpoint: POST /api/v1/notifications
**Controller:** src/modules/notification/notification.controller.ts:create

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `POST /api/v1/notifications`
- Controller class + method nomi: `NotificationController` + `create`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
userId: misol yo'q
title: 'Payroll ready'
message: 'June payroll has been prepared'
icon: NotificationIcon.money
isRead: false

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (controller darajasida)

**4. DTO:**
- Request DTO: `CreateNotificationDto` (src/modules/notification/dto/create-notification.dto.ts)
- `userId`: `string`, `@IsOptional()`, `@IsUUID()`
- `title`: `string`, `@IsString()`, `@MinLength(1)`, `@MaxLength(255)`
- `message`: `string`, `@IsString()`, `@MinLength(1)`
- `icon`: `NotificationIcon`, `@IsOptional()`, `@IsEnum(NotificationIcon)`
- `isRead`: `boolean`, `@IsOptional()`, `@IsBoolean()`

**5. Service:**
- Service method: `NotificationService.create` (src/modules/notification/notification.service.ts)
- Yangi bildirishnoma yaratadi (`Notification` jadvaliga yozadi). Agar actor superadmin bo'lmasa, `userId` bo'lishini talab qiladi va tegishli ruxsat (scope)larni tekshiradi.

**6. Response:**
- Yaratilgan `Notification` obyekti qaytariladi.
- Maydonlari: `id` (String), `userId` (String?), `title` (String), `message` (String), `icon` (NotificationIcon?), `isRead` (Boolean), `createdAt` (DateTime), `updatedAt` (DateTime).

**7. Error case:**
- `ForbiddenException`: 'userId is required for non-superadmin actors' (HTTP 403) - superadmin bo'lmaganlar uchun `userId` yo'q bo'lsa.
- `NotFoundException`: 'User not found' (HTTP 404) - kiritilgan `userId` mavjud bo'lmasa.
- `ForbiddenException` (HTTP 403) - kiritilgan user actor'ning scope'iga to'g'ri kelmasa (`assertWithinScope` orqali).
- `ConflictException`: 'Notification title is required' / 'Notification message is required' (HTTP 409) - bo'sh matn kiritilsa (`normalizeRequired` orqali).

**8. DB struktura:**
- Tegishli model: `Notification`
- `id`: `String` / majburiy / `@default(uuid())` / `@db.Uuid`
- `userId`: `String` / ixtiyoriy (`?`) / `@db.Uuid`
- `title`: `String` / majburiy / `@db.VarChar(255)`
- `message`: `String` / majburiy
- `icon`: `NotificationIcon` / ixtiyoriy (`?`)
- `isRead`: `Boolean` / majburiy / `@default(false)`
- `createdAt`: `DateTime` / majburiy / `@default(now())` / `@db.Timestamptz(6)`
- `updatedAt`: `DateTime` / majburiy / `@updatedAt` / `@db.Timestamptz(6)`
- Chiquvchi (bu model → boshqa model):
  - `user -> User.id (onDelete: Cascade)`
- Kiruvchi (boshqa modellar → bu model):
  - (Yo'q)
- Index/Unique:
  - `@@index([userId])`
  - `@@index([isRead])`

---

### Endpoint: GET /api/v1/notifications
**Controller:** src/modules/notification/notification.controller.ts:findAll

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/notifications`
- Controller class + method nomi: `NotificationController` + `findAll`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q. Query parametrlari misollari:
userId: misol yo'q
icon: misol yo'q
isRead: false
search: 'payroll'
page: 1
limit: 10

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (controller darajasida)

**4. DTO:**
- Query DTO: `NotificationQueryDto` (src/modules/notification/dto/notification-query.dto.ts)
- `userId`: `string`, `@IsOptional()`, `@IsUUID()`
- `icon`: `NotificationIcon`, `@IsOptional()`, `@IsEnum(NotificationIcon)`
- `isRead`: `boolean`, `@IsOptional()`, `@IsBoolean()`
- `search`: `string`, `@IsOptional()`, `@IsString()`
- `page`: `number`, `@IsOptional()`, `@IsInt()`, `@Min(1)`
- `limit`: `number`, `@IsOptional()`, `@IsInt()`, `@Min(1)`, `@Max(100)`

**5. Service:**
- Service method: `NotificationService.findAll` (src/modules/notification/notification.service.ts)
- Bildirishnomalarni o'qiydi. Foydalanuvchining (actorning) companyId/branchId scope'iga qarab filtrlaydi, qidiruv va paginatsiya ishlatadi.

**6. Response:**
- Paginatsiya qilingan obyekt qaytaradi:
  - `items`: `Notification[]` massivi
  - `total`: `number`
  - `page`: `number`
  - `limit`: `number`
  - `totalPages`: `number`

**7. Error case:**
- Maxsus xatolar ko'rsatilmagan (faqat default DTO validation xatoliklari bo'lishi mumkin).

**8. DB struktura:**
- Tegishli model: `Notification`
- `id`: `String` / majburiy / `@default(uuid())` / `@db.Uuid`
- `userId`: `String` / ixtiyoriy (`?`) / `@db.Uuid`
- `title`: `String` / majburiy / `@db.VarChar(255)`
- `message`: `String` / majburiy
- `icon`: `NotificationIcon` / ixtiyoriy (`?`)
- `isRead`: `Boolean` / majburiy / `@default(false)`
- `createdAt`: `DateTime` / majburiy / `@default(now())` / `@db.Timestamptz(6)`
- `updatedAt`: `DateTime` / majburiy / `@updatedAt` / `@db.Timestamptz(6)`
- Chiquvchi (bu model → boshqa model):
  - `user -> User.id (onDelete: Cascade)`
- Kiruvchi (boshqa modellar → bu model):
  - (Yo'q)
- Index/Unique:
  - `@@index([userId])`
  - `@@index([isRead])`

---

### Endpoint: GET /api/v1/notifications/:id
**Controller:** src/modules/notification/notification.controller.ts:findOne

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `GET /api/v1/notifications/:id`
- Controller class + method nomi: `NotificationController` + `findOne`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q.

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (controller darajasida)

**4. DTO:**
- DTO yo'q, faqat ID parametr: `@Param('id', ParseUUIDPipe) id: string`

**5. Service:**
- Service method: `NotificationService.findOne` (src/modules/notification/notification.service.ts)
- Berilgan ID bo'yicha bitta bildirishnomani bazadan o'qiydi va agar foydalanuvchiga tegishli (scope'iga mos) bo'lsa uni qaytaradi.

**6. Response:**
- Topilgan bitta `Notification` obyekti qaytariladi.
- Maydonlari: `id` (String), `userId` (String?), `title` (String), `message` (String), `icon` (NotificationIcon?), `isRead` (Boolean), `createdAt` (DateTime), `updatedAt` (DateTime).

**7. Error case:**
- `NotFoundException`: 'Notification not found' (HTTP 404) - ko'rsatilgan ID bilan yozuv topilmasa.
- `ForbiddenException`: 'Only superadmin can access global notifications' (HTTP 403) - superadmin bo'lmagan shaxs `userId` si bo'lmagan xabarni ko'rmoqchi bo'lsa.
- `ForbiddenException` (HTTP 403) - bildirishnoma actorning scope'iga to'g'ri kelmasa (`assertWithinScope` orqali).

**8. DB struktura:**
- Tegishli model: `Notification`
- `id`: `String` / majburiy / `@default(uuid())` / `@db.Uuid`
- `userId`: `String` / ixtiyoriy (`?`) / `@db.Uuid`
- `title`: `String` / majburiy / `@db.VarChar(255)`
- `message`: `String` / majburiy
- `icon`: `NotificationIcon` / ixtiyoriy (`?`)
- `isRead`: `Boolean` / majburiy / `@default(false)`
- `createdAt`: `DateTime` / majburiy / `@default(now())` / `@db.Timestamptz(6)`
- `updatedAt`: `DateTime` / majburiy / `@updatedAt` / `@db.Timestamptz(6)`
- Chiquvchi (bu model → boshqa model):
  - `user -> User.id (onDelete: Cascade)`
- Kiruvchi (boshqa modellar → bu model):
  - (Yo'q)
- Index/Unique:
  - `@@index([userId])`
  - `@@index([isRead])`

---

### Endpoint: PATCH /api/v1/notifications/:id
**Controller:** src/modules/notification/notification.controller.ts:update

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `PATCH /api/v1/notifications/:id`
- Controller class + method nomi: `NotificationController` + `update`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
userId: misol yo'q
title: 'Payroll ready'
message: 'June payroll has been prepared'
icon: NotificationIcon.money
isRead: false

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (controller darajasida)

**4. DTO:**
- Request DTO: `UpdateNotificationDto` (src/modules/notification/dto/update-notification.dto.ts, `CreateNotificationDto` ning Partial ko'rinishi)
- Hamma maydonlar ixtiyoriy.

**5. Service:**
- Service method: `NotificationService.update` (src/modules/notification/notification.service.ts)
- ID orqali bildirishnomani topib, uning qiymatlarini yangilaydi (faqat joriy foydalanuvchiga ruxsat etilgan scope'da ekanini tekshirib). `userId` o'zgarsa, uni ham scope bilan tekshiradi.

**6. Response:**
- Yangilangan bitta `Notification` obyekti qaytariladi.
- Maydonlari: `id` (String), `userId` (String?), `title` (String), `message` (String), `icon` (NotificationIcon?), `isRead` (Boolean), `createdAt` (DateTime), `updatedAt` (DateTime).

**7. Error case:**
- `NotFoundException`: 'Notification not found' (HTTP 404) - ko'rsatilgan ID bilan yozuv topilmasa.
- `ForbiddenException`: 'Only superadmin can access global notifications' (HTTP 403).
- `ForbiddenException` (HTTP 403) - bildirishnoma actorning scope'iga to'g'ri kelmasa (`assertWithinScope` orqali).
- `NotFoundException`: 'User not found' (HTTP 404) - yangi kiritilgan `userId` topilmasa.
- `ConflictException`: 'Notification title is required' / 'Notification message is required' (HTTP 409) - bo'sh matn kiritilsa.

**8. DB struktura:**
- Tegishli model: `Notification`
- `id`: `String` / majburiy / `@default(uuid())` / `@db.Uuid`
- `userId`: `String` / ixtiyoriy (`?`) / `@db.Uuid`
- `title`: `String` / majburiy / `@db.VarChar(255)`
- `message`: `String` / majburiy
- `icon`: `NotificationIcon` / ixtiyoriy (`?`)
- `isRead`: `Boolean` / majburiy / `@default(false)`
- `createdAt`: `DateTime` / majburiy / `@default(now())` / `@db.Timestamptz(6)`
- `updatedAt`: `DateTime` / majburiy / `@updatedAt` / `@db.Timestamptz(6)`
- Chiquvchi (bu model → boshqa model):
  - `user -> User.id (onDelete: Cascade)`
- Kiruvchi (boshqa modellar → bu model):
  - (Yo'q)
- Index/Unique:
  - `@@index([userId])`
  - `@@index([isRead])`

---

### Endpoint: DELETE /api/v1/notifications/:id
**Controller:** src/modules/notification/notification.controller.ts:delete

**1. Point (yo'nalish):**
- HTTP metod + to'liq yo'l: `DELETE /api/v1/notifications/:id`
- Controller class + method nomi: `NotificationController` + `delete`

**2. ApiBody / Misollar (Swagger example qiymatlar):**
Body yo'q.

**3. Guard:**
- `@Roles('superadmin', 'admin', 'manager')` (controller darajasida)

**4. DTO:**
- DTO yo'q, faqat ID parametr: `@Param('id', ParseUUIDPipe) id: string`

**5. Service:**
- Service method: `NotificationService.delete` (src/modules/notification/notification.service.ts)
- ID orqali bildirishnomani topadi, unga ruxsat etilganini tekshiradi va bazadan butunlay o'chirib tashlaydi.

**6. Response:**
- O'chirish bajarilgani to'g'risida success obyekti qaytariladi:
  - `{ success: true, id: <o'chirilgan id> }`

**7. Error case:**
- `NotFoundException`: 'Notification not found' (HTTP 404) - ko'rsatilgan ID bilan yozuv topilmasa.
- `ForbiddenException`: 'Only superadmin can access global notifications' (HTTP 403).
- `ForbiddenException` (HTTP 403) - bildirishnoma actorning scope'iga to'g'ri kelmasa (`assertWithinScope` orqali).

**8. DB struktura:**
- Tegishli model: `Notification`
- `id`: `String` / majburiy / `@default(uuid())` / `@db.Uuid`
- `userId`: `String` / ixtiyoriy (`?`) / `@db.Uuid`
- `title`: `String` / majburiy / `@db.VarChar(255)`
- `message`: `String` / majburiy
- `icon`: `NotificationIcon` / ixtiyoriy (`?`)
- `isRead`: `Boolean` / majburiy / `@default(false)`
- `createdAt`: `DateTime` / majburiy / `@default(now())` / `@db.Timestamptz(6)`
- `updatedAt`: `DateTime` / majburiy / `@updatedAt` / `@db.Timestamptz(6)`
- Chiquvchi (bu model → boshqa model):
  - `user -> User.id (onDelete: Cascade)`
- Kiruvchi (boshqa modellar → bu model):
  - (Yo'q)
- Index/Unique:
  - `@@index([userId])`
  - `@@index([isRead])`
