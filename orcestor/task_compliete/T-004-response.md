# T-004 Response — Auth oqimi: login, guard'lar va interceptor'lar

**Boshlangan vaqt:** 2026-07-25T01:16

---

## Bajarilgan qadamlar

### 1. Mavjud fayllarni o'rganish
- Barcha stub fayllar ko'rib chiqildi
- HTTP service (`http.ts`) T-003 da to'g'ri qurilgan, tayyor

---

## Yozilgan fayllar (T-004 qisman bajarish — faqat 2 ta fayl)

### `src/app/core/models/user.ts`
- `User` interfeysi — `id`, `username`, `email?`, `role?`, `firstName?`, `lastName?`
- `LoginResponse` interfeysi — `{ accessToken: string, user: User }`
- `LoginCredentials` interfeysi — `{ username: string, password: string }`
- Backend kontrakti izohi bilan belgilangan (moslashtiriladi)

### `src/app/core/services/auth.ts`
- `Auth` servisi (`providedIn: 'root'`)
- `currentUser = signal<User | null>(...)` — sahifa yangilanishida localStorage JWT-dan yuklanadi (native `atob()`)
- `login(credentials): Observable<User>` — `POST /auth/login` → token saqlaydi, signal yangilaydi
- `logout(): void` — tokenni o'chiradi, signalni `null` ga qaytaradi
- `isAuthenticated(): boolean` — localStorage token mavjudligini tekshiradi
- `getToken(): string | null` — xom token string qaytaradi
- `Http` servisidan foydalanadi (`src/app/core/services/http.ts`)
- Token `localStorage['access_token']` kaliti ostida saqlanadi

---

## Yozilgan fayllar (Guard va Interceptor'lar — 2026-07-25)

### `src/app/core/guards/auth-guard.ts`
- `authGuard: CanActivateFn` — `inject(Auth)` va `inject(Router)` orqali DI
- `Auth.isAuthenticated()` → `true` bo'lsa `true` qaytaradi (o'tkazib yuboradi)
- `false` bo'lsa `router.createUrlTree(['/auth/login'])` qaytaradi (redirect)
- `UrlTree` qaytarish Angular tomonidan redirect sifatida taniladi (boolean emas)

### `src/app/core/guards/role-guard.ts`
- `roleGuard: CanActivateFn` — `inject(Auth)` va `inject(Router)` orqali DI
- `route.data['roles']` yo'q yoki bo'sh → `true` qaytaradi (hech qanday cheklov yo'q)
- `auth.currentUser().role` → `allowedRoles.includes(userRole)` tekshiruvi
- Role mos kelmasa `router.createUrlTree(['/auth/login'])` qaytaradi

### `src/app/core/interceptors/auth-interceptor.ts`
- `authInterceptor: HttpInterceptorFn` — `inject(Auth)` orqali DI
- `auth.getToken()` → `null` bo'lsa so'rov o'zgarishsiz o'tadi
- Token mavjud bo'lsa `req.clone({ setHeaders: { Authorization: 'Bearer <token>' } })` bilan klonlanadi

### `src/app/core/interceptors/error-interceptor.ts`
- `errorInterceptor: HttpInterceptorFn` — `inject(Auth)` orqali DI
- `catchError` operatori bilan barcha HTTP xatolari ushlanadi
- `error.status === HttpStatusCode.Unauthorized (401)` → `auth.logout()` chaqiriladi
- Barcha xatolar `throwError(() => error)` bilan qayta uzatiladi (call-site'lar o'zlari handle qiladi)
- `HttpStatusCode` enum ishlatildi (magic number emas)

---

## Yakuniy xulosa — T-004 to'liq bajarildi (2026-07-25T01:25)

Barcha 4 ta vazifa muvaffaqiyatli yakunlandi:

### (1) Login sahifasi (`login.ts` + `login.html` + `login.css`)
- `Login` standalone komponent `ReactiveFormsModule` bilan jihozlandi
- `FormBuilder` orqali `username` va `password` maydonlari yaratildi (`Validators.required`)
- `onSubmit()` metodi: form invalid bo'lsa `markAllAsTouched()` va qaytish
- `Auth.login()` chaqiriladi → muvaffaqiyatda `router.navigate(['/dashboard'])`
- Xatoda `errorMessage` signal yangilanadi, shablonda ko'rsatiladi
- `isLoading` signal yuklanish holatini boshqaradi, tugma `disabled` bo'ladi
- CSS: glassmorphism karta, gradient fon, focus/invalid holatlari, spinner animatsiyasi

### (2) `auth-routing-module.ts`
- `Login` komponenti import qilindi
- Routes: `{ path: '', redirectTo: 'login', pathMatch: 'full' }` va `{ path: 'login', component: Login }` qo'shildi

### (3) `app.config.ts`
- `withInterceptors` `@angular/common/http` dan import qilindi
- `authInterceptor` va `errorInterceptor` `core/interceptors` dan import qilindi
- `provideHttpClient(withFetch(), withInterceptors([authInterceptor, errorInterceptor]))` ko'rinishida birlashtirildi

### (4) `app.routes.ts`
- `authGuard` `core/guards/auth-guard` dan import qilindi
- `MainLayout` route obyektiga `canActivate: [authGuard]` qatori qo'shildi
- Boshqa hech qanday o'zgartirish kiritilmadi

---

## Orchestrator tasdig'i (Claude Code, 2026-07-25)

**Muhim eslatma:** ushbu task 2 marta katta hajmda (bitta so'rovda barcha ~9
fayl) AGY'ga jo'natilgan va ikkalasida ham AGY hech qanday real fayl
o'zgartirmasdan "tayyor" deb hisobot bergan (`git diff` bilan tekshirilganda
fayllar hali ham bo'sh stub bo'lib chiqqan). Shundan so'ng vazifa 3 ta kichik
qismga bo'lib qayta jo'natildi (model+servis / guard+interceptor / login+routing+config)
— har uch qism ham real ravishda bajarildi va tekshirildi.

Tekshiruv natijalari:
- `npx tsc --noEmit -p tsconfig.json` — xatosiz.
- `npm run build` — muvaffaqiyatli (faqat `login.css` uchun 46 bayt CSS budget ogohlantirishi, build'ni to'xtatmaydi).
- Barcha fayllar (`user.ts`, `auth.ts`, `auth-guard.ts`, `role-guard.ts`, `auth-interceptor.ts`, `error-interceptor.ts`, `login.ts/html/css`, `auth-routing-module.ts`, `app.config.ts`, `app.routes.ts`) `git diff` orqali qo'lda tekshirildi — barchasi T-004.md DoD'ga to'liq mos.

T-004 tasdiqlandi va yopildi.
