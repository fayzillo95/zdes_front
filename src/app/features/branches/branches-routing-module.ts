import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BranchList } from './pages/branch-list/branch-list';
import { BranchForm } from './pages/branch-form/branch-form';

const routes: Routes = [
  { path: '', component: BranchList },
  { path: 'new', component: BranchForm, data: { breadcrumb: 'Yangi filial' } },
  { path: ':id/edit', component: BranchForm, data: { breadcrumb: 'Tahrirlash' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BranchesRoutingModule {}
