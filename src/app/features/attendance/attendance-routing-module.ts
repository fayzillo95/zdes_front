import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceList } from './pages/attendance-list/attendance-list';
import { AttendanceDetail } from './pages/attendance-detail/attendance-detail';
import { Scanner } from './pages/scanner/scanner';
import { AttendanceForm } from './pages/attendance-form/attendance-form';

const routes: Routes = [
  { path: '', component: AttendanceList },
  { path: 'scanner', component: Scanner, data: { breadcrumb: 'Skaner' } },
  { path: 'new', component: AttendanceForm, data: { breadcrumb: 'Yangi yozuv' } },
  { path: ':id', component: AttendanceDetail, data: { breadcrumb: 'Batafsil' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
