# Settings — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /settings | - | CompanySettings | Kompaniya sozlamalarini olish |
| PUT | /settings | CompanySettings | CompanySettings | Kompaniya sozlamalarini yangilash |

## Tiplar
### CompanySettings (features/settings/services/setting.ts)
```typescript
export interface CompanySettings {
  companyName: string;
  currency: string;
  workDayStart: string;
  workDayEnd: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| settings-page.ts | saved | signal (boolean) | false | ma'lumotlar saqlanganda .set(true) qilinadi |
| settings-page.ts | loading | signal (boolean) | false | so'rov boshlanganda .set(true), tugaganda .set(false) |
| settings-page.ts | form | property (FormGroup) | boshlang'ich sozlamalar | service.get() natijasi obuna orqali .patchValue() qilinadi, va UI dan foydalanuvchi kiritishi |
