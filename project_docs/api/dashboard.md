# Dashboard — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| — | — | — | — | Hozircha dashboard uchun maxsus API endpoint mavjud emas |

## Tiplar
### DashboardStat (dashboard/pages/dashboard/dashboard.ts)
```typescript
interface DashboardStat {
  label: string;
  value: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| dashboard.ts | stats | property (DashboardStat[]) | [ { label: 'Jami xodimlar', value: '0' }, ... ] | Statik e'lon qilingan (hozircha o'zgarmaydi) |
