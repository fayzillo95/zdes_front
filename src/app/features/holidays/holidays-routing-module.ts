import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/holiday-list/holiday-list').then(c => c.HolidayList)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/holiday-form/holiday-form').then(c => c.HolidayForm),
    data: { breadcrumb: 'Yangi bayram' }
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./pages/holiday-form/holiday-form').then(c => c.HolidayForm),
    data: { breadcrumb: 'Tahrirlash' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HolidaysRoutingModule {}
