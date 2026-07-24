# Work Schedules — API

## Endpoint'lar
| Metod | Yo'l | So'rov tipi | Javob tipi | Izoh |
|---|---|---|---|---|
| GET | /work-schedules | — | WorkSchedule[] | Barcha ish jadvallarini olish |
| GET | /work-schedules/:id | — | WorkSchedule | Bitta ish jadvalini olish |
| POST | /work-schedules | WorkSchedule | WorkSchedule | Yangi ish jadvalini yaratish |
| PUT | /work-schedules/:id | WorkSchedule | WorkSchedule | Ish jadvalini yangilash |
| DELETE | /work-schedules/:id | — | void | Ish jadvalini o'chirish |

## Tiplar
### WorkSchedule (src/app/core/models/work-schedule.ts)
```typescript
export interface WorkSchedule {
  id?: number;
  name: string;
  startTime: string;
  endTime: string;
}
```

## State (sahifalar bo'yicha)
| Sahifa | O'zgaruvchi | Turi (signal/property) | Boshlang'ich qiymat | Qanday yangilanadi |
|---|---|---|---|---|
| src/app/features/work-schedules/pages/work-schedule-list/work-schedule-list.ts | workSchedules | property (WorkSchedule[]) | [] | loadWorkSchedules() metodida xizmatdan yuklanganda o'rnatiladi |
| src/app/features/work-schedules/pages/work-schedule-form/work-schedule-form.ts | form | property (FormGroup) | fb.group(...) | FormBuilder yordamida yaratiladi, foydalanuvchi orqali va tahrirlash rejimida patchValue bilan yangilanadi |
| src/app/features/work-schedules/pages/work-schedule-form/work-schedule-form.ts | isEditMode | property (boolean) | false | ngOnInit() da url dan olingan id mavjudligiga qarab true qilinadi |
| src/app/features/work-schedules/pages/work-schedule-form/work-schedule-form.ts | scheduleId | property (number \| undefined) | undefined | ngOnInit() da url dan olingan id orqali o'rnatiladi |
