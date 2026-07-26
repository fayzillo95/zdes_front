import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdjustmentList } from './pages/adjustment-list/adjustment-list';
import { AdjustmentForm } from './pages/adjustment-form/adjustment-form';

const routes: Routes = [
  { path: '', component: AdjustmentList },
  { path: 'new', component: AdjustmentForm, data: { breadcrumb: "Yangi o'zgarish" } },
  { path: ':id/edit', component: AdjustmentForm, data: { breadcrumb: 'Tahrirlash' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalaryAdjustmentsRoutingModule {}
