# Auth — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| POST | /auth/login | LoginCredentials | LoginResponse | Foydalanuvchini tizimga kiritish (taxminiy backend endpoint) |

## Tiplar
### User (core/models/user.ts)
```typescript
export interface User {
  id: string | number;
  username: string;
  email?: string;
  /** Role string, e.g. 'admin' | 'user' | 'manager' — extend as needed */
  role?: string;
  /** Optional display name */
  firstName?: string;
  lastName?: string;
}
```

### LoginResponse (core/models/user.ts)
```typescript
export interface LoginResponse {
  accessToken: string;
  user: User;
}
```

### LoginCredentials (core/models/user.ts)
```typescript
export interface LoginCredentials {
  username: string;
  password: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| login.ts | form | property (FormGroup) | { username: '', password: '' } | Foydalanuvchi kiritishi orqali yangilanadi, ReactiveForm |
| login.ts | errorMessage | signal (string \| null) | null | .set() orqali (xatolik bo'lsa) |
| login.ts | isLoading | signal (boolean) | false | .set(true/false) orqali so'rov yuborilganda |
| auth.ts (service) | currentUser | signal (User \| null) | _loadUserFromToken() natijasi | .set() orqali login va logout vaqtida yangilanadi |
