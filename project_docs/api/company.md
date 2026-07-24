# Company — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /company | — | Company | Kompaniya ma'lumotlarini olish |
| PUT | /company | Company | Company | Kompaniya ma'lumotlarini yangilash |

## Tiplar
### Company (core/models/company.ts)
```typescript
export interface Company {
  id?: string | number;
  name: string;
  address?: string;
  phone?: string;
  currency: string;
  workDayStart: string;
  workDayEnd: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| company-detail.ts | companyForm | property (FormGroup) | bo'sh forma qoidalari | .patchValue() orqali API dan kelgan ma'lumot tushadi yoki saqlanganda yangilanadi |
| company-detail.ts | message | property (string) | '' | qator orqali xabar (muvaffaqiyat/xatolik) tayinlanib, keyin setTimeout() orqali tozalanadi |
