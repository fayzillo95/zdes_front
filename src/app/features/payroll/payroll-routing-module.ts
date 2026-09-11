import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollList } from './pages/payroll-list/payroll-list';
import { PayrollDetail } from './pages/payroll-detail/payroll-detail';
import { PayrollForm } from './pages/payroll-form/payroll-form';

const routes: Routes = [
  { path: '', component: PayrollList },
  { path: 'new', component: PayrollForm, data: { breadcrumb: 'Yangi' } },
  { path: ':id/edit', component: PayrollForm, data: { breadcrumb: 'Tahrirlash' } },
  { path: ':id', component: PayrollDetail, data: { breadcrumb: 'Batafsil' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
