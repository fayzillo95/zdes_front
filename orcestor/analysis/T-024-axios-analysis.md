# T-024: Axios'ga o'tish imkoniyati tahlili

## 1. Variantlar narxi (Cost) va foydasi (Benefit) solishtiruvi

### Variant A: Kam-ta'sirli (`Http` xizmati ichida axios + `Observable` ga o'rash)
- **Narxi (Cost):** Kichik (low cost). Faqat `src/app/core/services/http.ts` va unga bog'liq core konfiguratsiya (interceptor) fayllar o'zgaradi (jami 3-4 ta fayl). Loyihadagi 15+ feature service va ularni ishlatadigan barcha komponentlar o'zgarmasdan qoladi.
- **Foydasi (Benefit):** Tizimning mavjud reaktiv arxitekturasi buzilmaydi. Angular'ning `Observable` asosi, `takeUntilDestroyed()`, `async` pipe va murakkab RxJS operatorlaridan foydalanish imkoniyati saqlanib qoladi.

### Variant B: Katta-ta'sirli (To'liq Promise / async-await arxitekturasiga o'tish)
- **Narxi (Cost):** Juda katta (high cost). `http.ts`, barcha 15+ feature service va xizmatlarni chaqiruvchi 40+ komponent to'liq refaktor (Observable'dan Promise'ga) qilinishi kerak bo'ladi.
- **Foydasi (Benefit):** Loyiha bitta standartli (faqat Promise) asinxron arxitekturaga o'tadi, kod nisbatan "tekisroq" (flat) ko'rinishga keladi. Ammo bu Angular muhitida reaktivlikni yo'qotish hisobiga erishiladi.

## 2. Interceptor'larni axios mexanizmiga ko'chirish rejasi

Angular'ning `HTTP_INTERCEPTORS` DI mexanizmi axios uchun ishlamaydi. Shuning uchun mavjud `auth-interceptor.ts` va `error-interceptor.ts` mantig'i bevosita `Http` xizmati ichida (yoki axios konfig faylida) axios interceptor'lari orqali qayta yoziladi.

**Reja:**
- `Http` xizmatiga `Auth` xizmati injekt qilinadi: `private readonly auth = inject(Auth);`.
- **Request Interceptor (`auth-interceptor.ts` o'rniga):**
  ```typescript
  this.axiosInstance.interceptors.request.use((config) => {
    const token = this.auth.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
  ```

## 3. `environment.apiUrl` bazasini axios `baseURL` ga ulash

Axios'da asosiy API manzilini global tarzda `baseURL` konfigi orqali sozlash mumkin. `Http` xizmatida `axios.create()` yordamida instansiya yaratilayotganda bu biriktiriladi:

```typescript
import { environment } from '../../../environments/environment';
import axios from 'axios';

// Http class ichida:
private readonly axiosInstance = axios.create({
  baseURL: environment.apiUrl,
});
```
Bu orqali har bir zaprosda qo'lda `buildUrl` qilish funksiyasi qisqaradi.

## 4. Xato holatlarini (401) axios response interceptor'ida takrorlash

`error-interceptor.ts` dagi "401 kelganda logout qilish" mantig'ini axios response interceptor'iga qo'shamiz. Boshqa barcha xatolar davom ettiriladi:

```typescript
this.axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) { // 401 Unauthorized
      this.auth.logout();
    }
    return Promise.reject(error);
  }
);
```

## 5. Aniq tavsiya va T-025 uchun amalga oshirish rejasi

**TAVSIYA:** Men qat'iy ravishda **Variant A (Kam-ta'sirli yo'l)** ni tanlashni tavsiya qilaman.
**Sababi:** Angular freymvorki reaktiv dasturlash (RxJS) ga chuqur asoslangan. `Observable` lardan to'liq voz kechib Promise'ga o'tish (Variant B) Angular'da juda kuchli sanalgan xotira tozalash (`takeUntilDestroyed`), race-condition oldini olish (`switchMap`) kabi qulayliklarni buzadi va 40+ komponentni keraksiz ravishda o'zgartirishni talab qiladi. Kam-ta'sirli yo'l orqali biz ham axios'ga o'tamiz, ham TASHQI API uchun RxJS arxitekturasini saqlab qolamiz.

### T-025 uchun bosqichma-bosqich (dispatch'larga bo'lingan) reja:
1. **Bosqich 1: Bog'liqlikni qo'shish:** `npm install axios` yordamida paketni loyihaga o'rnatish.
2. **Bosqich 2: Axios instansiya va Interceptor'lar:** `src/app/core/services/http.ts` ichida `axios.create({ baseURL: environment.apiUrl })` ni yaratish. Uning Request va Response interceptor'larini (Auth va 401 Error) konstruktorda sozlash.
3. **Bosqich 3: HTTP metodlarini adaptatsiya qilish:** `get`, `post`, `put`, `patch`, `delete` metodlari qaytaruvchi Promise'larni `rxjs` ning `defer()` yoki `from()` funksiyalari orqali `Observable<T>` ga o'rash va data'ni (response.data) qaytarish.
   *(Masalan: `return from(this.axiosInstance.get<T>(path, { params, headers }).then(res => res.data));`)*
4. **Bosqich 4: Eski fayllarni tozalash:** Endi keraksiz bo'lib qolgan `auth-interceptor.ts` va `error-interceptor.ts` fayllarini o'chirish.
5. **Bosqich 5: App config'ni yangilash:** `app.config.ts` dan Angular'ning `provideHttpClient` hamda `withInterceptors` chaqiruvlarini (agar ular boshqa maqsadlar uchun shart bo'lmasa) olib tashlash.
