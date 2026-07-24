# Notifications — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /notifications | - | Notification[] | Barcha bildirishnomalarni olish |
| PATCH | /notifications/:id | { read: true } | Notification | Bildirishnomani o'qilgan holatga (read: true) o'tkazish |

## Tiplar
### Notification (core/models/notification.ts)
```typescript
export interface Notification {
  id: string | number;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| notification-list.ts | notifications | signal (Notification[]) | [] | service.getAll() dan olingach .set() bilan. O'qilganda .update() orqali array ichidagi ma'lumot qisman yangilanadi |
| notification-list.ts | loading | signal (boolean) | false | so'rov yuborilganda .set(true), tugaganda .set(false) |
