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
        path: 'tasks',
        data: { breadcrumb: 'Tasklar' },
        loadChildren: () => import('./features/tasks/tasks-module').then((m) => m.TasksModule),
      },
      {
        path: 'employees',
        data: { breadcrumb: 'Xodimlar' },
        loadChildren: () => import('./features/employees/employees-module').then((m) => m.EmployeesModule),
      },
      {
        path: 'attendance',
        data: { breadcrumb: 'Davomat' },
        loadChildren: () => import('./features/attendance/attendance-module').then((m) => m.AttendanceModule),
      },
      {
        path: 'branches',
        data: { breadcrumb: 'Filiallar' },
        loadChildren: () => import('./features/branches/branches-module').then((m) => m.BranchesModule),
      },
      {
        path: 'departments',
        data: { breadcrumb: "Bo'limlar" },
        loadChildren: () => import('./features/departments/departments-module').then((m) => m.DepartmentsModule),
      },
      {
        path: 'positions',
        data: { breadcrumb: 'Lavozimlar' },
        loadChildren: () => import('./features/positions/positions-module').then((m) => m.PositionsModule),
      },
      {
        path: 'companies',
        data: { breadcrumb: 'Kompaniyalar' },
        loadChildren: () => import('./features/company/company-module').then((m) => m.CompanyModule),
      },
      {
        path: 'company',
        data: { breadcrumb: 'Kompaniyalar' },
        loadChildren: () => import('./features/company/company-module').then((m) => m.CompanyModule),
      },
      {
        path: 'holidays',
        data: { breadcrumb: 'Bayramlar' },
        loadChildren: () => import('./features/holidays/holidays-module').then((m) => m.HolidaysModule),
      },
      {
        path: 'leaves',
        data: { breadcrumb: 'Ta\'tillar' },
        loadChildren: () => import('./features/leaves/leaves-module').then((m) => m.LeavesModule),
      },
      {
        path: 'notifications',
        data: { breadcrumb: 'Bildirishnomalar' },
        loadChildren: () => import('./features/notifications/notifications-module').then((m) => m.NotificationsModule),
      },
      {
        path: 'payroll',
        data: { breadcrumb: 'Ish haqi' },
        loadChildren: () => import('./features/payroll/payroll-module').then((m) => m.PayrollModule),
      },
      {
        path: 'salary-adjustments',
        data: { breadcrumb: "Maosh o'zgarishlari" },
        loadChildren: () =>
          import('./features/salary-adjustments/salary-adjustments-module').then((m) => m.SalaryAdjustmentsModule),
      },
      {
        path: 'settings',
        data: { breadcrumb: 'Sozlamalar' },
        loadChildren: () => import('./features/settings/settings-module').then((m) => m.SettingsModule),
      },
      {
        path: 'terminals',
        data: { breadcrumb: 'Terminallar' },
        loadChildren: () => import('./features/terminals/terminals-module').then((m) => m.TerminalsModule),
      },
      {
        path: 'work-schedules',
        data: { breadcrumb: 'Ish jadvallari' },
        loadChildren: () =>
          import('./features/work-schedules/work-schedules-module').then((m) => m.WorkSchedulesModule),
      },
      {
        path: 'advances',
        data: { breadcrumb: 'Avanslar' },
        loadChildren: () => import('./features/advances/advances-module').then((m) => m.AdvancesModule),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
