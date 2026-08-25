import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeList } from './pages/employee-list/employee-list';
import { EmployeeForm } from './pages/employee-form/employee-form';
import { EmployeeDetail } from './pages/employee-detail/employee-detail';
import { BranchCardComponent } from './components/branch-card/branch-card.component';
import { DepartmentCardComponent } from './components/department-card/department-card.component';

const routes: Routes = [
  { path: '', component: EmployeeList },
  { path: 'new', component: EmployeeForm, data: { breadcrumb: 'Yangi xodim' } },
  { path: ':id/edit', component: EmployeeForm, data: { breadcrumb: 'Tahrirlash' } },
  { path: ':id', component: EmployeeDetail, data: { breadcrumb: "Ma'lumot" } },
  { path: 'branches', component: BranchCardComponent, data: { breadcrumb: 'Filiallar' } },
  { path: 'departments', component: DepartmentCardComponent, data: { breadcrumb: 'Bo‘limlar' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
