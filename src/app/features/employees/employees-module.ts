import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployeesRoutingModule } from './employees-routing-module';
import { BranchCardComponent } from './components/branch-card/branch-card.component';
import { DepartmentCardComponent } from './components/department-card/department-card.component';

@NgModule({
  // Standalone components are imported instead of declared
  imports: [
    CommonModule,
    EmployeesRoutingModule,
    BranchCardComponent,
    DepartmentCardComponent,
  ],
})
export class EmployeesModule {}
