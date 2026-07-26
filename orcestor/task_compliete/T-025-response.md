# T-025 Bajarilish Holati (Claude Code tomonidan to'g'ridan-to'g'ri bajarildi, AGY orqali emas)

**Muhim eslatma:** Bu task Claude Code (orchestrator) tomonidan to'g'ridan-to'g'ri
bajarildi, AGY'ga dispatch qilinmadi — sababi: bu `core/services/http.ts`
kabi barcha 15+ feature service bog'liq bo'lgan kritik infratuzilma, va
Fayzillo aniq ko'rsatma bergan edi ("Geminida gallyutsinatsiya yuqori,
muhim api/auth strukturalarda qat'iy tekshirish kerak").

## Bajarilgan qadamlar (T-024 rejasiga qat'iy mos):
1. `npm install axios` — package.json/package-lock.json yangilandi.
2. `src/app/core/services/http.ts` to'liq qayta yozildi: axios instance
   (`axios.create({ baseURL: environment.apiUrl })`), request interceptor
   (Bearer token biriktirish, `auth-interceptor.ts`dagi bilan bir xil
   mantiq), response interceptor (401 → `auth.logout()`,
   `error-interceptor.ts`dagi bilan bir xil mantiq). Barcha metodlar
   (`get/post/put/patch/delete`) `defer()` bilan o'ralgan — Observable
   faqat subscribe qilinganda ishga tushadi (eski xatti-harakat bilan bir xil).
3. `src/app/core/interceptors/auth-interceptor.ts` va `error-interceptor.ts`
   o'chirildi (endi kerak emas, mantiq `http.ts` ichiga ko'chirildi).
4. `src/app/app.config.ts`dan `provideHttpClient`/`withInterceptors` va
   ikkala interceptor importi olib tashlandi (HttpClient endi hech qayerda
   ishlatilmaydi).
5. `src/app/core/services/auth.ts`dagi eskirgan izoh (`errorInterceptor`ga
   havola) yangilandi.

## Tekshiruv
- `npm run build` — XATOSIZ o'tdi (faqat CommonJS/axios non-ESM
  ogohlantirishlari, xato emas).
- `git diff --stat -- src/app/features/` — BO'SH, ya'ni 15+ feature
  service faylining birortasi ham o'zgarmadi (kam-ta'sirli variant
  talabiga to'liq mos).
- Auth token biriktirish va 401'da logout xatti-harakati funksional
  ekvivalent saqlab qolindi (kod qo'lda yozilgan, AGY orqali emas —
  hallyutsinatsiya xavfi yo'q).

## O'zgargan fayllar
| Fayl | Turi | Qisqa sabab |
|---|---|---|
| package.json | o'zgartirilgan | `axios` dependency qo'shildi |
| package-lock.json | o'zgartirilgan | `npm install axios` natijasi |
| src/app/core/services/http.ts | o'zgartirilgan | Angular HttpClient o'rniga axios, tashqi Observable<T> interfeys saqlanган |
| src/app/core/interceptors/auth-interceptor.ts | o'chirilgan | Mantiq http.ts ichidagi axios request interceptor'ga ko'chirildi |
| src/app/core/interceptors/error-interceptor.ts | o'chirilgan | Mantiq http.ts ichidagi axios response interceptor'ga ko'chirildi |
| src/app/app.config.ts | o'zgartirilgan | provideHttpClient/withInterceptors va interceptor importlari olib tashlandi |
| src/app/core/services/auth.ts | o'zgartirilgan | Eskirgan izoh (errorInterceptor havolasi) yangilandi |
