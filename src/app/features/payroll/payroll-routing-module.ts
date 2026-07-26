import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollList } from './pages/payroll-list/payroll-list';
import { PayrollDetail } from './pages/payroll-detail/payroll-detail';

const routes: Routes = [
  { path: '', component: PayrollList },
  { path: ':id', component: PayrollDetail, data: { breadcrumb: 'Batafsil' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayrollRoutingModule {}
