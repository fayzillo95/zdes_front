import { Routes } from '@angular/router';
import { MainLayout } from './shared/components/layout/main-layout/main-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./features/dashboard/dashboard-module').then((m) => m.DashboardModule),
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employees/employees-module').then((m) => m.EmployeesModule),
      },
      {
        path: 'attendance',
        loadChildren: () => import('./features/attendance/attendance-module').then((m) => m.AttendanceModule),
      },
      {
        path: 'branches',
        loadChildren: () => import('./features/branches/branches-module').then((m) => m.BranchesModule),
      },
      {
        path: 'departments',
        loadChildren: () => import('./features/departments/departments-module').then((m) => m.DepartmentsModule),
      },
      {
        path: 'positions',
        loadChildren: () => import('./features/positions/positions-module').then((m) => m.PositionsModule),
      },
      {
        path: 'company',
        loadChildren: () => import('./features/company/company-module').then((m) => m.CompanyModule),
      },
      {
        path: 'holidays',
        loadChildren: () => import('./features/holidays/holidays-module').then((m) => m.HolidaysModule),
      },
      {
        path: 'leaves',
        loadChildren: () => import('./features/leaves/leaves-module').then((m) => m.LeavesModule),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notifications-module').then((m) => m.NotificationsModule),
      },
      {
        path: 'payroll',
        loadChildren: () => import('./features/payroll/payroll-module').then((m) => m.PayrollModule),
      },
      {
        path: 'salary-adjustments',
        loadChildren: () =>
          import('./features/salary-adjustments/salary-adjustments-module').then((m) => m.SalaryAdjustmentsModule),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings-module').then((m) => m.SettingsModule),
      },
      {
        path: 'terminals',
        loadChildren: () => import('./features/terminals/terminals-module').then((m) => m.TerminalsModule),
      },
      {
        path: 'work-schedules',
        loadChildren: () =>
          import('./features/work-schedules/work-schedules-module').then((m) => m.WorkSchedulesModule),
      },
      {
        path: 'advances',
        loadChildren: () => import('./features/advances/advances-module').then((m) => m.AdvancesModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
