import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeForm } from './pages/employee-form/employee-form';
import { EmployeeDetail } from './pages/employee-detail/employee-detail';

const routes: Routes = [
  { path: '', component: EmployeeList },
  { path: 'new', component: EmployeeForm, data: { breadcrumb: 'Yangi xodim' } },
  { path: ':id/edit', component: EmployeeForm, data: { breadcrumb: 'Tahrirlash' } },
  { path: ':id', component: EmployeeDetail, data: { breadcrumb: "Ma'lumot" } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
