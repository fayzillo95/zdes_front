import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeForm } from './pages/employee-form/employee-form';
import { EmployeeDetail } from './pages/employee-detail/employee-detail';

const routes: Routes = [
  { path: '', component: EmployeeList },
  { path: 'new', component: EmployeeForm },
  { path: ':id/edit', component: EmployeeForm },
  { path: ':id', component: EmployeeDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
