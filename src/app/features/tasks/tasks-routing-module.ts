import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TaskBoard } from './pages/task-board/task-board';
import { TaskList } from './pages/task-list/task-list';
import { TaskForm } from './pages/task-form/task-form';
import { TaskDetail } from './pages/task-detail/task-detail';
import { TaskProjects } from './pages/task-projects/task-projects';

/**
 * Literal yo'llar `:id` dan oldin turishi shart — aks holda router
 * `list` yoki `new` ni task identifikatori deb qabul qiladi.
 */
const routes: Routes = [
  { path: '', component: TaskBoard },
  { path: 'list', component: TaskList, data: { breadcrumb: "Ro'yxat" } },
  { path: 'projects', component: TaskProjects, data: { breadcrumb: 'Loyihalar' } },
  { path: 'new', component: TaskForm, data: { breadcrumb: 'Yangi task' } },
  { path: ':id/edit', component: TaskForm, data: { breadcrumb: 'Tahrirlash' } },
  { path: ':id', component: TaskDetail, data: { breadcrumb: 'Task' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksRoutingModule {}
