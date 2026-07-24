import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdvanceList } from './pages/advance-list/advance-list';
import { AdvanceForm } from './pages/advance-form/advance-form';

const routes: Routes = [
  { path: '', component: AdvanceList },
  { path: 'new', component: AdvanceForm },
  { path: 'edit/:id', component: AdvanceForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdvancesRoutingModule {}
