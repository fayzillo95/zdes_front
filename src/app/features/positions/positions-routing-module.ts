import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionList } from './pages/position-list/position-list';
import { PositionForm } from './pages/position-form/position-form';

const routes: Routes = [
  { path: '', component: PositionList },
  { path: 'new', component: PositionForm },
  { path: ':id/edit', component: PositionForm },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionsRoutingModule {}
