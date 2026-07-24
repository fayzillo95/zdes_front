import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentList } from './pages/department-list/department-list';
import { DepartmentForm } from './pages/department-form/department-form';

const routes: Routes = [
  {
    path: '',
    component: DepartmentList,
  },
  {
    path: 'new',
    component: DepartmentForm,
  },
  {
    path: ':id/edit',
    component: DepartmentForm,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
