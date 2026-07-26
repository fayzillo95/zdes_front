import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceList } from './pages/advance-list/advance-list';
import { AdvanceForm } from './pages/advance-form/advance-form';

const routes: Routes = [
  { path: '', component: AdvanceList },
  { path: 'new', component: AdvanceForm, data: { breadcrumb: 'Yangi avans' } },
  { path: 'edit/:id', component: AdvanceForm, data: { breadcrumb: 'Tahrirlash' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancesRoutingModule {}
