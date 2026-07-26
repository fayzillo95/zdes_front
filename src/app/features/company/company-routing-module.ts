import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompanyList } from './pages/company-list/company-list';
import { CompanyForm } from './pages/company-form/company-form';

const routes: Routes = [
  { path: '', component: CompanyList },
  { path: 'new', component: CompanyForm, data: { breadcrumb: 'Yangi kompaniya' } },
  { path: ':id/edit', component: CompanyForm, data: { breadcrumb: 'Tahrirlash' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompanyRoutingModule {}
