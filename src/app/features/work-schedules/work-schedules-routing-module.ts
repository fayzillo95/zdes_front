import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkScheduleList } from './pages/work-schedule-list/work-schedule-list';
import { WorkScheduleForm } from './pages/work-schedule-form/work-schedule-form';

const routes: Routes = [
  { path: '', component: WorkScheduleList },
  { path: 'new', component: WorkScheduleForm, data: { breadcrumb: 'Yangi jadval' } },
  { path: ':id', component: WorkScheduleForm, data: { breadcrumb: 'Tahrirlash' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkSchedulesRoutingModule {}
