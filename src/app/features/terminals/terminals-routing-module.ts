import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminalList } from './pages/terminal-list/terminal-list';
import { TerminalForm } from './pages/terminal-form/terminal-form';

const routes: Routes = [
  {
    path: '',
    component: TerminalList
  },
  {
    path: 'new',
    component: TerminalForm
  },
  {
    path: ':id',
    component: TerminalForm
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TerminalsRoutingModule {}
