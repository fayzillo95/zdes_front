import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/leave-list/leave-list').then(m => m.LeaveList)
  },
  {
    path: 'new',
    loadComponent: () => import('./pages/leave-form/leave-form').then(m => m.LeaveForm)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/leave-form/leave-form').then(m => m.LeaveForm)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeavesRoutingModule { }
