import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceList } from './pages/attendance-list/attendance-list';
import { AttendanceDetail } from './pages/attendance-detail/attendance-detail';
import { Scanner } from './pages/scanner/scanner';

const routes: Routes = [
  { path: '', component: AttendanceList },
  { path: 'scanner', component: Scanner },
  { path: ':id', component: AttendanceDetail }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
